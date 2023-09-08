import { NextResponse } from 'next/server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
})

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {

    const text = await request.text();
    const stripeSignature = request.headers.get("Stripe-Signature")!;

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(text, stripeSignature, webhookSecret)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        // On error, log and return the error message.
        if (err! instanceof Error) console.log(err)
        console.log(`❌ Error message: ${errorMessage}`)
        return NextResponse.error();
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id)

    // Cast event data to Stripe object.
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(
            `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
        )
    } else if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge
        console.log(`💵 Charge id: ${charge.id}`)
    } else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true });
}