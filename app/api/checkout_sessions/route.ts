import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from "@/lib/prisma";

const { DateTime } = require('luxon');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
})

function calculateTotalCost(startDate: Date, endDate: Date, pricePerNight: number) {
    // Input validation
    if (!startDate || !endDate || !pricePerNight) {
        throw new Error('Invalid input');
    }

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (end <= start) {
        throw new Error('End date must be after start date');
    }

    const daysDiff = Math.round(end.diff(start, 'days').days);

    return daysDiff * pricePerNight;
}

// Remember this is just a helper. Always do the final calculations on the server.


function formatAmountForStripe(
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
    return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

async function getStripeAccountForHostId(hostId: string) {
    const stripeAccount = await prisma?.stripeAccount.findUnique({
        where: {
            userId: hostId
        }
    });

    if (!stripeAccount) {
        throw new Error('Stripe account not found for user');
    }

    return stripeAccount;
}

// ... [keep other helper functions unchanged, e.g. calculateTotalCost, formatAmountForStripe, getStripeAccountForHostId]

export async function POST(request: Request) {
    console.log('/checkout_sessions POST called!');

    const body = await request.json();

    console.log('body: ', JSON.stringify(body));

    const post = await prisma?.post.findUnique({
        where: {
            id: body.listingId,
        }
    });

    if (!post) {
        return NextResponse.error();  // Provide a meaningful response
    }

    console.log('post name: ', post.title);
    console.log('price: ' + post.price);
    console.log('hostId: ' + post.userId);

    // Create Stripe Payment Intent
    const paymentIntent = await createPaymentIntent(post, body);

    return NextResponse.json(paymentIntent);
}

async function createPaymentIntent(post: any, body: any) {
    const hostId = post.userId;
    const stripeAccount = await getStripeAccountForHostId(hostId);
    const accountId = stripeAccount.accountId;

    console.log('stripe account id: ', accountId);

    const { startDate, endDate } = body;

    const totalPrice = calculateTotalCost(startDate, endDate, post.price);

    console.log('total price: ', totalPrice);

    const product_description = post.title;
    const applicationFee = Math.round(totalPrice * .03); // 3% of totalPrice

    const params: Stripe.PaymentIntentCreateParams = {
        amount: formatAmountForStripe(totalPrice, 'usd'),
        currency: 'usd',
        payment_method_types: ['card'],
        description: product_description,
        application_fee_amount: applicationFee * 100,
        transfer_data: {
            destination: accountId,
        },
        metadata: {
            listingId: post.id,
            guests: 4,
        },
    };

    try {
        const intent = await stripe.paymentIntents.create(params);
        return intent;
    } catch (error: any) {
        console.error("Error creating Stripe payment intent:", error.message);
        throw new Error("Unable to create payment intent");
    }
}
