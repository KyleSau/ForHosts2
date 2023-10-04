"use client";
import React, { useState } from 'react';
// Importing Lucide icons
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface CalendarManagerProps {
    postId: string;
}

export default function CalendarManager({ postId }: CalendarManagerProps) {
    const exportLink = `https://forhosts.com/api/post/${postId}/calendar.ics`;

    const [copied, setCopied] = useState(false);

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(exportLink);
        setCopied(true);
    };

    return (
        <div>
            <p>Calendar Manager</p>
            {/* Assuming you have imported TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleCopyClick}>
                            Export: {exportLink}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {copied ? (
                            <>
                                <ClipboardCheck size={18} color="black" /> Link copied!
                            </>
                        ) : (
                            <>
                                <Clipboard size={18} color="black" /> Click to copy link
                            </>
                        )}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
