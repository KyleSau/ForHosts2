"use client"
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Stripe, loadStripe } from '@stripe/stripe-js'

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
const BookingComponent: React.FC<BookingProps> = ({ listing }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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
        <div>
            <div>
                Listing Id: {listing.id}
            </div>
            <div>
                <label>Start Date: </label>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                />
            </div>

            <div>
                <label>End Date: </label>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                />
            </div>

            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
}

export default BookingComponent;
