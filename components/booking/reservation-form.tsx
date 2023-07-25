"use client";
import React, { useState } from 'react';
import { toast } from "sonner";
import va from "@vercel/analytics";
import { createReservation } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { getPostData } from "@/lib/fetchers";

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
      <div className="flex-col items-center grid grid-cols-2">
        <div className="grid col-span-1 mb-5">
          <p className="text-s">${post.price}</p>
          <p className="text-xs">per night</p>
        </div>
        <div className="grid col-span-1 mb-5">
          <p className="text-xs">Reviews</p>
        </div>
        <div className="grid col-span-1 col-start-1">
          <p className="text-xs text-left">Minium Stay: {post.minimumStay}</p>
        </div>
        <div className="grid col-span-1 col-start-2">
          <p className="text-xs text-left"></p>
        </div>
        <div className="grid col-span-1">
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
        <div className="grid col-span-1">
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

        <div className="grid col-span-2">
          <div className='flex justify-center items-center'>
            <div className='grid relative'>
              <button className="bg-sky-400 p-2 font-bold text-black rounded-md peer focus:bg-sky-400 mt-5">Guests</button>
              <div className='w-80 absolute top-5 z-10 after:content-[""] after:inline-block after:absolute after:top-0 after:bg-white/40 after:w-full after:h-full after:-z-20 after:blur-[2px] after:rounded-lgpeer-focus:top-12 peer-focus:opacity-100 peer-focus:visible transition-all duration-300 invisible  opacity-0 '>
                <ul className='py-6 px-3 flex flex-col gap-3 bg-gray-100 md:border-stone-200 rounded-xl'>
                  <li className='p-3 rounded-md text-black'>Adults<input
                    type="number"
                    id="guests"
                    name="guests"
                    defaultValue="1"
                    min="1"
                    max="5"    //{post.maxGuests}
                    className="p-3 border-none focus:ring-0 text-black"
                  /></li>
                  <li className='text-black'>Eat an apple a day</li>
                  <li className='text-black'>Eat an apple a day</li>
                  <li className='text-black'>Eat an apple a day</li>
                  <li className='text-black'>Eat an apple a day</li>
                </ul>
              </div>
            </div>
          </div>
          {/* <input
            type="number"
            id="guests"
            name="guests"
            defaultValue="1"
            min="1"
            max="5"    //{post.maxGuests}
            className="bg-gray-100 rounded-md p-3 border-none focus:ring-0"
          />
          <p className="text-xs text-left">Maximum Guests: {post.maxGuests}</p> */}
        </div>

        <div className="grid col-span-2">
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

