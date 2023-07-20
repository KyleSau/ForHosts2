import { notFound } from "next/navigation";
import { getReservationsByPostId } from "@/lib/actions";
import { getPostData } from "@/lib/fetchers";
import InternetCalendarScheduler from "@/components/util/internet-calendar-scheduler";

export default async function CalendarICSPage({
    params,
}: {
    params: { domain: string; slug: string };
}) {
    const { domain, slug } = params;
    const data = await getPostData(domain, slug);

    if (!data) {
        notFound();
    }

    const postId = data.id;

    const events: any = await getReservationsByPostId(postId);

    return (
        <div>
            <InternetCalendarScheduler events={events} />
        </div>
    );

}