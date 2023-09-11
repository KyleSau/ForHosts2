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

export async function POST(request: Request) {
    console.log('/checkout_sessions POST called!');

    const body = await request.json()

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

    // Create Stripe Checkout Session
    const checkoutSession = await createCheckoutSession(request, post, body); // Pass parsed body here

    return NextResponse.json(checkoutSession);
}

async function createCheckoutSession(request: any, post: any, body: any) { // Accept parsed body as parameter
    const hostId = post.userId;

    const stripeAccount = await getStripeAccountForHostId(hostId);
    const accountId = stripeAccount.accountId;

    console.log('stripe account id: ', accountId);

    const { startDate, endDate } = body; // Use the body directly

    const totalPrice = calculateTotalCost(startDate, endDate, post.price);

    console.log('total price: ', totalPrice);

    const product_description = post.title;

    const applicationFee = Math.round(totalPrice * .03); // 3% of totalPrice

    const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product_description,
                    },
                    unit_amount: formatAmountForStripe(totalPrice, 'usd'),
                },
            },
        ],
        success_url: `${request.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}/donate-with-checkout`,
        payment_intent_data: {
            application_fee_amount: applicationFee * 100, // This is the fee you want to take
            transfer_data: {
                destination: accountId, // This should be the ID of the connected account
            },
            // metadata: {
            //     listingId: post.id,
            //     guests: 4,
            //     // ... you can add more key-value pairs as needed
            // },
        },
        metadata: {
            listingId: post.id,
            guests: 4,
            // ... you can add more key-value pairs as needed
        },
    };

    try {
        const session = await stripe.checkout.sessions.create(params);
        return session;
    } catch (error: any) {
        console.error("Error creating Stripe session:", error.message);
        return Response.error;
    }
}
