import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReservationTable from "@/components/reservations/reservation-table";

////// DUMMY DATA ////// TODO: Remove when connection to DB is confirmed

const reservations = [
  {
    id: "resId123",
    userId: "userId123",
    listingId: "listing123",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    totalPrice: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "CONFIRMED",
  },
  {
    id: "resId234",
    userId: "userId234",
    listingId: "listing234",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    totalPrice: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "PENDING",
  },
  {
    id: "resId345",
    userId: "userId345",
    listingId: "listing345",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    totalPrice: 135,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "CONFIRMED",
  },
  {
    id: "resId456",
    userId: "userId456",
    listingId: "listing456",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    totalPrice: 240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "PENDING",
  },
];

export default async function ReservationsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // const reservations = await prisma?.reservation.findMany({
  //     where: {
  //         user: {
  //             id: session.user.id as string,
  //         },
  //     },
  //     orderBy: {
  //         createdAt: "asc",
  //     }
  // });

  return (
    <div className="mx-auto  sm:px-6 lg:px-8 py-5">
      <div className="text-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold dark:text-white">
          Reservations
        </h1>
      </div>
      <div className="mt-5">
        <div className="overflow-x-auto">
          <ReservationTable reservations={reservations} />
        </div>
      </div>
    </div>
  );
}
