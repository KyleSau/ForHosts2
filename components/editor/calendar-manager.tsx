"use client";
import React, { useState } from 'react';
import CopyTextToClipboard from './copy-text-to-clipboard';
import CreateCalendarButton from './create-calendar-button';
import ImportCalendarModal from './import-calendar-modal';
import EditorWrapper from './editor-container-wrapper';

interface CalendarManagerProps {
    postId: string;
}

export default function CalendarManager({ postId }: CalendarManagerProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const exportLink = `https://forhosts.com/api/post/${postId}/calendar.ics`;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <EditorWrapper>
                <div className="text-2xl font-semibold text-gray-800 mb-5">Export Calendar</div>
                <CopyTextToClipboard text={exportLink} />
                <div className="text-2xl font-semibold text-gray-800 mt-5 mb-5">Import Calendars</div>
                <div className="mb-5">
                    <CreateCalendarButton>
                        <ImportCalendarModal />
                    </CreateCalendarButton>
                </div>
                {isModalOpen && <ImportCalendarModal />}
            </EditorWrapper>
        </div>
    );
}
