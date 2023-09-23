import ical from 'ical';
import { NextResponse } from 'next/server';
import { getCalendarUrls } from '@/lib/actions';

export async function GET(
    _req: Request,
    { params }: { params: { slug: string } },
) {
    // const postId = params.slug;

    // const testCalendarUrls = [
    //     'https://www.airbnb.com/calendar/ical/868041367168498626.ics?s=58954ec46433bf7f3a6ecd8e5eebf199',
    //     'https://forhosts.com/api/post/clkalnvrt0002mi084cw8m8d0/calendar.ics',
    // ];

    // const calendarUrls = await getCalendarUrls(postId);

    // // If calendarUrls is an object with an error property, handle the error
    // if (typeof calendarUrls === 'object' && 'error' in calendarUrls) {
    //     console.error('Error fetching calendar URLs:', calendarUrls.error);
    //     return new NextResponse(JSON.stringify([])); // Return an empty array to avoid further errors
    // }

    // const lookupCalendarEvents = async (calendarUrls: string[]) => {
    //     const events = [];

    //     // Convert calendarUrls to an array if it's not already one
    //     const urlsArray = Array.isArray(calendarUrls) ? calendarUrls : [calendarUrls];

    //     for (const calendarUrl of urlsArray) {
    //         const response = await fetch(calendarUrl);
    //         const text = await response.text();
    //         console.log('text: ' + text);
    //         const data = ical.parseICS(text); // if this throws an exception

    //         console.log('data: ' + JSON.stringify(data));

    //         for (const eventId in data) {
    //             if (data.hasOwnProperty(eventId) && data[eventId].type === 'VEVENT') {
    //                 const eventData = data[eventId];
    //                 const { start, end } = eventData;

    //                 // Append the start and end dates to the events array
    //                 events.push({ start, end });
    //             }
    //         }
    //     }

    //     return events; // Move this line outside the for-loop
    // }

    // const response = await lookupCalendarEvents(calendarUrls);

    // return new NextResponse(JSON.stringify(response));
}
