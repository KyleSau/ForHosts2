"use client"
import React, { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'lucide-react';

interface CalendarManagerProps {
    text: string;
}

export default function CopyTextToClipboard({ text }: CalendarManagerProps) {
    const [copied, setCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
    };


    return (
        <div>
            <div className="relative">
                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => { setShowTooltip(false); setCopied(false); }}
                    onClick={handleCopyClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none">
                    {text}
                </button>

                {showTooltip && (
                    <div className="absolute flex justify-center items-center top-full mt-2 p-4 bg-gray-900 text-white text-center text-sm rounded-lg shadow-lg">
                        {copied ? (
                            <>
                                <ClipboardCheck size={18} color="green" className="mr-2" />
                                Link copied!
                            </>
                        ) : (
                            <>
                                <Clipboard size={18} color="white" className="mr-2" />
                                Click to copy link
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
