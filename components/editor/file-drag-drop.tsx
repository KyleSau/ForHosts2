"use client";

import { Image, Trash2 } from 'lucide-react';
import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, IMAGE_SIZE_LIMIT_BYTES, IMAGE_SIZE_LIMIT_MB } from '@/lib/constants';
import React, { useState, useEffect } from 'react';
import EditorWarningModal, { EditorWarningModalDataType, EditorWarningModalDataTemplate } from "@/components/editor/warning-confirmation-modal";
import { humanReadableFileSize } from '@/lib/utils';

import { put, type BlobResult } from '@vercel/blob'; // test
import { uploadBlobMetadata, listAllBlobsInStore, deleteBlobFromStore, getBlobMetadata, deleteBlobMetadata,
  listAllBlobMetadata
} from '@/lib/blob_actions';
import { Image as ImagePrismaSchema, Post } from "@prisma/client";

//DEV MODE
// const DEBUG_TOGGLE = false;

//abstract data type used to handle file operations in this editor
interface FileDataObject extends Partial<ImagePrismaSchema> {
  file?: File | null, //for handling local-only files
  localBlobUrl?: string,
  inBlobStore: boolean,
  // blobResult?: BlobResult,
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

  //TEST
  const [blobsFromStore, setBlobsFromStore] = useState<BlobResult[]>([]);
  const [blobMetadata, setBlobMetadata] = useState<ImagePrismaSchema[]>([]);

