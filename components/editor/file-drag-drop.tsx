"use client";

import { File, Image, Trash2 } from 'lucide-react';
import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, IMAGE_SIZE_LIMIT_BYTES, IMAGE_SIZE_LIMIT_MB } from '@/lib/constants';
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import EditorWarningModal, { EditorWarningModalDataType, EditorWarningModalDataTemplate } from "@/components/editor/warning-confirmation-modal";
import { humanReadableFileSize } from '@/lib/utils';

import { put, list, type BlobResult } from '@vercel/blob'; // test
import { uploadBlobMetadata, listAllBlobsInStore, deleteBlobFromStore } from '@/lib/actions';
import { Image as ImagePrismaSchema } from "@prisma/client";

//abstract data type used to handle file operations in this editor
// interface FileDataObject extends ImagePrismaSchema {
interface FileDataObject {
  file?: File | null,
  localBlobUrl?: string,
  inBlobStore: boolean,
  blobResult?: BlobResult,
  orderIdx?: number
}

export function FileClickDragDrop({ componentId, data }: { componentId: string, data: any }) {
  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  //states for confirmation modal for deleting pictures
  const [editorWarningModalOpen, setEditorWarningModalOpen] = useState<boolean>(false);
  const [editorWarningModalData, setEditorWarningModalData] = useState<EditorWarningModalDataType>(EditorWarningModalDataTemplate)

  //TEST
  const inputFileRef = useRef<HTMLInputElement>(null); // test
  // const [blob, setBlob] = useState<BlobResult | null>(null); // test
  const [blobList, setBlobList] = useState<(BlobResult | null)[]>([]);
  const [allBlobs, setAllBlobs] = useState<BlobResult[]>([]);

  useEffect(() => {
    console.log("useEffect entered. getting existing blobs");
    const allCurrentBlobsPromise = listAllBlobsInStore();
    allCurrentBlobsPromise.then((allCurrentBlobs: BlobResult[]) => {
      console.log("allCurrentBlobs: ", allCurrentBlobs);
      
      const currentBlobsFromStore: FileDataObject[] = allCurrentBlobs.map((br: BlobResult) => {
        const storedFdo: FileDataObject = {
          inBlobStore: true,
          blobResult: br
        }
        return storedFdo;
      });
      setFileDataObjects([...fileDataObjects, ...currentBlobsFromStore]);
    });
  }, []);

  const addFilesAndUrlsToState = (newFiles: (File | null)[]) => {
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

  const removeFileAndUrlFromState = (idxToRemove: number) => {
    const fileDataObjectsWithItemRemoved = fileDataObjects.filter((_: FileDataObject, itemIdx: number) => itemIdx !== idxToRemove);
    setFileDataObjects(fileDataObjectsWithItemRemoved);
    //remove modal
    setEditorWarningModalOpen(false);
  };

  const handleImageDeleteIconClicked = (idxToRemove: number) => {
    const fileName = fileDataObjects[idxToRemove]?.file?.name;
    setEditorWarningModalData({
      ...editorWarningModalData,
      idxToRemove,
      message: "Are you sure you want to delete picture: " + fileName
    });
    setEditorWarningModalOpen(true);
  };

  const addFilesFromOpenPopup = (event: any) => {
    const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
      .filter((file: File) => PERMITTED_FILE_TYPES.has(file.type));

    addFilesAndUrlsToState(newFiles);
  };

  const dropNewImageHandler = (event: any) => {
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

    addFilesAndUrlsToState(newFiles);
  };

  const dragStartHandler = (event: any, idx: number) => {
    setDraggedIdx(idx);
    event.dataTransfer.effectAllowed = "move";
  };

  const dragOverHandler = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const dropForMoveHandler = (event: any, idx: number) => {
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

  const uploadBlobsToStore = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputFileRef.current?.files !== null) {
      //---- Multi file upload ----
      console.log("inputFileRef: ", inputFileRef);
      // print data
      const dataStr = JSON.stringify(data);
      console.log("dataStr: ", dataStr);

      const selectedFiles: FileList | undefined = inputFileRef.current?.files;
      console.log("selectedFiles: ", selectedFiles);

      Array.from(selectedFiles as ArrayLike<File>).forEach((file: File) => {
        console.log("file.name: ", file.name);
        // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
        const newBlob = put(file.name, file, {
          access: 'public',
          handleBlobUploadUrl: '/api/upload'
        });
        newBlob.then((br: BlobResult) => {
          console.log("newBlob: ", newBlob);
          setBlobList(prevBlobList => [...prevBlobList, br]);

          //put image table request here???
          const uploadBlobMetadataResponse = uploadBlobMetadata(br, data["id"], data["site"]["id"]);
          console.log("uploadBlobMetadataResponse: ", uploadBlobMetadataResponse);
        });
      });
    }
  };

  const handleListAllblobsInStore = async () => { 
    console.log("handleListAllblobsInStore called");
    //DO NOT DELETE!!!
    // const response = await fetch("/api/blob/get-blobs", {
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //       "Content-Type": "application/json"
    //   }
    // });
    // const blobsInStore = await response.json();
    // console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    // setAllBlobs(blobsInStore);
    
    const blobsInStore = await listAllBlobsInStore();
    console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    setAllBlobs(blobsInStore);
  };

  const handleDeleteAllBlobsInStore = async () => {
    console.log("handleDeleteAllBlobsInStore called");
    allBlobs.forEach((blob: BlobResult) => {
      //DO NOT DELETE!!!
      // const url = blob.url;
      // console.log("url: ", url);
      // const response = fetch(`/api/blob/delete-blob?url=${url}`, {
      //   method: "DELETE"
      // });
      // console.log("deleteAllBlobsInStore: response: ", response);

      const url = blob.url;
      const response = deleteBlobFromStore(url);
      response.then((responseJson: any) => {
        console.log("handleDeleteAllBlobsInStore responseJson: ", responseJson);
      });
    });
  };

  const printOutData = async () => {
    console.log("fileDataObjects: ", fileDataObjects);
  }
  

  return (<>
    <div
      id={componentId}
      className="relative flex flex-col justify-center items-center text-center py-5 text-gray-400 border border-black rounded"
    >
      <input accept="image/png, image/jpeg" type="file" title="" multiple
        // className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        onDrop={dropNewImageHandler}
        onDragOver={dragOverHandler}
        onChange={addFilesFromOpenPopup}
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
      <button type="submit" className='border border-black' onClick={() => console.log("dummy call")}>Upload Pics to Blob Store</button>
      <button type="submit" className='border border-black' onClick={printOutData}>Print out Data to Console</button>
      <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs</button>
      <button type="submit" className='border border-black' onClick={handleDeleteAllBlobsInStore}>Delete All Blobs</button>
      <div
        className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2"
        onDragOver={dragOverHandler}
      >
        {fileDataObjects.map((fdo: FileDataObject, idx: number) => {
          console.log("fdo: ", fdo);
          const inBlobStore = fdo?.inBlobStore;
          
          const fileObj = fdo.file;
          console.log("fileObj: ", fileObj);
          const fileObjSize = humanReadableFileSize(inBlobStore? parseInt(fdo.blobResult? fdo.blobResult?.size: "0") : fileObj?.size);
          return (
            <div
              id={componentId + "-image-container" + idx}
              key={idx}
              className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
              draggable={true}
              onDragStart={(e) => dragStartHandler(e, idx)}
              onDrop={(e) => dropForMoveHandler(e, idx)}
              onDragOver={dragOverHandler}
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
                src={inBlobStore? fdo.blobResult?.url: fdo.localBlobUrl}
              />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                <span className="w-full font-bold text-gray-900 truncate">
                  {inBlobStore? fdo.blobResult?.pathname: fileObj?.name}
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
      handleDeletePressed={removeFileAndUrlFromState}
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
    {blobList && (
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
    )}
  </>);
}
