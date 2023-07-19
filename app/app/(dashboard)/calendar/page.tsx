import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReservations } from "@/lib/actions";
import ReservationCalendar from "@/components/reservation-calendar";

export default async function CalendarPage() {

    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const data = await getReservations();

    return <ReservationCalendar reservations={data} />;
}