  const refreshMetadata = async () => {
    const currentBlobMetadataForPost = await getBlobMetadata(SITE_ID, POST_ID);
    const currentBlobFileDataObjects = currentBlobMetadataForPost.map(
      (blobMetadata: ImagePrismaSchema & { post: Post | null }) => {
        const fileDataObject: FileDataObject = {
          inBlobStore: true,
          ... blobMetadata
        }
        return fileDataObject;
      }
    );
    console.log("currentBlobFileDataObjects: ", currentBlobFileDataObjects);
    setFileDataObjects([...currentBlobFileDataObjects]);
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

      newFiles.forEach((file: File|null) => {
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
              inBlobStore: false
            }
            newFilesBelowSizeLimit.push(newFileNotStored);
            console.log("newFilesBelowSizeLimit: ", newFilesBelowSizeLimit);
          }
        }
      })
      setFileDataObjects([...fileDataObjects, ...newFilesBelowSizeLimit]);
      console.log("right after setFileDataObjects: ", fileDataObjects);

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

  const deleteFileFromLocalStateAndDeleteMetadataFromDB = (idxToRemove: number) => {
    const fileDataObjectsWithItemRemoved = fileDataObjects.filter((fdo: FileDataObject, itemIdx: number) => {
      //perform the actual removal of the metadata from the DB and blob from the store
      if(itemIdx === idxToRemove && fdo.id && fdo.inBlobStore) {
        console.log("TRYING TO REMOVE PIC THAT IS IN BLOB STORE");
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
    const fileName = fdoToRemove.inBlobStore? fdoToRemove.fileName: fdoToRemove.file?.name;
    setEditorWarningModalData({
      ...editorWarningModalData,
      idxToRemove,
      message: "Are you sure you want to delete picture: " + fileName
    });
    setEditorWarningModalOpen(true);
  };

  const handleDragStart = (event: any, idx: number) => {
    setDraggedIdx(idx);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: any) => {
    console.log("handleDragOver entered");
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDropForMove = (event: any, idx: number) => {
    event.preventDefault();

    if (draggedIdx !== null && draggedIdx !== idx) {
      const fileDataObjectsCopy = [...fileDataObjects];

      // Swap in addedFileArray
      const tempFile = fileDataObjectsCopy[draggedIdx];
      fileDataObjectsCopy[draggedIdx] = fileDataObjectsCopy[idx];
      fileDataObjectsCopy[idx] = tempFile;

      setFileDataObjects(fileDataObjectsCopy);
    }

    setDraggedIdx(null); // Reset the dragged item index
  };

  const uploadBlobsToStore = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("uploadBlobsToStore entered");
    event.preventDefault();
    fileDataObjects.forEach((fdo: FileDataObject) => {
      const file = fdo.file;
      const inBlobStore = fdo.inBlobStore;
      if(file && !inBlobStore) {
        console.log("file.name: ", file.name);
        // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
        const newBlob = put(file.name, file, {
          access: 'public',
          handleBlobUploadUrl: '/api/upload'
        });
        newBlob.then((br: BlobResult) => {
          console.log("br: ", br);
          const uploadBlobMetadataResponse = uploadBlobMetadata(br, POST_ID, SITE_ID);
          console.log("uploadBlobMetadataResponse: ", uploadBlobMetadataResponse);
          return uploadBlobMetadataResponse;
        }).then((_: ImagePrismaSchema) => {
          refreshMetadata(); //trigger a re-render
        });
      } else { //TODO: to be deleted
        console.log("no files uploaded because there were no new local files");
      }
    });
  };

  //TEST
  const handleListAllblobsInStore = async () => { 
    console.log("[TEST] handleListAllblobsInStore called");
    const blobsInStore = await listAllBlobsInStore();
    console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    setBlobsFromStore(blobsInStore);
  };

  //TEST
  const handlePurgeAllBlobsInStore = async () => {
    console.log("[TEST] handlePurgeAllBlobsInStore called");
    blobsFromStore.forEach((br: BlobResult) => {
      if(br.url) {
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
    setBlobMetadata([...allBlobMetadata]);
  };

  //TEST
  const handlePurgeAllBlobMetadata = async () => {
    console.log("[TEST] handlePurgeAllBlobMetadata entered");
    blobMetadata.forEach((imgObj: ImagePrismaSchema) => {
      const response = deleteBlobMetadata(imgObj.id);
      // console.log("response: ", response);
      response.then((value: ImagePrismaSchema) => {
        console.log("value deleted: ", value);
      });
    })
  };

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
        <button type="submit" className='border border-black' onClick={event => uploadBlobsToStore(event)}>Upload Pics to Blob Store</button>
        <button type="submit" className='border border-black' onClick={printOutData}>Print Local Data to Console</button>
        <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs In Store</button>
        <button type="submit" className='border border-black' onClick={handlePurgeAllBlobsInStore}>Purge All Blobs In Store</button>
      </p>
      <p>
        <button type="submit" className='border border-black' onClick={handleListBlobMetadata}>List All Blob Metadata</button>
        <button type="submit" className='border border-black' onClick={handlePurgeAllBlobMetadata}>Purge All Blob Metadata</button>
      </p>
      <div
        className="grid grid-cols-3 gap-4 mt-4 md:grid-cols-3"
        onDragOver={handleDragOver}
      >
        {fileDataObjects.map((fdo: FileDataObject, idx: number) => {
          console.log("FileDataObject to be rendered: ", fdo);
          const inBlobStore = fdo?.inBlobStore;
          
          const fileObj = fdo.file;
          //console.log("fileObj: ", fileObj);
          const fileObjSize = humanReadableFileSize(inBlobStore? parseInt(fdo.size? fdo.size: "0") : fileObj?.size);
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
              <button
                type="button"
                className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none"
                onClick={() => handleImageDeleteIconClicked(idx)}
              >
                <Trash2 className="hover:stroke-rose-600" />
              </button>
              <img
                // className="relative inset-0 z-0 object-cover w-full h-full border preview"
                className="relative inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                src={inBlobStore? fdo.url: fdo.localBlobUrl}
              />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                <span className="w-full font-bold text-gray-900 truncate">
                  {inBlobStore? fdo.fileName + " [BLOB]": fileObj?.name + " [LOCAL]"}
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
      handleDeletePressed={deleteFileFromLocalStateAndDeleteMetadataFromDB}
      modalData={editorWarningModalData}
    />

    {/* <h1>Upload Your Avatar</h1> */}
    {/* <form onSubmit={uploadBlobsToStore}>
      <input name="file" ref={inputFileRef} type="file" required multiple />
      <br />
      <button type="submit" className='border border-black'>Upload</button>
    </form> */}
    {/* <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs</button>
    <button type="submit" className='border border-black' onClick={handleDeleteAllBlobsInStore}>Delete All Blobs</button> */}
    {/* {blobList && (
      <div>
        Blob url: <br />
        {
          blobList.map((blob: BlobResult | null, idx: number) => (
            <p key={idx}>
              <a key={idx} href={blob?.url}>{blob?.url}</a><br />
            </p>
          ))
        }
      </div>
    )} */}
  </>);
}
