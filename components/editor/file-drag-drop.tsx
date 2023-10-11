"use client";

import { Image, Trash2, Loader2 } from 'lucide-react';
import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, IMAGE_SIZE_LIMIT_BYTES, IMAGE_SIZE_LIMIT_MB } from '@/lib/constants';
import React, { useState, useEffect, useRef } from 'react';
import EditorWarningModal, { EditorWarningModalDataType, EditorWarningModalDataTemplate } from "@/components/editor/warning-confirmation-modal";
import { getBlurDataURL, humanReadableFileSize, placeholderBlurhash } from '@/lib/utils';
import BlurImage from "@/components/blur-image";

import { put, type BlobResult } from '@vercel/blob'; // test
import {
  uploadBlobMetadata, listAllBlobsInStore, deleteBlobFromStore, getBlobMetadata, deleteBlobMetadata,
  listAllBlobMetadata,
  updateBlobMetadata
} from '@/lib/blob_actions';
import { Image as ImagePrismaSchema, Post } from "@prisma/client";
import { headers } from 'next/headers';
import { hostname } from 'os';
import { PrismaClientRustPanicError } from '@prisma/client/runtime';

//DEV MODE
const DEBUG_TOGGLE = false;

//abstract data type used to handle file operations in this editor
interface FileDataObject extends Partial<ImagePrismaSchema> {
  file?: File | null, //for handling local-only files
  localBlobUrl?: string,
  inBlobStore: boolean
}

