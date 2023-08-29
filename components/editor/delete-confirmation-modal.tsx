"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "@/components/modal";

export interface EditorWarningModalDataType {
  idxToRemove: number,
  fileName: string,
  message: string
}

export const EditorWarningModalDataTemplate = {
  idxToRemove: -1,
  fileName: "",
  message: ""
}

export default function EditorWarningModal (
  { modalOpen, 
    setModalOpen, 
    handleDeletePressed, 
    modalData 
  }: 
  { modalOpen: boolean, 
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleDeletePressed: Function, 
    modalData: EditorWarningModalDataType }) 
{
  const ModalContent = () => (
    <div className=" relative border border-gray-400 bg-white p-6">
      <p>Delete Confirmation</p>
      <div className="alert alert-danger">{modalData.message}</div>
      <button onClick={() => setModalOpen(false)}>
        Cancel
      </button>
      {
        modalData && modalData.idxToRemove && modalData.idxToRemove >= 0 &&
        <button onClick={() => handleDeletePressed(modalData.idxToRemove)}>
          Delete
        </button>
      }
    </div>
  );
  
  return (
    <div className="w-full">
      <Modal showModal={modalOpen} setShowModal={setModalOpen}>
        <ModalContent />
      </Modal>
    </div>
  );
}

