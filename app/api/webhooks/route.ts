import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'micro-cors'
import Stripe from 'stripe'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
})

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false,
    },
}

const cors = Cors({
    allowMethods: ['POST', 'HEAD'],
})

const getRawBody = (req: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk: any) => {
            data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', (error: any) => reject(error));
    });
};



export async function POST(req: NextApiRequest) {

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
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