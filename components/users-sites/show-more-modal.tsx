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
    const characterLimit = 400;

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
        <div>
            {text.slice(0, 100)} {/* Adjust the slice value as needed */}

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
