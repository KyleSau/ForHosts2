import { NextApiRequest, NextApiResponse } from 'next';
import { getReservationsByPostId } from '@/lib/actions';
import { getPostData } from '@/lib/fetchers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { domain, slug } = req.query;
    const data = await getPostData(domain as string, slug as string);

    if (!data) {
        return res.status(404).end();
    }

    const postId = data.id;
    console.log('API DETERMINED postId: ' + postId);
    const events: any = await getReservationsByPostId(postId);

    // Generate the content you want to return for the calendar without the HTML and metadata
    // const calendarContent = JSON.stringify(events);
    const calendarContent = `
    BEGIN: VCALENDAR
    VERSION: 2.0
    PRODID: -//Your Company//Your Application//EN
        CALSCALE: GREGORIAN
    BEGIN: VEVENT
    SUMMARY: clkalnvrt0002mi084cw8m8d0
    DTSTART: 20230703T193000.000ZZ
    DTEND: 20230727T114500.000ZZ
    DESCRIPTION: CONFIRMED
    LOCATION: none
    END: VEVENT
    BEGIN: VEVENT
    SUMMARY: clkalnvrt0002mi084cw8m8d0
    DTSTART: 20230703T193000.000ZZ
    DTEND: 20230812T114500.000ZZ
    DESCRIPTION: CONFIRMED
    LOCATION: none
    END: VEVENT
    BEGIN: VEVENT
    SUMMARY: clkalnvrt0002mi084cw8m8d0
    DTSTART: 20230703T193000.000ZZ
    DTEND: 20230812T114500.000ZZ
    DESCRIPTION: CONFIRMED
    LOCATION: none
    END: VEVENT
    BEGIN: VEVENT
    SUMMARY: clkalnvrt0002mi084cw8m8d0
    DTSTART: 20230703T193000.000ZZ
    DTEND: 20230812T114500.000ZZ
    DESCRIPTION: CONFIRMED
    LOCATION: none
    END: VEVENT
    END: VCALENDAR
    `;

    // Set the response content type to application/json
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(calendarContent);
}
