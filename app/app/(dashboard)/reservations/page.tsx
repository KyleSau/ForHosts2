import { getSession } from "@/lib/auth";
import { getReservations } from "@/lib/actions";
import { redirect } from "next/navigation";
import ReservationTable from "@/components/reservations/reservation-table";

export default async function ReservationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const data: any = await getReservations();

  return (
    <div className="mx-auto  sm:px-6 lg:px-8 py-5">
      <div className="text-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
          Reservations
        </h1>
      </div>
      <div className="mt-5">
        <div className="overflow-x-auto">
          <ReservationTable data={data} />
        </div>
      </div>
    </div>
  );
}
