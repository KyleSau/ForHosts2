import { NextRequest, NextResponse } from 'next/server';
import createError from '@/components/stripe/createError';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = await stripe.oauth
        .token({
            grant_type: 'authorization_code',
            code: body?.code,
        })
        .catch((err: unknown) => {
            throw createError(400, `${(err as any)?.message}`);
        });

    const account: any = await stripe.accounts
        ?.retrieve(result?.stripe_user_id)
        ?.catch((err: unknown) => {
            throw createError(400, `${(err as any)?.message}`);
        });

    const accountAnalysis = {
        hasConnectedAccount: !!account?.id,
        accountId: account?.id,
        hasCompletedProcess: account?.details_submitted,
        isValid: account?.charges_enabled && account?.payouts_enabled,
        displayName:
            account?.settings?.dashboard?.display_name ||
            account?.display_name ||
            null,
        country: account?.country,
        currency: account?.default_currency,
    };

    const shouldAllowUnlink =
        accountAnalysis?.hasConnectedAccount &&
        (!accountAnalysis?.isValid ||
            !accountAnalysis?.hasCompletedProcess ||
            !accountAnalysis?.displayName);

    console.log('account id: ' + account?.id);
    console.log('account email: ' + account?.email);
    console.log('account display name: ' + account?.display_name);
    console.log('account verification: ' + account?.verification);

    console.log('oauth access_token: ' + result.access_token);
    console.log('oauth stripe_publishable_key: ' + result.stripe_publishable_key);
    console.log('oauth refresh_token: ' + result.refresh_token);
    // return NextResponse.json({
    //     account,
    //     oauth: result,
    //     accountAnalysis,
    //     shouldAllowUnlink,
    // });
    return new Response('idk', {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}

//acct_1NikX0Ib3svAyB45