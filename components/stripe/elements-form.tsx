import React, { useState, FC } from 'react'

// import PrintObject from '../components/PrintObject'

// import { fetchPostJSON } from '../utils/api-helpers'

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { PaymentIntent } from '@stripe/stripe-js'

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

export function formatAmountFromStripe(
    amount: number,
    currency: string
): number {
    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    })
    const parts = numberFormat.formatToParts(amount)
    let zeroDecimalCurrency: boolean = true
    for (let part of parts) {
        if (part.type === 'decimal') {
            zeroDecimalCurrency = false
        }
    }
    return zeroDecimalCurrency ? amount : Math.round(amount / 100)
}

const ElementsForm: FC<{
    paymentIntent?: PaymentIntent | null
}> = ({ paymentIntent = null }) => {


    //const defaultAmout = formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency)

    const [input, setInput] = useState({
        cardholderName: '',
    })
    const [paymentType, setPaymentType] = useState('')
    const [payment, setPayment] = useState({ status: 'initial' })
    const [errorMessage, setErrorMessage] = useState('')
    const stripe = useStripe()
    const elements = useElements()

    const PaymentStatus = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
            case 'requires_payment_method':
            case 'requires_confirmation':
                return <h2>Processing...</h2>

            case 'requires_action':
                return <h2>Authenticating...</h2>

            case 'succeeded':
                return <h2>Payment Succeeded 🥳</h2>

            case 'error':
                return (
                    <>
                        <h2>Error 😭</h2>
                        <p className="error-message">{errorMessage}</p>
                    </>
                )

            default:
                return null
        }
    }

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value,
        })

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        // Abort if form isn't valid
        if (!e.currentTarget.reportValidity()) return
        if (!elements) return
        setPayment({ status: 'processing' })

        // Create a PaymentIntent with the specified amount.
        const response = await fetchPostJSON('/api/payment_intents', {
            payment_intent_id: paymentIntent?.id,
        })
        setPayment(response)

        if (response.statusCode === 500) {
            setPayment({ status: 'error' })
            setErrorMessage(response.message)
            return
        }

        // Use your card Element with other Stripe.js APIs
        const { error } = await stripe!.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/donate-with-elements',
                payment_method_data: {
                    billing_details: {
                        name: input.cardholderName,
                    },
                },
            },
        })

        if (error) {
            setPayment({ status: 'error' })
            setErrorMessage(error.message ?? 'An unknown error occurred')
        } else if (paymentIntent) {
            setPayment(paymentIntent)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset className="elements-style">
                    <legend>Your payment details:</legend>
                    {paymentType === 'card' ? (
                        <input
                            placeholder="Cardholder name"
                            className="elements-style border border-black"
                            type="Text"
                            name="cardholderName"
                            onChange={handleInputChange}
                            required
                        />
                    ) : null}
                    <div className="FormRow elements-style">
                        <PaymentElement
                            onChange={(e) => {
                                setPaymentType(e.value.type)
                            }}
                        />
                    </div>
                </fieldset>
                <button
                    className="elements-style-background"
                    type="submit"
                    disabled={
                        !['initial', 'succeeded', 'error'].includes(payment.status) ||
                        !stripe
                    }
                >
                    Pay
                </button>
            </form>
            <PaymentStatus status={payment.status} />
            {/* <PrintObject content={payment} /> */}
        </>
    )
}

export default ElementsForm