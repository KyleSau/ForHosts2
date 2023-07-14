import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import { useModal } from "@/components/modal/provider";
import { editUser } from "@/lib/actions";
import va from "@vercel/analytics";
import { toast } from "sonner";
import { createReservation } from "@/lib/actions";
import { Prisma, Reservation } from "@prisma/client";
import ReservationTable from "@/components/reservations/Reservation-Table";

////// DUMMY DATA ////// TODO: Remove when connection to DB is confirmed
const reservations = [
  {
    id: "resId123",
    userId: "userId123",
    listingId: "listing123",
    startDate: new Date(),
    endDate: undefined,
    totalPrice: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "CONFIRMED",
  },
  {
    id: "resId234",
    userId: "userId234",
    listingId: "listing234",
    startDate: new Date(),
    endDate: undefined,
    totalPrice: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "PENDING",
  },
  {
    id: "resId345",
    userId: "userId345",
    listingId: "listing345",
    startDate: new Date(),
    endDate: undefined,
    totalPrice: 135,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "CONFIRMED",
  },
  {
    id: "resId456",
    userId: "userId456",
    listingId: "listing456",
    startDate: new Date(),
    endDate: undefined,
    totalPrice: 240,
    createdAt: new Date(),
    updatedAt: new Date(),
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
