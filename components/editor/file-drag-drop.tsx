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
  const [addedFileUrlArray, setAddedFileUrlArray] = useState<(string|undefined)[]>([]);

  const dropHandler = (event: any) => {
    console.log("File(s) dropped");
    console.log("dropped: ", event.target.files);

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    
    const dataTransferItems: DataTransferItemList = event.dataTransfer.items; 
    console.log("dataTransferItems: ", dataTransferItems);

    let validAddedFiles: (File|null)[] = [];

    if (dataTransferItems) {
      // Use DataTransferItemList interface to access the file(s)
      validAddedFiles = Array.from(dataTransferItems)
        .filter((item: DataTransferItem, _: number) => item.kind === FILE_CONSTS.FILE && PERMITTED_FILE_TYPES.has(item.type))
        .map((item: DataTransferItem, _: number) => item.getAsFile());
    } else {
      // Use DataTransfer interface to access the file(s)
      const dataTransferFiles: FileList = event.dataTransfer.files;
      console.log("dataTransferFiles: ", dataTransferFiles); 
      validAddedFiles = Array.from(dataTransferFiles);
    }
    
    const newAddedFileArray: (File|null)[] = addedFileArray;
    newAddedFileArray.push(...validAddedFiles)
    setAddedFileArray(newAddedFileArray);
    console.log("dropHandler() called, addedFileArray is now: ", addedFileArray);
  }

  const dragOverHandler = (event: any) => {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  }

  const addFilesFromOpenPopup = (event: any) => {
    const files: FileList = event.target.files;
    console.log("addFiles(): files: ", files);
    const newAddedFileArray = addedFileArray;
    newAddedFileArray.push(...Array.from(files))

    setAddedFileArray(addedFileArray);
    console.log("addFiles() called, addedFileArray is now: ", addedFileArray);

    const newAddedFileUrlArray: (string|undefined)[] = newAddedFileArray
      .map((file: File|null, _: number) => {
        if(file != null && file != undefined) {
          const fileUrl = URL.createObjectURL(file);
          console.log("fileUrl created: ", fileUrl);
          return fileUrl;
        }
    });
    console.log("newAddedFileUrlArray: ", newAddedFileUrlArray);
    setAddedFileUrlArray(newAddedFileUrlArray);
  }

  // const [file, setFile] = useState<string>();
  // function setOneFile() {
  //     // console.log(e.target.files);
  //     // setFile(URL.createObjectURL(e.target.files[0]));
  //     return URL.createObjectURL(addedFileArray[0]); 
  // }

  return (<>
    <div
      id={componentId}
      className="relative flex flex-col items-center justify-center py-5 text-center text-gray-400 border border-black rounded"
    >
      <input accept="image/png, image/jpeg" type="file" title=""  multiple
        className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
        onDrop={dropHandler}
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
      >
        {
          addedFileUrlArray.map((fileUrl: string|undefined, idx: number) => {
            console.log("addedFileArray.file: ", fileUrl, "INDEX: ", idx);
            
            return (
              <div 
                className="flex flex-col items-center text-center"
                key={idx}
              >

                <button 
                  id={componentId + "-remove-item-button" + idx}
                  // className="absolute top-0 right-0 z-50 p-1 bg-white rounded-bl focus:outline-none outline-black" 
                  type="button" 
                  onClick={() => console.log("remove button clicked")}
                >
                    <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <img 
                  className="relative inset-0 z-0 object-cover w-full h-full border-4 border-black preview" 
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