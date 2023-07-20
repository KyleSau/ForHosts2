import React from 'react';

const events = [
    {
        summary: 'Guest Name 1 - Reservation #1234567',
        dtstart: '20230721T150000Z',
        dtend: '20230724T120000Z',
        location: 'Property Address 1',
        description: 'Airbnb Reservation ID: 1234567',
        url: 'Link to Airbnb Reservation Page 1',
    },
    {
        summary: 'Guest Name 2 - Reservation #9876543',
        dtstart: '20230730T140000Z',
        dtend: '20230805T110000Z',
        location: 'Property Address 2',
        description: 'VRBO Reservation ID: 9876543',
        url: 'Link to VRBO Reservation Page 2',
    },
    {
        summary: 'Guest Name 3 - Reservation #5555555',
        dtstart: '20230810T160000Z',
        dtend: '20230815T120000Z',
        location: 'Property Address 3',
        description: 'Airbnb Reservation ID: 5555555',
        url: 'Link to Airbnb Reservation Page 3',
    },
];

const generateICal = () => {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Your Company//Your Application//EN',
        'CALSCALE:GREGORIAN',
    ];

    events.forEach((event) => {
        lines.push('BEGIN:VEVENT');
        lines.push(`SUMMARY:${event.summary}`);
        lines.push(`DTSTART:${event.dtstart}`);
        lines.push(`DTEND:${event.dtend}`);
        lines.push(`LOCATION:${event.location}`);
        lines.push(`DESCRIPTION:${event.description}`);
        lines.push(`URL:${event.url}`);
        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    return lines.join('\n');
};

const ICalComponent = () => {
    const iCalData = generateICal();

    return (
        <div>
            <pre>{iCalData}</pre>
        </div>
    );
};

export default ICalComponent;
