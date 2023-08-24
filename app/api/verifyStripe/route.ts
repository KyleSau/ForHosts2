import { NextResponse } from "next/server";
import createError from '@/lib/utils/createError';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(
    req: Request,
    _params: any,
): Promise<NextResponse> {
    // const data = await req.json();
    // console.log('verifyStripe data: ', data);
    const body = await req.json();
    console.log('verifyStripe data: ', body);
    try {
        const result = await stripe.oauth
            .token({
                grant_type: 'authorization_code',
                code: body?.code,
            });

        const account = await stripe.accounts.retrieve(result?.stripe_user_id);

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

        return NextResponse.json({
            account,
            oauth: result,
            accountAnalysis,
            shouldAllowUnlink
        });

    } catch (err: any) {
        throw createError(400, `${err?.message}`);
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
