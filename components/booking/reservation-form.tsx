"use client";
import React, { useState } from 'react';
import { toast } from "sonner";
import va from "@vercel/analytics";
import { createReservation } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function ReservationForm({ post }: { post: any }) {
  const router = useRouter();

  // Delegate to Stripe checkout.
  const handleFinalizeReservation = async (data: FormData) => {

    // This will be invoked by payment intent webhook.
    data.append("postId", post.id);
    await createReservation(data, new Date()).then((res: any) => {
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

    <form
      action={(data: FormData) => handleFinalizeReservation(data)}
      id="reservationForm1"
      className="w-full rounded-xl bg-white text-black dark:text-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700 flex flex-col items-center p-5"
    >
      {/* Date Ranger Picker */}
      <div className="flex-col items-center grid grid-cols-4">
        <div className="grid col-span-4 mb-5">
          <p className="text-s col-span-2 col-start-1">${post.price} per night</p>
          <p className="text-s text-center col-span-2 col-start-3">Minium stay: {post.minimumStay} days</p>
        </div>
        <div className="grid col-span-2 col-start-2">
          <p className="text-xs text-left"></p>
        </div>
        <div className="grid col-span-2">
          <label htmlFor="start-date" className="bg-white text-black dark:bg-white dark:text-black">Check-In </label>
          <input
            type="datetime-local"
            id="start-date"
            name="start-date"
            defaultValue="2023-07-03T19:30"
            min="2023-07-00T00:00"
            max="2025-06-14T00:00"
            className="bg-gray-100 rounded-md border-none p-3 focus:ring-0"
          />
        </div>
        <div className="grid col-span-2">
          <label htmlFor="end-date" className="bg-white text-black dark:bg-white dark:text-black">Checkout </label>
          <input
            type="datetime-local"
            id="end-date"
            name="end-date"
            defaultValue="2023-08-12T11:45"
            min="2018-07-00T00:00"
            max="2025-06-14T00:00"
            className="bg-gray-100 rounded-md border-none p-3 ml-1 focus:ring-0"
          />
        </div>

        <div className="grid col-span-2 mt-5">
          <div className='flex justify-left items-center'>
            <label htmlFor="guests" className="bg-white text-black dark:bg-white dark:text-black text-xs">Adults Age 13+</label>
            <input type="number" id="guests" name="guests" defaultValue="1" min="1" max="5" className="bg-gray-100 rounded-md p-3 border-none focus:ring-0 w-full" />
            <label htmlFor="guests" className="bg-white text-black dark:bg-white dark:text-black text-xs">Children Age 0-12</label>
            <input type="number" id="guests" name="guests" defaultValue="0" min="1" max="5" className="bg-gray-100 rounded-md p-3 border-none focus:ring-0 w-full" />
          </div>
        </div>

        <div className="grid col-span-4">
          <button
            type="submit"
            form="reservationForm1"
            value="Submit"
            className="flex justify-center border border-sky-100 text-black font-bold p-3 rounded-md bg-sky-400 mt-5"
          >
            Reserve
          </button>
          <div className="grid col-span-1 mt-5">
            <p className="text-s">${post.price} Total After Taxes</p>
          </div>
        </div>
      </div >
    </form >

  </>);
}

