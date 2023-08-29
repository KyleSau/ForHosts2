import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@/lib/auth";
import { unlinkStripeAccount } from '@/lib/stripe-connect';

export async function POST(req: NextRequest) {
    // const body = await req.json();
    const session = await getSession();

    if (!session) {
        return new Response('BAD', { status: 400 });
    }

    console.log('session user id: ' + session?.user.id);
    console.log('yee we finna unlink him bruh');

    const unlink = await unlinkStripeAccount(session);

    // return new Response('OK', { status: 200 });
    return new Response(JSON.stringify({ status: 'OK' }), { status: 200 });


}