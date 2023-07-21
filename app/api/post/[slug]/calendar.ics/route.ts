import { getReservationsByPostId } from '@/lib/actions';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const postId = params.slug;

  const events: any = await getReservationsByPostId(postId);

  const eventComponents = events.map((event: any) => `
BEGIN:VEVENT
SUMMARY:${event.postId || 'none'}
DTSTART:${new Date(event.startDate).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}
DTEND:${new Date(event.endDate).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}
DESCRIPTION:${event.status || 'none'}
LOCATION:none
END:VEVENT`
  );

  const calendarContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ForHosts.com//Host Site//EN
CALSCALE:GREGORIAN${eventComponents.join('')}
END:VCALENDAR
  `;

  const headers = new Headers();
  headers.set('Content-Type', 'text/calendar');
  headers.set('Content-Disposition', 'inline'); // Display content inline

  return new Response(calendarContent/*, {
    status: 200,
    headers,
  }*/);
}
