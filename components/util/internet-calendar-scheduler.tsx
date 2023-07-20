import React, { useEffect } from 'react';
import { saveAs } from 'file-saver';

interface Event {
    id: string;
    postId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    // TODO:
    // summary
    // description
    // location
}

interface InternetCalendarSchedulerProps {
    events: Event[];
}

const InternetCalendarScheduler: React.FC<InternetCalendarSchedulerProps> = ({ events }) => {
    const generateICal = () => {
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Your Company//Your Application//EN',
            'CALSCALE:GREGORIAN',
        ];

        events.forEach((event) => {
            lines.push('BEGIN:VEVENT');
            lines.push(`SUMMARY:${event.postId || 'none'}`);
            lines.push(`DTSTART:${event.startDate.toISOString().replace(/[-:]/g, '')}Z`);
            lines.push(`DTEND:${event.endDate.toISOString().replace(/[-:]/g, '')}Z`);
            lines.push(`DESCRIPTION:${event.status || 'none'}`);
            lines.push(`LOCATION:none`);
            lines.push('END:VEVENT');
        });

        lines.push('END:VCALENDAR');

        return lines.join('\n');
    };

    useEffect(() => {
        const downloadICSFile = () => {
            const icsData = generateICal();
            const blobData = new Blob([icsData], { type: 'text/calendar' });
            saveAs(blobData, 'calendar.ics');
        };

        downloadICSFile();
    }, []);

    return <div>Downloading .ics file...</div>;
};

export default InternetCalendarScheduler;
