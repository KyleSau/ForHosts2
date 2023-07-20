import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PrismaClient } from '@prisma/client';
import { getReservationsByPostId } from "@/lib/actions";
import InternetCalendarScheduler from "@/components/util/internet-calendar-scheduler";

interface PathProps extends ParsedUrlQuery {
    site: string;
    slug: string;
}

interface PathProps extends ParsedUrlQuery {
    site: string;
    slug: string;
}

export default async function CalendarICS({ postId }: { postId: string }) {

    const data: any = await getReservationsByPostId(postId);

    return (
        <div>
            Post Id: {postId}
            {/* <InternetCalendarScheduler events={data} /> */}
        </div>
    )

}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const prisma = new PrismaClient();
    const { site, slug } = query as PathProps;

    const post = await prisma.post.findFirst({
        where: {
            site: {
                subdomain: site,
            },
            slug,
        },
        select: {
            id: true,
        },
    });

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            postId: post.id,
        },
    };
};

// import React from 'react';

// const events = [
//     {
//         summary: 'Guest Name 1 - Reservation #1234567',
//         dtstart: '20230721T150000Z',
//         dtend: '20230724T120000Z',
//         location: 'Property Address 1',
//         description: 'Airbnb Reservation ID: 1234567',
//         url: 'Link to Airbnb Reservation Page 1',
//     },
//     {
//         summary: 'Guest Name 2 - Reservation #9876543',
//         dtstart: '20230730T140000Z',
//         dtend: '20230805T110000Z',
//         location: 'Property Address 2',
//         description: 'VRBO Reservation ID: 9876543',
//         url: 'Link to VRBO Reservation Page 2',
//     },
//     {
//         summary: 'Guest Name 3 - Reservation #5555555',
//         dtstart: '20230810T160000Z',
//         dtend: '20230815T120000Z',
//         location: 'Property Address 3',
//         description: 'Airbnb Reservation ID: 5555555',
//         url: 'Link to Airbnb Reservation Page 3',
//     },
// ];

// const generateICal = () => {
//     const lines = [
//         'BEGIN:VCALENDAR',
//         'VERSION:2.0',
//         'PRODID:-//ForHosts.com//Direct Booking//EN',
//         'CALSCALE:GREGORIAN',
//     ];

//     events.forEach((event) => {
//         lines.push('BEGIN:VEVENT');
//         lines.push(`SUMMARY:${event.id}`);
//         lines.push(`DTSTART:${event.start}`);
//         lines.push(`DTEND:${event.end}`);
//         lines.push(`LOCATION:$unknown`);
//         lines.push(`DESCRIPTION:${event.title}`);
//         lines.push(`URL:none`);
//         lines.push('END:VEVENT');
//     });

//     lines.push('END:VCALENDAR');

//     return lines.join('\n');
// };

// // get lisitngId

// // const data: any = await getReservations(listingId);

// interface Event {
//     id: string;
//     dtstart: string;
//     dtend: string;
//     location: string;
//     description: string;
//     url: string;
// }

// const ICalComponent = () => {
//     const iCalData = generateICal();

//     return (
//         <div>
//             <pre>{iCalData}</pre>
//         </div>
//     );
// };

// export default ICalComponent;
