"use client";

import { Image } from 'lucide-react';

export function FileClickDragDrop(
  {componentName}:
  {componentName: string}
) 
{
  const componentId = componentName + "_drop_zone";


  const dropHandler = (ev: any) => {
    console.log("File(s) dropped");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }

  const dragOverHandler = (ev: any) => {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  return (<>
  <div
    id={componentId}
    className="relative flex flex-col items-center justify-center py-10 text-center text-gray-400 border border-gray-200 rounded"
  >
    <input accept="image/png, image/jpeg" type="file" title=""  multiple
      className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
    />
    <Image id="drag-drop-image-icon"/>
    <p className="m-0">Drag your files here or click in this area.</p>
  </div>
  <div
    className="relative flex flex-col items-center justify-center py-10 text-center text-gray-400 border border-gray-200 rounded"
  >
    PLACE TO SHOW ADDED PICS
  </div>
  </>);
};