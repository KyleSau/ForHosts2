"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clipboard, ClipboardCheck } from 'lucide-react';

interface CalendarManagerProps {
    text: string;
}

export default function CopyTextToClipboard({ text }: CalendarManagerProps) {
    const [copied, setCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [inputSize, setInputSize] = useState(10); // Initial size

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
    };

    useEffect(() => {
        // Calculate and set the input size based on the length of the text
        setInputSize(text.length || 1);
    }, [text]);

    return (
        <div className="flex">
            <div className="relative flex">
                <input
                    name="url"
                    type="url"
                    value={text}
                    onChange={() => { }}
                    required
                    size={inputSize} // Set the size dynamically
                    className="rounded-md border border-stone-200 bg-stone-50 px-4 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none dark:bg-black dark:text-white dark:placeholder-stone-700  md:max-w-[300px] max-w-[240px]"
                />
                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => { setShowTooltip(false); setCopied(false); }}
                    onClick={handleCopyClick}
                    className="ml-2 relative top-0 left-0 px-4 bg-black text-white rounded-md outline-offset-0 focus:border-none">
                    Copy
                </button>
            </div>

            {showTooltip && (
                <div className="relative flex top-10 right-20 px-4 items-center bg-gray-900 text-white text-center text-sm rounded-lg outline-offset-0">
                    {copied ? (
                        <>
                            <CheckCircle2 size={18} color="green" className="mr-2" />
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

    );
}

