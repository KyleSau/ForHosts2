"use client"
import { useState } from 'react';

export default function ShowMoreModal({ text }) {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);

    return (
        <div>
            {text.slice(0, 350)} {/* Adjust the slice value as needed */}

            {text.length > 350 && (
                <button
                    className="text-blue-500 mt-4"
                    onClick={openModal}
                >
                    Show More
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow-lg max-w-xl w-full">
                        {text}

                        <button
                            className="text-blue-500 mt-4"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>

                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={closeModal}
                    ></div>
                </div>
            )}
        </div>
    );
}
