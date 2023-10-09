"use client";
import React, { useEffect, useState } from 'react';
import CopyTextToClipboard from './copy-text-to-clipboard';
import CreateCalendarButton from './create-calendar-button';
import ImportCalendarModal from './import-calendar-modal';
import EditorWrapper from './editor-container-wrapper';
import { deleteCalendar, getCalendars } from '@/lib/actions';
import { Calendar } from '@prisma/client';
import { Trash2 } from 'lucide-react';

interface CalendarManagerProps {
    postId: string;
    importedCalendars: Calendar[];
}

export default function CalendarManager({ postId, importedCalendars }: CalendarManagerProps) {
    const exportLink = `https://forhosts.com/api/post/${postId}/calendar.ics`;

    const [calendars, setCalendars] = useState<Calendar[]>(importedCalendars);


    const fetchCalendars = async () => {
        const fetchedCalendars = await getCalendars(postId);
        setCalendars(fetchedCalendars);
    };

    useEffect(() => {
        fetchCalendars();
    }, [postId]);

    const addCalendar = async (newCalendar: Calendar) => {
        // Call fetchCalendars to refetch all calendars
        await fetchCalendars();
    };

    const removeCalendar = async (calendarId: string) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this calendar?");
        if (userConfirmed) {
            const result = await deleteCalendar(calendarId, postId);
            if (result.success) {
                await fetchCalendars();  // Refetch calendars after deletion
            } else {
                console.error(result.error);
            }
        }
    };

    return (
        <div>
            <EditorWrapper>
                <div className="w-full">
                    <div className="text-2xl font-semibold text-gray-800 mb-5">Export Calendar</div>
                    <CopyTextToClipboard text={exportLink} />
                    <div className="text-2xl font-semibold text-gray-800 mt-5 mb-5">Import Calendars</div>
                    <div className="mb-5">
                        <CreateCalendarButton>
                            <ImportCalendarModal postId={postId} addCalendar={addCalendar} />
                        </CreateCalendarButton>
                    </div>
                </div>
                <div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                    {calendars.map(calendar => (
                        <div key={calendar.id} className="p-4 border rounded mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-lg">{calendar.name}</div>
                                    <div className="text-sm text-gray-500">Last updated: {new Date(calendar.updatedAt).toLocaleString()}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Assuming you have an icon component or an SVG for the trash can */}
                                    {/* <TrashCanIcon className="h-5 w-5 text-gray-600" /> */}
                                    <Trash2 size={18} color="black" className="mr-2" />
                                    {/* <button onClick={() => deleteCalendar(calendar.id, postId)} className="text-black font-medium">Remove</button> */}
                                    <button onClick={() => removeCalendar(calendar.id)} className="text-black font-medium">Remove</button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <a href={calendar.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{calendar.url}</a>
                            </div>
                        </div>
                    ))}

                </div>
            </EditorWrapper>
        </div>
    );
}
