"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import ElementsForm from '@/components/stripe/elements-form';
import Layout from '@/components/booking/layout'

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    return stripePromise;
};

export async function fetchPostJSON(url: string, data?: {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data || {}),
        });
        return await response.json();
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw err;
    }
}

export default function CheckoutForm() {
    const searchParams = useSearchParams();

    const listingId = searchParams.get('id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const infants = searchParams.get('infants');
    const pets = searchParams.get('pets');

    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Added line

    useEffect(() => {
        fetchPostJSON('/api/payment_intents', {
            listingId,
            startDate,
            endDate,
            adults,
            children,
            infants,
            pets

        }).then((data) => {
            setPaymentIntent(data);
        }).finally(() => {
            setIsLoading(false); // Added line
        });
    }, [setPaymentIntent, listingId, adults, startDate, endDate, children, pets, infants]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="flex items-center space-x-4">
                    <svg aria-hidden="true" className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="text-2xl text-gray-600 dark:text-gray-300">Loading checkout...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* <div>Id: {listingId}</div>
            <div>Start Date: {startDate}</div>
            <div>End Date: {endDate}</div>
            <div>Adults: {adults}</div>
            <div>Children: {children}</div>
            <div>Infants: {infants}</div>
            <div>Pets: {pets}</div> */}
            <Layout title="Donate with Elements | Next.js + TypeScript Example">
                <div className="pb-16 max-w-screen-xl mx-auto">
                    {paymentIntent && paymentIntent.client_secret ? (
                        <Elements

                            stripe={getStripe()}
                            options={{
                                appearance: {
                                    variables: {
                                        colorIcon: '#6772e5',
                                        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                    },
                                },
                                clientSecret: paymentIntent.client_secret,
                            }}
                        >
                            <ElementsForm paymentIntent={paymentIntent} />
                        </Elements>
                    ) : null}
                </div>
            </Layout >
        </div >
    );
}
