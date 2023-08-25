import { NextApiRequest, NextApiResponse } from "next";
import createError from "@/components/stripe/createError";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Set CORS headers
    // res.setHeader('Access-Control-Allow-Origin', '*'); // You can set this to your specific origin if you want, but '*' allows any origin
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', 'http://dashboard.localhost:3000');

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    if (req.method === "POST") {
        const body = await req.body;
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


            const ads =
            {
                account,
                oauth: result,
                accountAnalysis,
                shouldAllowUnlink
            };
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            // ... your existing logic

            res.status(200).json({
                account,
                oauth: result,
                accountAnalysis,
                shouldAllowUnlink
            });


        } catch (err: any) {
            console.log('oh no');
            res.status(400).json({ message: err.message });
        }
    } else {
        // Handle methods other than POST (if needed)
        console.log('hues');
        res.status(405).json({ message: 'omg' }); // Method Not Allowed
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
