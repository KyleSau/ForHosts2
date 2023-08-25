"use client";

import { Image, Trash2 } from 'lucide-react';
import { FILE_CONSTS } from '@/lib/constants';
import React, { SyntheticEvent, useState } from 'react';

export function FileClickDragDrop({ componentId }: { componentId: string }) {
  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [addedFileArray, setAddedFileArray] = useState<(File | null)[]>([]);
  const [addedFileUrlArray, setAddedFileUrlArray] = useState<(string | undefined)[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const addFileAndUrlToState = (newFiles: (File | null)[]) => {
    setAddedFileArray([...addedFileArray, ...newFiles]);

    const urlsForNewFiles: (string | undefined)[] = newFiles.map((file: File | null) => {
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        return fileUrl;
      }
    });
    setAddedFileUrlArray([...addedFileUrlArray, ...urlsForNewFiles]);
  };

  const removeFileAndUrlFromState = (idxToRemove: number) => {
    const addedFileArrayWithItemRemoved = addedFileArray.filter((_, itemIdx: number) => itemIdx !== idxToRemove);
    const addedFileUrlArrayWithItemRemoved = addedFileUrlArray.filter((_, itemIdx: number) => itemIdx !== idxToRemove);
    setAddedFileArray(addedFileArrayWithItemRemoved);
    setAddedFileUrlArray(addedFileUrlArrayWithItemRemoved);
  };

  const addFilesFromOpenPopup = (event: any) => {
    const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
      .filter((file: File) => PERMITTED_FILE_TYPES.has(file.type));
    addFileAndUrlToState(newFiles);
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

    addFileAndUrlToState(newFiles);
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
      const updatedAddedFileArray = [...addedFileArray];
      const updatedAddedFileUrlArray = [...addedFileUrlArray];

      // Swap in addedFileArray
      const tempFile = updatedAddedFileArray[draggedIdx];
      updatedAddedFileArray[draggedIdx] = updatedAddedFileArray[idx];
      updatedAddedFileArray[idx] = tempFile;

      // Swap in addedFileUrlArray
      const tempFileUrl = updatedAddedFileUrlArray[draggedIdx];
      updatedAddedFileUrlArray[draggedIdx] = updatedAddedFileUrlArray[idx];
      updatedAddedFileUrlArray[idx] = tempFileUrl;

      setAddedFileArray(updatedAddedFileArray);
      setAddedFileUrlArray(updatedAddedFileUrlArray);
    }

    setDraggedIdx(null); // Reset the dragged item index
  };


  return (
    <>
      <div
        id={componentId}
        className="relative flex flex-col items-center justify-center py-5 text-center text-gray-400 border border-black rounded"
      >
        <input accept="image/png, image/jpeg" type="file" title="" multiple
          className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
          onDrop={dropNewImageHandler}
          onDragOver={dragOverHandler}
          onChange={addFilesFromOpenPopup}
        />
        <Image id="drag-drop-image-icon" />
        <p className="m-0">Drag your files here or click in this area.</p>
      </div>

      <div className="relative flex flex-col items-center justify-center py-20 text-center text-gray-400 border border-black rounded">
        Your Added Pictures Will Appear Here
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6 outline-black"
          onDragOver={dragOverHandler}
        >
          {addedFileUrlArray.map((fileUrl: string | undefined, idx: number) => {
            return (
              <div
                id={componentId + "-image-container" + idx}
                key={idx}
                className="flex flex-col items-center text-center"
                draggable={true}
                onDragStart={(e) => dragStartHandler(e, idx)}
                onDrop={(e) => dropForMoveHandler(e, idx)}
                onDragOver={dragOverHandler}
              >
                <button
                  type="button"
                  onClick={() => removeFileAndUrlFromState(idx)}
                >
                  <Trash2 />
                </button>
                <img className="relative inset-0 z-0 object-cover w-full h-full border-4 border-black preview"
                  src={fileUrl}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
