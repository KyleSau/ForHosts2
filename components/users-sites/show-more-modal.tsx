"use client"
import React, { useState } from 'react';
import Modal from '@/components/modal';

interface ShowMoreModalProps {
    text: string;
}

export default function ShowMoreModal({ text }: ShowMoreModalProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const characterLimit = 700;
    const formattedText = text.replace(/\\/g, '\,').replace(/\n/g, '<br />'); // Convert line breaks to HTML line breaks

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    return (
        <div className="w-full">
            {text.length <= characterLimit ? (
                <div
                    className="text-sm grid items-center dark:text-black h-full w-full"
                    dangerouslySetInnerHTML={{ __html: formattedText }}
                />
            ) : (
                <>
                    <div
                        className="text-sm grid items-center dark:text-black h-full w-full"
                        dangerouslySetInnerHTML={{
                            __html: `${formattedText.substring(0, characterLimit)}...`,
                        }}
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={openModal}
                            className="bg-gray-400 rounded-md p-2 hover:bg-gray-200 mx-auto mt-4"
                        >
                            Show More
                        </button>
                    </div>
                </>
            )}

            {isModalOpen && (
                <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
                    <div className="border border-gray-400 bg-white p-6 z-[210] max-h-96 overflow-y-auto">
                        <button
                            className="top-1 right-4 text-2xl absolute"
                            onClick={closeModal}
                        >
                            &#10005;
                        </button>
                        <div
                            className="text-sm grid items-center dark:text-black w-full"
                            dangerouslySetInnerHTML={{ __html: formattedText }}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}
