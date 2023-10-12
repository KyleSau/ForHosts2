"use client";

import { Image, Trash2, Loader2 } from 'lucide-react';
import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, IMAGE_SIZE_LIMIT_BYTES, IMAGE_SIZE_LIMIT_MB } from '@/lib/constants';
import React, { useState, useEffect, useRef } from 'react';
import EditorWarningModal, { EditorWarningModalDataType, EditorWarningModalDataTemplate } from "@/components/editor/warning-confirmation-modal";
import { humanReadableFileSize, placeholderBlurhash } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

import { put, type BlobResult } from '@vercel/blob'; // test
import {
  uploadBlobMetadata, 
  listAllBlobsInStore, 
  deleteBlobFromStore, 
  deleteBlobMetadata,
  deleteAndReindex,
  listAllBlobMetadata,
  updateBlobMetadata,
  swapBlobMetadata
} from '@/lib/blob_actions';
import { Image as ImagePrismaSchema, Post } from "@prisma/client";
import { hostname } from 'os';
import BlurImage from '../blur-image';
import Placeholder from '@tiptap/extension-placeholder';

//DEV MODE
const DEBUG_TOGGLE = true;
const TOP_DRAGGABLE_AREA_TOGGLE = false;

//abstract data type used to handle file operations in this editor
interface FileDataObject extends Partial<ImagePrismaSchema> {
  file?: File | null, //for handling local-only files
  localBlobUrl?: string,
  inBlobStore: boolean,
  isUploading: boolean
}

