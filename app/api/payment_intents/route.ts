import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from "@/lib/prisma";
import { DateTime } from 'luxon';

interface PaymentIntentRequest {
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
    pets: number;
    price: number;
    title: string;
    postId: string;
    userId: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

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

function calculateTotalCost(startDate: string, endDate: string, pricePerNight: number) {
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

// ... [Keep helper functions unchanged]
async function checkForConflictingPayments(postId: string, startDate: string, endDate: string): Promise<boolean> {
    const luxonStart = DateTime.fromISO(startDate);
    const luxonEnd = DateTime.fromISO(endDate);

    const conflictingPayments = await prisma.stripePayment.findMany({
        where: {
            postId,
            startDate: { lte: luxonEnd.toJSDate() }, // Convert DateTime back to JavaScript Date for database queries
            endDate: { gte: luxonStart.toJSDate() },  // Convert DateTime back to JavaScript Date for database queries
            status: { in: ['PROCESSING', 'SUCCEEDED'] }
        }
    });
    return conflictingPayments.length > 0;
}

async function createStripePaymentIntent(params: Stripe.PaymentIntentCreateParams): Promise<Stripe.PaymentIntent> {
    try {
        return await stripe.paymentIntents.create(params);
    } catch (error: any) {
        console.error("Error creating Stripe payment intent:", error.message);
        throw new Error("Unable to create payment intent");
    }
}

async function createPaymentIntent(requestData: PaymentIntentRequest): Promise<Stripe.PaymentIntent> {
    const { startDate, endDate, adults, children, infants, pets, price, title, postId, userId } = requestData;

    if (price <= 0) throw new Error('Price must be greater than 0');

    const stripeAccount = await getStripeAccountForHostId(userId!);
    const totalPrice = calculateTotalCost(startDate, endDate, price);
    const applicationFee = Math.round(totalPrice * 0.03); // 3% of totalPrice

    if (await checkForConflictingPayments(postId, startDate, endDate)) {
        throw new Error('Conflicting reservation dates detected. Please choose different dates.');
    }

    const params: Stripe.PaymentIntentCreateParams = {
        amount: formatAmountForStripe(totalPrice, 'usd'),
        currency: 'usd',
        payment_method_types: ['card'],
        description: title,
        application_fee_amount: applicationFee * 100,
        transfer_data: { destination: stripeAccount.accountId },
        metadata: { listingId: postId, startDate, endDate, adults, children, infants, pets },
    };

    return createStripePaymentIntent(params);
}

async function createStripePayment(current_intent: Stripe.PaymentIntent) {
    try {
        const payment = await prisma.stripePayment.create({
            data: {
                intentId: current_intent.id,
                postId: current_intent.metadata.listingId,
                startDate: current_intent.metadata.startDate,
                endDate: current_intent.metadata.endDate,
                status: 'PROCESSING',
                totalPrice: current_intent.amount,
            }
        });
        return current_intent;
    } catch (e) {
        console.log('prisma payment create error');
        throw new Error('Failed to create payment in database');
    }
}

async function handleExistingPaymentIntent(body: any): Promise<NextResponse | null> {
    if (!body.payment_intent_id) {
        return null;
    }
    try {
        const current_intent = await stripe.paymentIntents.retrieve(body.payment_intent_id);
        if (current_intent) {
            await createStripePayment(current_intent);
            return NextResponse.json(current_intent);
        }
    } catch (e) {
        if ((e as any).code !== 'resource_missing') {
            console.log('Error with payment intent retrieval:', e);
            return new NextResponse(null, { status: 500 });
        }
    }
    return null;
}

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY not set in environment variables.');
    }

    console.log('/payment_intents POST called!');

    const body = await request.json();

    // If there's an existing payment intent, handle it.
    const existingPaymentResponse = await handleExistingPaymentIntent(body);
    if (existingPaymentResponse) {
        return existingPaymentResponse;
    }

    // If not, proceed to create a new one.
    const post = await prisma.post.findUnique({
        where: { id: body.listingId }, include: {
            site: true,
            location: true,
            pricing: true,
            availability: true,
            propertyRules: true,
            propertyDetails: true,
            afterBookingInfo: true,
        },
    });

    if (!post) {
        return NextResponse.error();  // Provide a meaningful response
    }

    const paymentIntentRequest: PaymentIntentRequest = {
        startDate: body.startDate,
        endDate: body.endDate,
        adults: body.adults,
        children: body.children,
        infants: body.infants,
        pets: body.pets,
        price: post.pricing?.price!,
        title: post.title,
        postId: post.id,
        userId: post.userId || null
    };


    return NextResponse.json(await createPaymentIntent(paymentIntentRequest));
}

