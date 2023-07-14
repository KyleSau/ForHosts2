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

////// DUMMY DATA ////// TODO: Remove when connection to DB is confirmed
const DUMMY_RESERVATIONS = [
    {
        id: "resId123",
        userId: "userId123",
        listingId: "listing123",
        startDate: Date.now(),
        endDate: undefined,
        totalPrice: 100,
        createdAt: new Date(Date.now()).toISOString(),
        updatedAt: Date.now(),
        status: "CONFIRMED"
    }, 
    {
        id: "resId234",
        userId: "userId234",
        listingId: "listing234",
        startDate: Date.now(),
        endDate: undefined,
        totalPrice: 180,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "PENDING"
    },
    {
        id: "resId345",
        userId: "userId345",
        listingId: "listing345",
        startDate: Date.now(),
        endDate: undefined,
        totalPrice: 135,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "CONFIRMED"
    }, 
    {
        id: "resId456",
        userId: "userId456",
        listingId: "listing456",
        startDate: Date.now(),
        endDate: undefined,
        totalPrice: 240,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "PENDING"
    }
];


export default async function ReservationsPage() {
    console.log("Entered reservations page");
    // const router = useRouter();
    // const modal = useModal();

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    //await createReservation();

    // const reservations = await prisma?.reservation.findMany();
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

    //TODO: this currently uses dummy data, need to replace with DB call
    function createReservationsTable() {
        const resFields = Prisma.dmmf.datamodel.models.find(model => model.name === "Reservation")?.fields;

        return(<table className="table-auto font-cal text-1xl font-bold dark:text-white">
            <thead>
                <tr>
                    <th>#</th>
                    { resFields?.map((field, fieldIdx) => <th key={fieldIdx}>{field.name}</th>)}
                </tr>
            </thead>
            <tbody>
                { DUMMY_RESERVATIONS.map((reservation, idx) => 
                    <tr key={idx}>
                        <td>{idx}</td>
                        {
                            resFields?.map((field) => {
                                type ObjectKey = keyof typeof reservation;
                                const fieldName = field.name as ObjectKey;
                                return <td>{reservation[fieldName]}</td>
                            }
                        )}
                    </tr>
                )}
            </tbody>
        </table>);
    }
    
    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            <div className="flex flex-col space-y-6">
                <h1 className="font-cal text-3xl font-bold dark:text-white">
                    Reservations
                </h1>
            </div>
            { createReservationsTable() }
        </div>
    );
}
