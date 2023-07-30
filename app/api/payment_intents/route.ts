import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/lib/config'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { formatAmountForStripe } from '@/lib/utils/stripe-helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
})

export async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return new Response('Method Not Allowed', { status: 405 })
    }
    const {
        amount,
        payment_intent_id,
    }: { amount: number; payment_intent_id?: string } = req.body
    // Validate the amount that was passed from the client.
    // console.log('amount', amount);
    // if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
    //     return new Response(JSON.stringify({ statusCode: 400, message: 'Invalid amounte.' }), { status: 500 })
    // }
    if (payment_intent_id) {
        try {
            const current_intent = await stripe.paymentIntents.retrieve(
                payment_intent_id
            )
            // If PaymentIntent has been created, just update the amount.
            if (current_intent) {
                const updated_intent = await stripe.paymentIntents.update(
                    payment_intent_id,
                    {
                        amount: formatAmountForStripe(420, CURRENCY),
                    }
                )
                return new Response(JSON.stringify(updated_intent), { status: 200 })
            }
        } catch (e) {
            if ((e as any).code !== 'resource_missing') {
                const errorMessage =
                    e instanceof Error ? e.message : 'Internal server error'
                return new Response(JSON.stringify({ statusCode: 500, message: errorMessage }), { status: 500 })
            }
        }
    }
    try {
        // Create PaymentIntent from body params.
        const params: Stripe.PaymentIntentCreateParams = {
            amount: formatAmountForStripe(1000, CURRENCY), // amount
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
}
