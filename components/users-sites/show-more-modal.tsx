"use client"
import React, { useState } from 'react';
import MDX from "@/components/mdx";
import Modal from "@/components/modal";

interface ShowMoreModalProps {
    text: string;
    mdxSource: any;
}

export default function ShowMoreModal({ text, mdxSource }: ShowMoreModalProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const characterLimit = 700;

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const ModalContent = () => (

        <div className="border border-gray-400 bg-white p-6 z-[210]">
            <button
                className="top-1 right-4 text-2xl"
                onClick={() => setModalOpen(false)}
            >
                &#10005;
            </button>
            <div>
                <MDX source={mdxSource} />
            </div>
        </div>
    );

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {text.slice(0, characterLimit)} {/* Adjust the slice value as needed */}
            {text.length > 100 && (
                <button
                    className="text-blue-500 mt-4"
                    onClick={openModal}
                >
                    Show More
                </button>
            )}
            {isModalOpen &&
                <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
                    <ModalContent />
                </Modal>
            }
        </div>
    );

}
