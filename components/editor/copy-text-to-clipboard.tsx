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
        <div className="absolute flex">
            <input
                name="url"
                type="url"
                value={text}
                onChange={() => { }}
                required
                className="rounded-md w-auto border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
                style={{ width: 'min-content' }}
            />
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => { setShowTooltip(false); setCopied(false); }}
                onClick={handleCopyClick}
                className="relative top-0 right-0 h-full px-4 py-2 ml-2 bg-black text-white rounded-md focus:outline-none">
                Copy
            </button>
        </div>

    );
}
