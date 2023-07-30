"use client"
import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentIntent } from '@stripe/stripe-js'
import getStripe from '@/lib/utils/get-stripejs'
import { fetchPostJSON } from '@/lib/utils/api-helpers'
import Layout from '@/components/stripe/Layout'
import * as config from '@/lib/config'
import ElementsForm from '@/components/stripe/ElementsForm'

const DonatePage: NextPage = () => {
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)

    // const testUrl = 'http://localhost:3000/api/payment_intents' // the problem was possibly the subdomain in front of the url.
    useEffect(() => {
        fetchPostJSON('/api/payment_intents', {
            amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
        }).then((data) => {
            setPaymentIntent(data)
        })
    }, [setPaymentIntent])
    return (
        <Layout title="Donate with Elements | Next.js + TypeScript Example">
            <div className="page-container">
                <h1>Donate with Elements</h1>
                <p>Donate to our project 💖</p>
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
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </Layout>
    )
}

export default DonatePage
