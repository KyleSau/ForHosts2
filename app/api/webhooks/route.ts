import { NextResponse } from 'next/server'

import Stripe from 'stripe'
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
})

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.update({
        where: {
            stripePaymentIntentId: paymentIntent.id
        },
        data: {
            status: 'SUCCEEDED'
        }
    });
    const metadata = paymentIntent.metadata;
    const instantBooking = true;

    await prisma.reservation.create({
        data: {
            postId: metadata.listingId,
            startDate: metadata.startDate,
            endDate: metadata.endDate,
            adults: parseInt(metadata.adults, 10),
            children: parseInt(metadata.children, 10),
            infants: parseInt(metadata.infants, 10),
            pets: parseInt(metadata.pets, 10),
            status: instantBooking ? 'CONFIRMED' : 'CANCELLED'
        }
    });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.update({
        where: {
            stripePaymentIntentId: paymentIntent.id
        },
        data: {
            status: 'FAILED'
        }
    });
}


const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {

    const text = await request.text();
    const stripeSignature = request.headers.get("Stripe-Signature")!;

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(text, stripeSignature, webhookSecret)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        if (err! instanceof Error) console.log(err)
        console.log(`❌ Error message: ${errorMessage}`)
        return NextResponse.error();
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentSuccess(paymentIntent);
            console.log('✅ Success:', event.id)
            console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
            break;
        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentFailure(failedPaymentIntent);
            break;

        default:
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true });
}