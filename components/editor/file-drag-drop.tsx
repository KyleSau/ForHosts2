"use client";

import { Image } from 'lucide-react';
import { FILE_CONSTS } from '@/lib/constants';
import React, { SyntheticEvent, useState } from 'react';

export function FileClickDragDrop(
  {componentId}:
  {componentId: string}
) 
{
  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [addedFileArray, setAddedFileArray] = useState<(File|null)[]>([]);
  const [addedFileUrlArray, setAddedFileUrlArray] = useState<(string|undefined)[]>([]);
  //const [dragActive, setDragActive] = useState<boolean>(false);
  // const [fileDragging, setFileDragging] = useState<any>(null);

  const addFileAndUrlToState = (newFiles: (File|null)[]) => {
    setAddedFileArray([...addedFileArray, ...newFiles]);
    //console.log("addFileAndUrlToState() called, addedFileArray is now: ", addedFileArray);

    const urlsForNewFiles: (string|undefined)[] = newFiles
      .map((file: File|null, _: number) => {
        if(file != null && file != undefined) {
          const fileUrl = URL.createObjectURL(file);
          //console.log("fileUrl created: ", fileUrl);
          return fileUrl;
        }
    });
    //console.log("newAddedFileUrlArray is now: ", urlsForNewFiles);
    setAddedFileUrlArray([...addedFileUrlArray, ...urlsForNewFiles]);
  };

  const removeFileAndUrlFromState = (idxToRemove: number) => {
    const addedFileArrayWithItemRemoved = addedFileArray.filter((_: any, itemIdx: number) => itemIdx != idxToRemove);
    const addedFileUrlArrayWithItemRemoved = addedFileUrlArray.filter((_: any, itemIdx: number) => itemIdx != idxToRemove);
    setAddedFileArray(addedFileArrayWithItemRemoved);
    setAddedFileUrlArray(addedFileUrlArrayWithItemRemoved);
  }

  const addFilesFromOpenPopup = (event: any) => {
    const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
      .filter((file: File, _: number) => PERMITTED_FILE_TYPES.has(file.type));
    console.log("addFiles(): newFiles: ", newFiles);
    addFileAndUrlToState(newFiles);
  }

  const dropNewImageHandler = (event: any) => {
    // console.log("File(s) dropped");
    // console.log("dropped: ", event.target.files);

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    
    const dataTransferItems: DataTransferItemList = event.dataTransfer.items; 
    //console.log("dataTransferItems: ", dataTransferItems);

    let newFiles: (File|null)[] = [];

    if (dataTransferItems) {
      // Use DataTransferItemList interface to access the file(s)
      newFiles = Array.from(dataTransferItems)
        .filter((item: DataTransferItem, _: number) => item.kind === FILE_CONSTS.FILE && PERMITTED_FILE_TYPES.has(item.type))
        .map((item: DataTransferItem, _: number) => item.getAsFile());
      
      // // key of the card to be fetched is passed
      // Array.from(dataTransferItems).forEach((item: DataTransferItem) => {
      //   const card_id = item.get('id_card');
      //   console.log("dropHandler: card_id: ", card_id);
      //   const card = document.getElementById(card_id);
      //   console.log("dropHandler: card: ", card);
      //   event.target.appendChild(card);
      // });
      
    } else {
      // Use DataTransfer interface to access the file(s)
      const dataTransferFiles: FileList = event.dataTransfer.files;
      console.log("dataTransferFiles: ", dataTransferFiles); 
      newFiles = Array.from(dataTransferFiles);
    }

    addFileAndUrlToState(newFiles);
  }

  const dragStartHandler = (event: any) => {
    console.log("dragStartHandler called: event: ", event);
    const target = event.target;
    console.log("dragStartHandler target: ", target);
    event.dataTransfer.setData('card_id', target.id); 
  }

  const dragOverHandler = (event: any) => {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    event.stopPropagation();
  }

  const dropForMoveHandler = (event: any) => {
    event.preventDefault();

    // key of the card to be fetched is passed
    const card_id = event.dataTransfer.getData('id_card');
    console.log("dropForMoveHandler: card_id: ", card_id);
    const card = document.getElementById(card_id);
    console.log("dropForMoveHandler: card: ", card);
    event.target.appendChild(card);
  };
  
  return (<>
    <div
      id={componentId}
      className="relative flex flex-col items-center justify-center py-5 text-center text-gray-400 border border-black rounded"
    >
      <input accept="image/png, image/jpeg" type="file" title=""  multiple
        className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        onDrop={dropNewImageHandler}
        onDragOver={dragOverHandler}
        onChange={addFilesFromOpenPopup}
      />
      <Image id="drag-drop-image-icon"/>
      <p className="m-0">Drag your files here or click in this area.</p>
    </div>

    <div className="relative flex flex-col items-center justify-center py-20 text-center text-gray-400 border border-black rounded"
      onClick={() => console.log("canvas div clicked")}
    >
      Your Added Pictures Will Appear Here

      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6 outline-black" 
        // @drop.prevent="drop($event)"
        // onDrop.prevent
        // @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
        id = {"asdf_id"}
        onDrop={dropForMoveHandler}
        onDragOver={dragOverHandler}
      >
        {
          addedFileUrlArray.map((fileUrl: string|undefined, idx: number) => {
            console.log("addedFileArray.file: ", fileUrl, "INDEX: ", idx);
            
            return (
              <div 
                id={componentId + "-image-container" + idx}
                key={idx}
                className="flex flex-col items-center text-center"
                // draggable={true}
                // onDrop={dropForMoveHandler}
                onDragStart={dragStartHandler}
                // onDragOver={dragOverHandler}
              >

                <button 
                  // id={componentId + "-remove-item-button" + idx}
                  // className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none outline-black" 
                  type="button" 
                  onClick={() => removeFileAndUrlFromState(idx)}
                >
                    <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <img className="relative inset-0 z-0 object-cover w-full h-full border-4 border-black preview" 
                    src={fileUrl}
                />

              </div>
            );
          })
        }
      </div>
    </div>
  </>);
};