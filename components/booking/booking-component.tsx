'use client'
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from "date-fns"
import { DateRange } from 'react-day-picker';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import calculateTotalCost from "@/lib/utils/payment-helper"
import { cn } from "@/lib/utils"
import { Elements } from '@stripe/react-stripe-js';
import CardInput from './card-element';
import { useRouter } from 'next/navigation'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export async function fetchPostJSON(url: string, data?: {}) {
    try {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application-x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
        })
        return await response.json() // parses JSON response into native JavaScript objects
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw err
    }
}

type BookingProps = {
    listing: any;
}

const BookingComponent: React.FC<BookingProps> = ({ listing, className }: any) => {

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined//addDays(new Date(), 20),
    })
    const router = useRouter()
    const handleCheckout = () => {
        // Construct the URL with search query parameters
        const url = new URL('/checkout', window.location.origin);
        url.searchParams.append('id', listing.id);
        if (date?.from) {
            url.searchParams.append('startDate', date.from?.toISOString());
        }
        if (date?.to) {
            url.searchParams.append('endDate', date.to?.toISOString());
        }

        // Guests
        url.searchParams.append('adults', adults.toString());
        url.searchParams.append('children', children.toString());
        url.searchParams.append('infants', infants.toString());
        url.searchParams.append('pets', pets.toString());

        router.push(url.toString());
    }


    return (
        <div className="p-5 bg-white text-slate-600 rounded-sm items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-slate-300 m-auto fixed bottom-0 left-0 right-0 md:relative z-30">
            {/* {stripeInstance && (
                <Elements stripe={stripeInstance}>
                    <CardInput />
                </Elements>
            )} */}
            <div className="mb-5">
                <p className="text-lg text-bold">${listing.price} Per Night</p>
            </div>
            <div className={cn("grid", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full text-center font-normal bg-gray-100 border-[1px] border-gray-200",
                                !date && "text-muted-foreground"
                            )}
                        >

                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} | {" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger className="bg-gray-100 rounded-b-sm p-2 w-full border-[1px] border-gray-200">Guests</PopoverTrigger>
                    <PopoverContent>
                        <div className="m-2">
                            <label>Adults</label>
                            <Input
                                type="number"
                                value={adults}
                                onChange={e => setAdults(Number(e.target.value))}
                                min={1}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Children</label>
                            <Input
                                type="number"
                                value={children}
                                onChange={e => setChildren(Number(e.target.value))}
                                min={0}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Infants</label>
                            <Input
                                type="number"
                                value={infants}
                                onChange={e => setInfants(Number(e.target.value))}
                                min={0}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Pets</label>
                            <Input
                                type="number"
                                value={pets}
                                onChange={e => setPets(Number(e.target.value))}
                                min={0}
                                max={listing.Pets}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <br />
            <div className="w-full grid-cols-2">
                <Popover>
                    <div className="">
                        {date?.to ? (
                            <p className="underline">
                                <PopoverTrigger className="underline">
                                    ${listing.price} X {calculateTotalCost(date.from!, date.to!, listing.price).nights}
                                </PopoverTrigger>
                                <span className="float-right">
                                    ${calculateTotalCost(date.from!, date.to!, listing.price).price}
                                </span>
                            </p>
                        ) : null}

                    </div>
                    <PopoverContent>Display individual dates selected in a list</PopoverContent>
                </Popover>
                <Popover>
                    <div className="">
                        <p className="underline"><PopoverTrigger className="underline">Cleaning Fee </PopoverTrigger>
                            <span className="float-right">$XXX.XX</span>
                        </p>
                    </div>
                    <PopoverContent>This fee covers the costs of cleaning and turning over the space.</PopoverContent>
                </Popover>
                <Popover>
                    <div className="">
                        <p className="underline"><PopoverTrigger className="underline">Service Fee</PopoverTrigger>
                            <span className="float-right">$XX.XX</span>
                        </p>
                    </div>
                    <PopoverContent>This fee covers the platform provider (3%)</PopoverContent>
                </Popover>
                <hr className="border-slate-300 m w-full mt-5 mb-2" />
                <Popover>
                    <div className="">
                        <p className="underline"><PopoverTrigger className="underline">Total before taxes</PopoverTrigger>
                            <span className="float-right">$XXXX.XX</span>
                        </p>
                    </div>
                    <PopoverContent>Total costs and a breakdown.</PopoverContent>
                </Popover>
                <br />
            </div>
            <button className="p-2 rounded-sm justify-center w-full text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={handleCheckout}>Book</button>
        </div>
    );
}

export default BookingComponent;


// const handleCheckout = async () => {
//     const response = await fetchPostJSON('/api/checkout_sessions', {
//         startDate: date?.from,
//         endDate: date?.to,
//         listingId: listing.id
//     })

//     if (response.statusCode === 500) {
//         console.error(response.message)
//         return;
//     }

//     const stripe = await getStripe()
//     if (stripe) {
//         const { error, paymentIntent } = await stripe.confirmCardPayment(response.client_secret, {
//             payment_method: 'pm_card_visa', // TODO: You'll have to integrate Stripe Elements or another method to get the Payment Method
//         });

//         if (error) {
//             console.error("Payment failed:", error);
//         } else if (paymentIntent && paymentIntent.status === "succeeded") {
//             console.log("Payment successful!");
//         }
//     }


// }