export function FileClickDragDrop({ componentId, data }: { componentId: string, data: any }) {
  //important consts
  const POST_ID = data["id"];
  const SITE_ID = data["site"]["id"];

  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  //states for confirmation modal for deleting pictures
  const [editorWarningModalOpen, setEditorWarningModalOpen] = useState<boolean>(false);
  const [editorWarningModalData, setEditorWarningModalData] = useState<EditorWarningModalDataType>(EditorWarningModalDataTemplate);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // const [isUploading, setIsUploading] = useRef(false); 


  //TEST
  const [blobsFromStoreTest, setBlobsFromStoreTest] = useState<BlobResult[]>([]);
  const [blobMetadataTest, setBlobMetadataTest] = useState<ImagePrismaSchema[]>([]);

  const refreshMetadata = async () => {
    const currentBlobMetadataForPost = await getBlobMetadata(SITE_ID, POST_ID);
    const currentFileDataObjects = currentBlobMetadataForPost.map(
      (blobMetadata: ImagePrismaSchema & { post: Post | null }) => {
        const fileDataObject: FileDataObject = {
          inBlobStore: true,
          ...blobMetadata
        }
        return fileDataObject;
      }
    );
    console.log("currentFileDataObjects: ", currentFileDataObjects);
    setFileDataObjects([...currentFileDataObjects]);
  };

  useEffect(() => {
    console.log("useEffect entered. getting existing blobs");
    refreshMetadata();
  }, []);

  const addFilesToLocalState = (newFiles: (File | null)[]) => {
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
      console.log("HOSTNAME: ", a);

      newFiles.forEach((file: File | null, fileIdx: number) => {
        console.log("new file: ", file);
        if (file) {
          const fileSizeBytes = file?.size ? file.size : IMAGE_SIZE_LIMIT_BYTES;
          if (fileSizeBytes > IMAGE_SIZE_LIMIT_BYTES) {
            newFilesAboveSizeLimit.push(file);
          } else {
            const localBlobUrl = URL.createObjectURL(file);
            console.log("localBlobUrl: ", localBlobUrl);

            const newFileNotStored: FileDataObject = {
              file,
              localBlobUrl,
              inBlobStore: false,
              orderIndex: fileDataObjects.length + fileIdx
            }
            newFilesBelowSizeLimit.push(newFileNotStored);
          }
        }
      });
      const updatedFdoArray = [...fileDataObjects, ...newFilesBelowSizeLimit];
      console.log("updatedFdoArray: ", updatedFdoArray);
      setFileDataObjects(updatedFdoArray);
      setIsUploading(false);

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
    }
  };

  const deleteFileFromLocalStateAndDB = (idxToRemove: number) => {
    const fileDataObjectsWithItemRemoved = fileDataObjects.filter((fdo: FileDataObject, itemIdx: number) => {
      //perform the actual removal of the metadata from the DB and blob from the store
      if (itemIdx === idxToRemove && fdo.id && fdo.inBlobStore) {
        const deleteMetadataResponse = deleteBlobMetadata(fdo.id);
        console.log("deleteMetadataResponse: ", deleteMetadataResponse);
        deleteMetadataResponse.then((value: ImagePrismaSchema) => {
          console.log("=== value: ", value);
          deleteBlobFromStore(value.url);
        });
      }
      return itemIdx !== idxToRemove;
    });
    setFileDataObjects(fileDataObjectsWithItemRemoved);
    setEditorWarningModalOpen(false); //remove modal
  };

  const handleAddFilesToLocalStateViaOpenWindow = (event: any) => {
    console.log("handleAddFilesToLocalStateViaOpenWindow entered");
    event.preventDefault();
    const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
      .filter((file: File) => PERMITTED_FILE_TYPES.has(file.type));
    addFilesToLocalState(newFiles);
  };

  const handleDropNewFilesToLocalState = (event: any) => {
    console.log("handleDropNewFilesToLocalState entered");
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
    addFilesToLocalState(newFiles);
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

  const handleDragStart = (event: any, idx: number) => {
    console.log("handleDragStart entered: idx chosen:", idx);
    setDraggedIdx(idx);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: any) => {
    console.log("handleDragOver entered");
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDropForMove = (event: any, idx: number) => {
    console.log("handleDropForMove entered: idx chosen:", idx); //to idx
    console.log("draggedIdx: ", draggedIdx); //from idx
    event.preventDefault();

    if (draggedIdx !== null && draggedIdx !== idx) {
      // Swap in addedFileArray
      const fileDataObjectsCopy = [...fileDataObjects];
      const tempFile = fileDataObjectsCopy[draggedIdx];
      fileDataObjectsCopy[draggedIdx] = fileDataObjectsCopy[idx];
      fileDataObjectsCopy[idx] = tempFile;
      setFileDataObjects([...fileDataObjectsCopy]);
    }
    setDraggedIdx(null); // Reset the dragged item index
  };


  const uploadPromiseWrapper = async (fileDataObjects: FileDataObject[]) => {
    const fileDataObjectsCopy = [...fileDataObjects];

    for (let fdoIdx: number = 0; fdoIdx < fileDataObjects.length; fdoIdx++) {
      const fdo: FileDataObject = fileDataObjects[fdoIdx];
      console.log(">>> fdo: ", fdo);
      if (fdo.inBlobStore) {
        if (fdo?.id && fdo.orderIndex != fdoIdx) {
          const updateBlobMetadataResponse = await updateBlobMetadata(fdo.id, { orderIndex: fdoIdx });
          const newUpdatedFile: FileDataObject = {
            inBlobStore: true,
            ...updateBlobMetadataResponse
          }
          fileDataObjectsCopy[fdoIdx] = newUpdatedFile;
        }
      }
      else {
        const file = fdo?.file;
        if (file) {
          console.log("file.name: ", file.name);
          // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
          const blobResult = await put(file.name, file, {
            access: 'public',
            handleBlobUploadUrl: '/api/upload'
          });

          const uploadBlobMetadataResponse = await uploadBlobMetadata(blobResult, fdoIdx, POST_ID, SITE_ID);
          console.log("uploadBlobMetadataResponse: fdoIdx: ", fdoIdx, "    responseValue: ", uploadBlobMetadataResponse);
          const newUploadedFile: FileDataObject = {
            inBlobStore: true,
            ...uploadBlobMetadataResponse
          }
          fileDataObjectsCopy[fdoIdx] = newUploadedFile;
        }
      }
    };

    return fileDataObjectsCopy;
  }

  const uploadFilesToBlobStoreAndMetadataToDB = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("uploadFilesToBlobStoreAndMetadataToDB entered");
    console.log("event: ", event);
    event.preventDefault();

    setIsUploading(true);
    console.log("setIsUploading to TRUE");

    const uploadPromiseResponse = await uploadPromiseWrapper(fileDataObjects);
    console.log("uploadPromiseResponse: ", uploadPromiseResponse);

    setFileDataObjects(uploadPromiseResponse as FileDataObject[]);
    setIsUploading(false);
    console.log("setIsUploading to FALSE");
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
    // console.log("swapIdxMemo: ", swapIdxMemo);
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
        console.log("value deleted: ", value);
      });
    })
  };

  const renderActionButtonForImage = (isUploading: boolean, fdo: FileDataObject, imageIdx: number) => {
    if (isUploading && !fdo.inBlobStore) {
      return (
        <button
          type="button"
          className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
          onClick={() => { }}
        >
          <Loader2 className='animate-spin' />
        </button>
      );
    }

    return (
      <button
        type="button"
        className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
        onClick={() => handleImageDeleteIconClicked(imageIdx)}
      >
        <Trash2 className="hover:stroke-rose-600" />
      </button>
    );
  };

  console.log("12345 isUploading: ", isUploading);
  return (<>
    <div
      id={componentId}
      className="relative flex flex-col justify-center items-center text-center py-5 text-gray-400 border border-black rounded"
    >
      <input accept="image/png, image/jpeg" type="file" title="" multiple
        // className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        onDrop={handleDropNewFilesToLocalState}
        onDragOver={handleDragOver}
        onChange={handleAddFilesToLocalStateViaOpenWindow}
      />
      <Image id="drag-drop-image-icon" />
      <p className="m-0">Drag your files here or click in this area.</p>
    </div>

    <div className="relative flex-row items-center justify-center py-5 text-center text-gray-400 border border-black rounded">
      {
        (fileDataObjects.length > 0) ?
          <p>You may add {IMAGE_UPLOAD_QUANTITY_LIMIT - fileDataObjects.length} more images</p>
          :
          <p>Your Added Pictures Will Appear Here. <br />
            You may upload a maximum of {IMAGE_UPLOAD_QUANTITY_LIMIT} images</p>
      }
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
      <div
        className="grid grid-cols-3 gap-4 mt-4 md:grid-cols-3"
        onDragOver={handleDragOver}
      >
        {fileDataObjects.map((fdo: FileDataObject, idx: number) => {
          //console.log("FileDataObject to be rendered: ", fdo);
          const inBlobStore = fdo?.inBlobStore;
          const fileObj = fdo.file;
          const fileObjSize = humanReadableFileSize(inBlobStore ? parseInt(fdo.size ? fdo.size : "0") : fileObj?.size);
          return (
            <div
              id={componentId + "-image-container" + idx}
              key={idx}
              className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
              draggable={true}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDrop={(e) => handleDropForMove(e, idx)}
              onDragOver={handleDragOver}
            >
              {
                renderActionButtonForImage(isUploading, fdo, idx)
              }
              {/* <Image
                className="relative inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                src={inBlobStore ? fdo.url : fdo.localBlobUrl}
              /> */}
              <BlurImage
                alt={data.title ?? "Card thumbnail"}
                width={500}
                height={400}
                // className="h-full object-cover"
                className="relative inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                src={inBlobStore ? fdo.url : fdo.localBlobUrl}
                blurDataURL={placeholderBlurhash}
                placeholder="blur"
              />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                <span className="w-full font-bold text-gray-900 truncate">
                  {inBlobStore ? fdo.fileName + " [UPLOADED]" : fileObj?.name + " [NOT UPLOADED]"}
                </span>
                <span className="text-xs text-gray-900" x-text="humanFileSize(files[index].size)">
                  {fileObjSize}
                </span>
              </div>
            </div>
          );
        })}
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