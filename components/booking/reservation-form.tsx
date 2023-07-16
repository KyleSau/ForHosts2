"use client";
import React, { useState } from 'react';
import { toast } from "sonner";
import va from "@vercel/analytics";
import { createReservation } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface ReservationData {
    startDate: Date;
    endDate: Date;
    guests: number;
    listingId: string;
}

// Retrieve the listingId as a prop
// Limit the guestCapacity from the listingId

export default function ReservationForm() {
    const router = useRouter();

    const [reservation, setReservation] = useState<ReservationData>();

    const handleFinalizeReservation = async (data: FormData) => {
        console.log('Finalize Reservation');
        // Send ReservationData as MetaData to Stripe Checkout
        
        console.log("action dispatched");
        await createReservation(data).then((res: any) => {
          if (res.error) {
              console.log("Getting res.error: ", res.error);
              toast.error(res.error);
          } else {
              va.track("Created Reservation");
              const { id } = res;
              router.refresh();
              router.push(`/reservations`);
              toast.success(`Successfully created reservation!`);
          }
        });
    };

    return (<>
          {/* Date Ranger Picker from AirBnB */}
          <button 
            type="submit" 
            form="reservationForm1" 
            value="Submit"
            className='flex space-x-4 items-center border border-white text-white font-bold py-3 px-4 rounded'>
              Reserve
          </button>

          <form
            action={(data: FormData) => handleFinalizeReservation(data)}
            id="reservationForm1"
            className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
          >
            {/* <label htmlFor="user-id" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">userId: </label>
            <input type="text" name="user-id" />
            <br/> */}
            <label htmlFor="listing-id" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">listingId: </label>
            <input type="text" name="listing-id"  required />
            <br/>
            <label htmlFor="start-date" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">startDate: </label>
            <input type="datetime-local" id="start-date"
              name="start-date" defaultValue="2023-07-03T19:30"
              min="2023-07-00T00:00" max="2025-06-14T00:00"></input>
            <br/>
            <label htmlFor="end-date" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">endDate: </label>
            <input type="datetime-local" id="end-date"
              name="end-date" defaultValue="2023-08-12T11:45"
              min="2018-07-00T00:00" max="2025-06-14T00:00"></input>
            <br/>
            <label htmlFor="total-price" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">totalPrice: </label>
            <input type="number" step="0.01" name="total-price"  required />
            <br/>
            <label htmlFor="reservation-status" className="bg-neutral-800 text-neutral-50 dark:bg-transparent">status: </label>
            <select id="reservation-status" name="reservation-status">
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </form>
    </>);
}

