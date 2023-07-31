// import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/lib/config'
// import { NextApiRequest, NextApiResponse } from 'next'

// import Stripe from 'stripe'
// import { formatAmountForStripe } from '@/lib/utils/stripe-helpers'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     // https://github.com/stripe/stripe-node#configuration
//     apiVersion: '2022-11-15',
// })

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === 'POST') {
//         const amount: number = req.body.amount
//         try {
//             // Validate the amount that was passed from the client.
//             if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
//                 throw new Error('Invalid amount.')
//             }
//             // Create Checkout Sessions from body params.
//             const params: Stripe.Checkout.SessionCreateParams = {
//                 submit_type: 'donate',
//                 payment_method_types: ['card'],
//                 mode: 'payment',
//                 line_items: [
//                     {
//                         quantity: 1,
//                         price_data: {
//                             currency: CURRENCY,
//                             product_data: {
//                                 name: 'Custom amount donation',
//                             },
//                             unit_amount: formatAmountForStripe(amount, CURRENCY),
//                         },
//                     },
//                 ],

//                 success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
//                 cancel_url: `${req.headers.origin}/donate-with-checkout`,
//             }
//             const checkoutSession: Stripe.Checkout.Session =
//                 await stripe.checkout.sessions.create(params)

//             res.status(200).json(checkoutSession)
//         } catch (err) {
//             const errorMessage =
//                 err instanceof Error ? err.message : 'Internal server error'
//             res.status(500).json({ statusCode: 500, message: errorMessage })
//         }
//     } else {
//         res.setHeader('Allow', 'POST')
//         res.status(405).end('Method Not Allowed')
//     }
// }

import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/lib/config'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { formatAmountForStripe } from '@/lib/utils/stripe-helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
})

export async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { amount }: { amount: number } = req.body

        try {
            // Validate the amount that was passed from the client.
            if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
                throw new Error('Invalid amount.')
            }

            // Create PaymentIntent from body params.
            const params: Stripe.PaymentIntentCreateParams = {
                amount: formatAmountForStripe(amount, CURRENCY), // amount
                currency: CURRENCY,
                description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
                automatic_payment_methods: {
                    enabled: true,
                },
            }

            const payment_intent: Stripe.PaymentIntent =
                await stripe.paymentIntents.create(params)

            return new Response(JSON.stringify(payment_intent), { status: 200 })
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Internal server error'
            return new Response(JSON.stringify({ statusCode: 500, message: errorMessage }), { status: 500 })
        }
    } else {
        res.setHeader('Allow', 'POST')
        return new Response('Method Not Allowed', { status: 405 })
    }
}
