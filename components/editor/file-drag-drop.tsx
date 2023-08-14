"use client";

import { Image } from 'lucide-react';
import { FILE_CONSTS } from '@/lib/constants';
import { useState } from 'react';

export function FileClickDragDrop(
  {componentId}:
  {componentId: string}
) 
{
  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [addedFileArray, setAddedFileArray] = useState<(File|null)[]>([]);


  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");
    
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    
    const dataTransferItems: DataTransferItemList = ev.dataTransfer.items; 
    console.log("dataTransferItems: ", dataTransferItems);

    let validAddedFiles: (File|null)[] = [];

    if (dataTransferItems) {
      // Use DataTransferItemList interface to access the file(s)
      validAddedFiles = Array.from(dataTransferItems)
        .filter((item: DataTransferItem, _: number) => item.kind === FILE_CONSTS.FILE && PERMITTED_FILE_TYPES.has(item.type))
        .map((item: DataTransferItem, _: number) => item.getAsFile())
    } else {
      // Use DataTransfer interface to access the file(s)
      const dataTransferFiles: FileList = ev.dataTransfer.files;
      console.log("dataTransferFiles: ", dataTransferFiles); 
      validAddedFiles = Array.from(dataTransferFiles);
    }
    
    setAddedFileArray(validAddedFiles);
  }

  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  return (<>
  <div
    id={componentId}
    className="relative flex flex-col items-center justify-center py-5 text-center text-gray-400 border border-black rounded"
  >
    <input accept="image/png, image/jpeg" type="file" title=""  multiple
      className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
    />
    <Image id="drag-drop-image-icon"/>
    <p className="m-0">Drag your files here or click in this area.</p>
  </div>
  
  
  {/* <div
    className="relative flex flex-col items-center justify-center py-20 text-center text-gray-400 border border-black rounded"
  >
    Your Added Pictures Will Appear Here
  </div> */}
  
  <template x-if="files.length > 0">

      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6" 
        // @drop.prevent="drop($event)"
        // onDrop.prevent
        // @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
      >
          {/* <template x-for="(_, index) in Array.from({ length: files.length })"> */}
          {/* </template> */ }
          
          {
              addedFileArray.map((file: File | null, idx: number) => {
                return (
<div 
                className="relative flex flex-col items-center overflow-hidden text-center bg-gray-100 border rounded cursor-move select-none"
                style="padding-top: 100%;" 
                onDragStart="dragstart($event)" 
                onDragEnd="fileDragging = null"
                :class="{'border-blue-600': fileDragging == index}" draggable="true" 
                :data-index="index"
              >
                    <button 
                      id={componentId + "-remove-item-button"}
                      className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none" 
                      type="button" 
                      onClick="remove(index)"
                    >
                        <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    <template x-if="files[index].type.includes('audio/')">
                        <svg className="absolute w-12 h-12 text-gray-400 transform top-1/2 -translate-y-2/3"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </template>

                    <template x-if="files[index].type.includes('application/') || files[index].type === ''">
                        <svg className="absolute w-12 h-12 text-gray-400 transform top-1/2 -translate-y-2/3"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </template>

                    <template x-if="files[index].type.includes('image/')">
                        <img className="absolute inset-0 z-0 object-cover w-full h-full border-4 border-white preview"
                            x-bind:src="loadFile(files[index])" />
                    </template>

                    <template x-if="files[index].type.includes('video/')">
                        <video
                            className="absolute inset-0 object-cover w-full h-full border-4 border-white pointer-events-none preview">
                            <fileDragging x-bind:src="loadFile(files[index])" type="video/mp4">
                        </video>
                    </template>

                    <div class="absolute bottom-0 left-0 right-0 flex flex-col p-2 text-xs bg-white bg-opacity-50">
                        <span class="w-full font-bold text-gray-900 truncate"
                            x-text="files[index].name">Loading</span>
                        <span class="text-xs text-gray-900" x-text="humanFileSize(files[index].size)">...</span>
                    </div>

                    <div class="absolute inset-0 z-40 transition-colors duration-300" @dragenter="dragenter($event)"
                        @dragleave="fileDropping = null"
                        :class="{'bg-blue-200 bg-opacity-80': fileDropping == index && fileDragging != index}">
                    </div>

                </div>
                );
              })


              
          }
          
      </div>

  </template>

  </>);
};