export function FileClickDragDrop({ componentId, data, currentFileDataObjects }: { componentId: string, data: any, currentFileDataObjects: any }) {
  //important consts
  const SITE_ID = data["site"]["id"];
  const POST_ID = data["id"];

  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>([]);

  //states for confirmation modal for deleting pictures
  const [editorWarningModalOpen, setEditorWarningModalOpen] = useState<boolean>(false);
  const [editorWarningModalData, setEditorWarningModalData] = useState<EditorWarningModalDataType>(EditorWarningModalDataTemplate);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [imageEaseTransition, setImageEaseTranstion] = useState<boolean>(false);

  //TEST
  const [blobsFromStoreTest, setBlobsFromStoreTest] = useState<BlobResult[]>([]);
  const [blobMetadataTest, setBlobMetadataTest] = useState<ImagePrismaSchema[]>([]);

  useEffect(() => {
    // console.log("useEffect entered. getting existing blobs");
    // refreshMetadata();
    setFileDataObjects([...currentFileDataObjects]);
  }, []);

  const uploadFileDataObjects = async (fileDataObjects: FileDataObject[]) => {
    const fileDataObjectsCopy = [...fileDataObjects];
    console.log("fileDataObjectsCopy: ", fileDataObjectsCopy);

    for (let fdoIdx: number = 0; fdoIdx < fileDataObjects.length; fdoIdx++) {
      const fdo: FileDataObject = fileDataObjects[fdoIdx];
      console.log(">>> fdo: ", fdo);
      if (fdo.inBlobStore) {
        // console.log("111111111111111111111111111111111111111");
        if (fdo?.id && fdo.orderIndex != fdoIdx) {
          const updateBlobMetadataResponse = await updateBlobMetadata(fdo.id, { orderIndex: fdoIdx });
          const newUpdatedFile: FileDataObject = {
            inBlobStore: true,
            isUploading: false,
            ...updateBlobMetadataResponse
          }
          fileDataObjectsCopy[fdoIdx] = newUpdatedFile;
        }
      }
      else {
        // console.log("2222222222222222222222222222222222222222222");
        const file = fdo?.file;
        if (file) {
          // console.log("file.name: ", file.name);
          // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
          const blobResult = await put(file.name, file, {
            access: 'public',
            handleBlobUploadUrl: '/api/upload'
          });

          const uploadBlobMetadataResponse = await uploadBlobMetadata(blobResult, fdoIdx, POST_ID, SITE_ID);
          // console.log("uploadBlobMetadataResponse: fdoIdx: ", fdoIdx, "    responseValue: ", uploadBlobMetadataResponse);
          const newUploadedFile: FileDataObject = {
            inBlobStore: true,
            isUploading: false,
            ...uploadBlobMetadataResponse
          }
          fileDataObjectsCopy[fdoIdx] = newUploadedFile;
        }
      }
      setFileDataObjects(fileDataObjectsCopy); // this enables async spinner for each image 
    };
    return fileDataObjectsCopy;
  }

  const addFilesToLocalStateAndDoUpload = async (newFiles: (File | null)[]) => {
    setUploadInProgress(true);

    //first check if adding the new files causes currently uploaded pics to surpass the upload threshold; show modal if so
    if (fileDataObjects.length > IMAGE_UPLOAD_QUANTITY_LIMIT || fileDataObjects.length + newFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT) {
      setEditorWarningModalData({
        ...editorWarningModalData,
        idxToRemove: -1,
        message: `Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`
      });
      setEditorWarningModalOpen(true);
    } else {
      const newFilesAboveSizeLimit: (File | null)[] = [];
      const newFilesBelowSizeLimit: FileDataObject[] = [];
      const a = hostname;
      // console.log("HOSTNAME: ", a);

      newFiles.forEach((file: File | null, fileIdx: number) => {
        // console.log("new file: ", file);
        if (file) {
          const fileSizeBytes = file?.size ? file.size : IMAGE_SIZE_LIMIT_BYTES;
          if (fileSizeBytes > IMAGE_SIZE_LIMIT_BYTES) {
            newFilesAboveSizeLimit.push(file);
          } else {
            const localBlobUrl = URL.createObjectURL(file);
            // console.log("localBlobUrl: ", localBlobUrl);
            const newFileNotStored: FileDataObject = {
              file,
              localBlobUrl,
              inBlobStore: false,
              orderIndex: fileDataObjects.length + fileIdx,
              isUploading: true
            }
            newFilesBelowSizeLimit.push(newFileNotStored);
          }
        }
      });
      const updatedFdoArray = [...fileDataObjects, ...newFilesBelowSizeLimit];
      // console.log("updatedFdoArray first time: ", updatedFdoArray);
      setFileDataObjects(updatedFdoArray);

      //if needed, throw up modal informing user that files above the size limit were not added
      if (newFilesAboveSizeLimit.length > 0) {
        const filesAndSizes = newFilesAboveSizeLimit.map((file: File | null) => `${file?.name} (${humanReadableFileSize(file?.size)})`).join("\n");
        setEditorWarningModalData({
          ...editorWarningModalData,
          idxToRemove: -2,
          message: `The following files were not uploaded because they exceed the file size limit of ${IMAGE_SIZE_LIMIT_MB} MB:\n` + filesAndSizes
        });
        setEditorWarningModalOpen(true);
      }

      const updatedFdoArrayAfterUpload = await uploadFileDataObjects(updatedFdoArray);
      // console.log("updatedFdoArray second time: ", updatedFdoArrayAfterUpload);
      setFileDataObjects(updatedFdoArrayAfterUpload);
    }
    setUploadInProgress(false);
  };

  const uploadFilesToBlobStoreAndMetadataToDB = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log("uploadFilesToBlobStoreAndMetadataToDB entered");
    // console.log("event: ", event);
    event.preventDefault();
    const uploadPromiseResponse = await uploadFileDataObjects(fileDataObjects);
    // console.log("uploadPromiseResponse: ", uploadPromiseResponse);
    setFileDataObjects(uploadPromiseResponse as FileDataObject[]);
  };

  const handleAddFilesToLocalStateViaOpenWindow = (event: any) => {
    // console.log("handleAddFilesToLocalStateViaOpenWindow entered");
    event.preventDefault();
    const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
      .filter((file: File) => PERMITTED_FILE_TYPES.has(file.type));
    addFilesToLocalStateAndDoUpload(newFiles);
  };

  const handleDropNewFilesToLocalState = (event: any) => {
    // console.log("handleDropNewFilesToLocalState entered");
    event.preventDefault();
    const dataTransferItems: DataTransferItemList = event.dataTransfer.items;
    let newFiles: (File | null)[] = [];
    if (dataTransferItems) {
      newFiles = Array.from(dataTransferItems)
        .filter((item: DataTransferItem) => item.kind === FILE_CONSTS.FILE && PERMITTED_FILE_TYPES.has(item.type))
        .map((item: DataTransferItem) => item.getAsFile());
    } else {
      const dataTransferFiles: FileList = event.dataTransfer.files;
      newFiles = Array.from(dataTransferFiles);
    }
    addFilesToLocalStateAndDoUpload(newFiles);
  };

  const deleteFileFromLocalStateAndDB = async (idxToRemove: number) => {
    console.log("deleteFileFromLocalStateAndDB entered: ", idxToRemove);

    const updatedFileDataObjects = [...fileDataObjects];
    const [imageDataToDelete] = updatedFileDataObjects.splice(idxToRemove, 1);

    if (imageDataToDelete.id) {
      await deleteAndReindex(imageDataToDelete.id, idxToRemove);
    }
    if (imageDataToDelete.url) {
      await deleteBlobFromStore(imageDataToDelete.url);
    }

    setFileDataObjects(updatedFileDataObjects);
    setEditorWarningModalOpen(false); //remove modal
  };

  const handleImageDeleteIconClicked = (idxToRemove: number) => {
    const fdoToRemove = fileDataObjects[idxToRemove];
    const fileName = fdoToRemove.inBlobStore ? fdoToRemove.fileName : fdoToRemove.file?.name;
    setEditorWarningModalData({
      ...editorWarningModalData,
      idxToRemove,
      message: "Are you sure you want to delete picture: " + fileName
    });
    setEditorWarningModalOpen(true);
  };

  // const handleDragStart = (event: any, idx: number) => {
  //   console.log("handleDragStart entered: idx chosen:", idx);
  //   if (!uploadInProgress) {
  //     setDraggedIdx(idx);
  //     event.dataTransfer.effectAllowed = "move";
  //   }
  // };

  const handleDragOver = (event: any) => {
    console.log("handleDragOver entered");
    event.preventDefault();
    event.stopPropagation();
  };

  // const handleDropForMove = async (event: any, idx: number) => {
  //   console.log("handleDropForMove entered: idx chosen:", idx); //to idx
  //   console.log("draggedIdx: ", draggedIdx); //from idx
  //   event.preventDefault();
  //   if (!uploadInProgress && (draggedIdx !== null && draggedIdx !== idx)) {
  //     // Swap in addedFileArray
  //     const fileDataObjectsCopy = [...fileDataObjects];
  //     const tempFile = fileDataObjectsCopy[draggedIdx];
  //     fileDataObjectsCopy[draggedIdx] = fileDataObjectsCopy[idx];
  //     fileDataObjectsCopy[idx] = tempFile;
  //     setFileDataObjects(fileDataObjectsCopy);

  //     swapBlobMetadata(data.id, idx, tempFile.id!);

  //     // const fileDataObjectsCopyAfterUpload = await uploadFileDataObjects(fileDataObjectsCopy);
  //     // console.log("BBBBB: ", fileDataObjectsCopyAfterUpload);
  //   }
  //   setDraggedIdx(null); // Reset the dragged item index
  // };

  const onDragEnd = async (result: DropResult) => {
    console.log("onDragEnd entered!!!: result: ", result);
    if (!result.destination) return;
    console.log("updatedFDO BEFORE: ", fileDataObjects);
    const updatedFileDataObjects = [...fileDataObjects];
    const [movedItem] = updatedFileDataObjects.splice(result.source.index, 1);
    updatedFileDataObjects.splice(result.destination.index, 0, movedItem);
    console.log("updatedFDO AFTER: ", updatedFileDataObjects);

    const response = await swapBlobMetadata(POST_ID, result.destination.index, movedItem.id? movedItem.id: "");
    console.log("response: ", response);
    setFileDataObjects(updatedFileDataObjects);
  };

  //TEST
  const handleListAllblobsInStore = async () => {
    console.log("[TEST] handleListAllblobsInStore called");
    const blobsInStore = await listAllBlobsInStore();
    console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    setBlobsFromStoreTest(blobsInStore);
  };

  //TEST
  const handlePurgeAllBlobsInStore = async () => {
    console.log("[TEST] handlePurgeAllBlobsInStore called");
    blobsFromStoreTest.forEach((br: BlobResult) => {
      if (br.url) {
        const url = br.url;
        const response = deleteBlobFromStore(url);
        response.then((responseJson: any) => {
          console.log("handlePurgeAllBlobsInStore responseJson: ", responseJson);
        });
      }
    });
  };

  //TEST
  const printOutData = async () => {
    console.log("[TEST] printOutData called");
    console.log("fileDataObjects: ", fileDataObjects);
  }

  //TEST
  const handleListBlobMetadata = async () => {
    console.log("[TEST] handleListBlobMetadata called");
    const allBlobMetadata = await listAllBlobMetadata();
    console.log("allBlobMetadata: ", allBlobMetadata);
    setBlobMetadataTest([...allBlobMetadata]);
  };

  //TEST
  const handlePurgeAllBlobMetadata = async () => {
    console.log("[TEST] handlePurgeAllBlobMetadata entered");
    blobMetadataTest.forEach((imgObj: ImagePrismaSchema) => {
      const response = deleteBlobMetadata(imgObj.id);
      // console.log("response: ", response);
      response.then((value: ImagePrismaSchema) => {
        // console.log("value deleted: ", value);
      });
    })
  };

  const renderActionButtonForImage = (fdo: FileDataObject, imageIdx: number) => {
    // console.log("renderActionButtonForImage: imageIdx: ", imageIdx);
    // console.log("renderActionButtonForImage: fdo: ", fdo);
    if (fdo.isUploading && !fdo.inBlobStore) {
      return (
        <button
          type="button"
          className="absolute top-0 right-0 p-1 bg-white rounded-bl focus:outline-none"
        >
          <Loader2 className='animate-spin' />
        </button>
      );
    }

    return (
      <button
        type="button"
        className="absolute top-0 right-0 p-1 z-10 bg-white rounded-bl focus:outline-none"
        onClick={() => handleImageDeleteIconClicked(imageIdx)}
      >
        <Trash2 className="hover:stroke-rose-600" />
      </button>
    );
  };

  return (<>
    { TOP_DRAGGABLE_AREA_TOGGLE &&
        <div
          id={componentId}
          className="relative flex flex-col justify-center items-center text-center py-5 text-gray-400 border border-black rounded"
        >
          <input accept="image/png, image/jpeg" type="file" title="" multiple
            // className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
            className="absolute inset-0 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
            onDrop={handleDropNewFilesToLocalState}
            onDragOver={handleDragOver}
            onChange={handleAddFilesToLocalStateViaOpenWindow}
          />
          <Image id="drag-drop-image-icon" />
          <p className="m-0">Drag your files here or click in this area.</p>
        </div>
    }

    <div className="relative flex-row items-center justify-center py-5 text-center text-gray-400 border border-black rounded">
      {
        (fileDataObjects.length > 0) ?
          <p>You may add {IMAGE_UPLOAD_QUANTITY_LIMIT - fileDataObjects.length} more images</p>
          :
          <p>Your Added Pictures Will Appear Here. <br />
            You may upload a maximum of {IMAGE_UPLOAD_QUANTITY_LIMIT} images</p>
      }
      { DEBUG_TOGGLE &&
        <div>
          <p>
            <button type="submit" className='border border-black' onClick={(event) => uploadFilesToBlobStoreAndMetadataToDB(event)}>Upload Pics to Blob Store</button>
            &nbsp;
            <button type="submit" className='border border-black' onClick={printOutData}>Print Local Data to Console</button>
          </p>
          <p>
            <button type="submit" className='border border-black' onClick={handleListBlobMetadata}>List All Blob Metadata</button>
            <button type="submit" className='border border-black' onClick={handlePurgeAllBlobMetadata}>Purge All Blob Metadata</button>
            &nbsp;
            <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs In Store</button>
            <button type="submit" className='border border-black' onClick={handlePurgeAllBlobsInStore}>Purge All Blobs In Store</button>
          </p>
        </div>
      }
      <DragDropContext onDragEnd={onDragEnd}>
          <div
            className="grid grid-cols-3 gap-4 mt-4 md:grid-cols-3"
            // onDragOver={handleDragOver}
            draggable={uploadInProgress ? false : true}
          >
            <Droppable droppableId='image-uploader-droppable-area'>
                {(provided) => {
                    
                    console.log("1st provided: ", provided);

                    return (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                              { 
                                  fileDataObjects.map((fdo: FileDataObject, idx: number) => {

                                      const inBlobStore = fdo?.inBlobStore;
                                      const fileObj = fdo.file;
                                      const fileObjSize = humanReadableFileSize(inBlobStore ? parseInt(fdo.size ? fdo.size : "0") : fileObj?.size);
                                      
                                      return(
                                          <Draggable key={fdo.id} draggableId={fdo.id? fdo.id: ""+idx} index={idx}>
                                              {
                                                  (provided) => {

                                                      console.log("  2nd provided: ", provided);

                                                      return (
                                                          
                                                          <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            id={componentId + "-image-container" + idx}
                                                            key={fdo.id}
                                                            className={`
                                                              ${imageEaseTransition && "transition max-h-[400px] ease-in-out delay-150 hover:scale-105 duration-300"} 
                                                              relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none
                                                            `}
                                                            draggable={uploadInProgress ? false : true}
                                                            // onDragStart={(e) => handleDragStart(e, idx)}
                                                            // onDrop={(e) => handleDropForMove(e, idx)}
                                                            // onDragOver={handleDragOver}
                                                            onMouseDownCapture={() => setImageEaseTranstion(true)}
                                                            onMouseUpCapture={() => setImageEaseTranstion(false)}
                                                            onMouseLeave={() => setImageEaseTranstion(false)}
                                                          >
                                                              {
                                                                renderActionButtonForImage(fdo, idx)
                                                              }
                                                              <BlurImage
                                                                
                                                                alt={fdo.fileName ?? ""}
                                                                width={500}
                                                                height={400}
                                                                className="h-full object-cover"
                                                                src={fdo.url ?? ""}
                                                                blurDataURL={placeholderBlurhash}
                                                                placeholder="blur"
                                                              />
                                                              <div className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                                                                <span  className="w-full font-bold text-gray-900 truncate">
                                                                  {inBlobStore ? fdo.fileName + " [UPLOADED]" : fileObj?.name + " [NOT UPLOADED]"}
                                                                </span>
                                                                <span className="text-xs text-gray-900" x-text="humanFileSize(files[index].size)">
                                                                  {fileObjSize}
                                                                </span>
                                                              </div>
                                                          </div>

                                                      );
                                                  }
                                              }
                                          </Draggable>
                                          
                                      );

                                  })
                                  
                              }

                              {provided.placeholder}
                          </div> 
                    )
                }}
            </Droppable>
          </div>
      </DragDropContext>


      {/* Add this "upload image" card at the end */}
      <div className="relative flex flex-col items-center justify-center border rounded cursor-pointer hover:bg-gray-200">
        <Image id="drag-drop-image-icon" />
        <p className="m-0">Drag your files here or click in this area.</p>
        <input accept="image/png, image/jpeg" type="file" title="" multiple
          className="absolute inset-0 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
          onDrop={handleDropNewFilesToLocalState}
          onDragOver={handleDragOver}
          onChange={handleAddFilesToLocalStateViaOpenWindow}
        />
      </div>
    </div>

    <EditorWarningModal
      modalOpen={editorWarningModalOpen}
      setModalOpen={setEditorWarningModalOpen}
      handleDeletePressed={deleteFileFromLocalStateAndDB}
      modalData={editorWarningModalData}
    />
  </>);
}

