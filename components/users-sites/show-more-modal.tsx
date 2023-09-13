"use client"
import React, { useState } from 'react';
import Modal from "@/components/modal";
import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';
import { serialize } from 'next-mdx-remote/serialize';

interface ShowMoreModalProps {
    text: string;
    mdxSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>;
}

const components = {}; // Define any custom components or overrides here

export default function ShowMoreModal({ text, mdxSource }: ShowMoreModalProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const characterLimit = 700;

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const formattedText = (
        <MDXRemote {...mdxSource} components={components} />
    );

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {text.length > characterLimit ? (
                <>
                    <div
                        dangerouslySetInnerHTML={{ __html: text.slice(0, characterLimit) }}
                    />
                    <div className="flex justify-center">
                        <button
                            className="p-2 m-2 mx-auto rounded-sm justify-center w-[25%] text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 hover:bg-gradient-to-brfont-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={openModal}
                        >
                            Show More
                        </button>
                    </div>
                </>
            ) : (
                formattedText
            )}
            {isModalOpen && (
                <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
                    <div className="border border-gray-400 bg-white p-6 z-[210]">
                        <button
                            className="top-1 right-4 text-2xl"
                            onClick={closeModal}
                        >
                            &#10005;
                        </button>
                        <div>
                            {formattedText}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
