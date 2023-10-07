"use client";
import React, { useState } from 'react';
import CopyTextToClipboard from './copy-text-to-clipboard';
import CreateCalendarButton from './create-calendar-button';
import ImportCalendarModal from './import-calendar-modal';

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
            <p>Calendar Manager</p>
            <div className="text-2xl font-semibold text-gray-800 mb-2">Export Calendar</div>
            {/* title for export calendar */}
            <CopyTextToClipboard text={exportLink} />

            {/* Title for import callendars */}
            {/* (1) make sure they can't import the exported calendar or any calendar's from forhosts */}
            <div className="text-2xl font-semibold text-gray-800 mb-2">Import Calendars</div>
            <button onClick={openModal}>Import Calendar</button>
            <CreateCalendarButton>
                <ImportCalendarModal />
            </CreateCalendarButton>

            {isModalOpen && <ImportCalendarModal />}
        </div>
    );
}
