import { getReservationsByPostId } from '@/lib/actions';

export async function GET(
    _req: Request,
    { params }: { params: { slug: string } },
) {
    const postId = params.slug;

    const events: any = await getReservationsByPostId(postId);

    const calendarContent = `
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Your Company//Your Application//EN
    CALSCALE:GREGORIAN
    ${events.map((event: any) => `
      BEGIN:VEVENT
      SUMMARY:${event.postId || 'none'}
      DTSTART:${new Date(event.startDate).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}
      DTEND:${new Date(event.endDate).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}
      DESCRIPTION:${event.status || 'none'}
      LOCATION:none
      END:VEVENT>`).join('\n')}
    END:VCALENDAR
  `;

    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar');
    headers.set('Content-Disposition', 'attachment; filename=calendar.ics');

    return new Response(calendarContent, {
        status: 200,
        headers,
    });
}


// import { NextResponse } from "next/server";
// import { getReservationsByPostId } from '@/lib/actions';

// export async function GET(
//     _req: Request,
//     { params }: { params: { slug: string } },
// ) {
//     const postId = params.slug;

//     const events: any = await getReservationsByPostId(postId);

//     const calendarContent = `
//       BEGIN: VCALENDAR
//       VERSION: 2.0
//       PRODID: -//Your Company//Your Application//EN
//       CALSCALE: GREGORIAN
//       BEGIN: VEVENT
//       SUMMARY: clkalnvrt0002mi084cw8m8d0
//       DTSTART: 20230703T193000.000ZZ
//       DTEND: 20230727T114500.000ZZ
//       DESCRIPTION: CONFIRMED
//       LOCATION: none
//       END: VEVENT
//       BEGIN: VEVENT
//       SUMMARY: clkalnvrt0002mi084cw8m8d0
//       DTSTART: 20230703T193000.000ZZ
//       DTEND: 20230812T114500.000ZZ
//       DESCRIPTION: CONFIRMED
//       LOCATION: none
//       END: VEVENT
//       BEGIN: VEVENT
//       SUMMARY: clkalnvrt0002mi084cw8m8d0
//       DTSTART: 20230703T193000.000ZZ
//       DTEND: 20230812T114500.000ZZ
//       DESCRIPTION: CONFIRMED
//       LOCATION: none
//       END: VEVENT
//       BEGIN: VEVENT
//       SUMMARY: clkalnvrt0002mi084cw8m8d0
//       DTSTART: 20230703T193000.000ZZ
//       DTEND: 20230812T114500.000ZZ
//       DESCRIPTION: CONFIRMED
//       LOCATION: none
//       END: VEVENT
//       END: VCALENDAR
//   `;

//     return NextResponse.json({ response: "ok" });
// }
