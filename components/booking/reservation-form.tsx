"use client";
import React, { useState } from 'react';
import { toast } from "sonner";
import va from "@vercel/analytics";
import { createReservation } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { RESERVATION_STATUS } from '@/lib/types';

interface ReservationData {
  startDate: Date;
  endDate: Date;
  guests: number;
  postId: string;
}

// Retrieve the postId as a prop
// Limit the guestCapacity from the postId

export default function ReservationForm({ postId }: { postId: string }) {
  const router = useRouter();

  const [reservation, setReservation] = useState<ReservationData>();

  // const delegateStripeCheckout = async (data: FormData) => {
  //   console.log('Delegate Stripe Checkout');
  // }

  // Delegate to Stripe checkout.
  const handleFinalizeReservation = async (data: FormData) => {
    console.log('Finalize Reservation');
    // Send ReservationData as MetaData to Stripe Checkout
    data.append('postId', postId);
    data.append('totalPrice', '1000'); // this is a test value
    data.append('status', 'COMPLETED');

    console.log('test: ' + data.get('postId'));
    // This will be invoked by payment intent webhook.
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

  // from the startDate -> endDate determine days and multiply by price


  return (<>
    {/* Date Ranger Picker from AirBnB */}

    <form
      action={(data: FormData) => handleFinalizeReservation(data)}
      id="reservationForm1"
      className="w-full rounded-md bg-white text-black dark:text-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700 flex flex-col items-center"
    >
      <label>Internal ListingId: {postId}</label>
      <br />
      {/* Date Ranger Picker */}
      <label htmlFor="start-date" className="bg-white text-black dark:bg-white dark:text-black">startDate: </label>
      <input
        type="datetime-local"
        id="start-date"
        name="start-date"
        defaultValue="2023-07-03T19:30"
        min="2023-07-00T00:00"
        max="2025-06-14T00:00"
      />
      <br />
      <label htmlFor="end-date" className="bg-white text-black dark:bg-white dark:text-black">endDate: </label>
      <input
        type="datetime-local"
        id="end-date"
        name="end-date"
        defaultValue="2023-08-12T11:45"
        min="2018-07-00T00:00"
        max="2025-06-14T00:00"
      />
      <br />

      <button
        type="submit"
        form="reservationForm1"
        value="Submit"
        className="flex space-x-4 items-center border border-black text-black font-bold py-3 px-4 rounded"
      >
        Reserve
      </button>
    </form>

  </>);
}

