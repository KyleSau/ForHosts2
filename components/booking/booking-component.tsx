"use client"
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Stripe, loadStripe } from '@stripe/stripe-js'
import { addDays, format } from "date-fns"
import { DateRange } from 'react-day-picker';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

let stripePromise: Promise<Stripe | null>
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    }
    return stripePromise
}

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
                // 'Content-Type': 'application/x-www-form-urlencoded',
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

// get listingId from prop
const BookingComponent: React.FC<BookingProps> = ({ listing, className }: any) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })
    const handleCheckout = async () => {
        const response = await fetchPostJSON('/api/checkout_sessions', {
            startDate: startDate,
            endDate: endDate,
            listingId: listing.id
        })

        if (response.statusCode === 500) {
            console.error(response.message)
            return;
        }

        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: response.id, // response.sessionId
        })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message)

    }

    return (
        <div className="p-5 bg-white text-slate-600 rounded-sm items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] min-w-[275px] border border-slate-300 max-w-[375px] m-2">
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
                                className=""
                                defaultValue={1}
                                min={1}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Children</label>
                            <Input
                                type="number"
                                className=""
                                defaultValue={0}
                                min={0}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Infants</label>
                            <Input
                                type="number"
                                className=""
                                defaultValue={0}
                                min={0}
                                max={listing.maxGuests}
                            />
                        </div>
                        <div className="m-2">
                            <label>Pets</label>
                            <Input
                                type="number"
                                className=""
                                defaultValue={0}
                                min={0}
                                max={listing.Pets}
                            />
                            {/* Pets Allowed? */}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <br />
            {/* <div>
                Display Date Range Selected: {date?.from && date?.to ? (
                    `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                ) : (
                    "Pick a date"
                )}
            </div> */}
            <div className="w-full grid-cols-2">
                <Popover>
                    <div className="">
                        <p className="underline"><PopoverTrigger className="underline">${listing.price} X Total Days </PopoverTrigger>
                            <span className="float-right">$XXXX.XX</span>
                        </p>
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
                    <PopoverContent>This fee covers the platform provider (2%)</PopoverContent>
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
        </div >
    );
}

export default BookingComponent;
