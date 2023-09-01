"use client";

import React, { ReactElement, ReactNode } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import Modal from "@/components/modal";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export interface EditorWarningModalDataType {
  idxToRemove: number,
  message: string
}

export const EditorWarningModalDataTemplate = {
  idxToRemove: -1,
  message: ""
}


const getModalTitle: any = (modalData: EditorWarningModalDataType) => {
  if(modalData && modalData?.idxToRemove > -1) {
    return <p className="font-extrabold">Delete Confirmation</p>;
  } else if (modalData && modalData?.idxToRemove == -1) {
    return <p className="font-extrabold">Image Limit Reached</p>;
  } else if (modalData && modalData?.idxToRemove == -2) {
    return <p className="font-extrabold">Images Above the Size Limit Were Not Added</p>;
  } 
  return <p></p>;
}

export default function EditorWarningModal (
  { 
    modalOpen, 
    setModalOpen, 
    handleDeletePressed, 
    modalData 
  }: 
  { 
    modalOpen: boolean, 
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleDeletePressed: Function, 
    modalData: EditorWarningModalDataType 
  }
) 
{
  const ModalContent = () => (
    <div className=" relative border border-gray-400 bg-white p-6">
      {
        getModalTitle(modalData)
      }
      <div className="alert alert-danger py-4 whitespace-pre-line">
        {modalData.message}
      </div>
      <div 
        className="flex space-x-4"
      >
        <button 
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </button>
        {
          modalData && modalData?.idxToRemove > -1 &&
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDeletePressed(modalData.idxToRemove)}
          >
            Delete
          </button>
        }
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <Modal showModal={modalOpen} setShowModal={setModalOpen}>
        <ModalContent />
      </Modal>
    </div>
  );
};

