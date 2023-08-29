import prisma from "@/lib/prisma";
import createError from '@/components/stripe-connect/createError';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// change this function to use 
export const linkStripeAccount = async (code: string, session: any) => {
    if (!session) {
        throw new Error('Session is undefined');
    }
    const userId = session.user.id;

    const oauth = await stripe.oauth
        .token({
            grant_type: 'authorization_code',
            code: code,
        })
        .catch((err: unknown) => {
            throw createError(400, `${(err as any)?.message}`);
        });

    console.log('oauth stripe user id: ' + oauth?.stripe_user_id);

    const account: any = await stripe.accounts
        ?.retrieve(oauth?.stripe_user_id)
        ?.catch((err: unknown) => {
            throw createError(400, `${(err as any)?.message}`);
        });

    console.log('account id: ' + account.id);

    const name =
        account?.settings?.dashboard?.display_name ||
        account?.display_name ||
        null;

    await prisma.stripeAccount.create({
        data: {
            accountId: account?.id,
            accountEmail: account?.email,
            oauthAccessToken: oauth.access_token,
            oauthStripePublishableKey: oauth.stripe_publishable_key,
            oauthRefreshToken: oauth.refresh_token,
            userId: userId
        }
    });

    const accountAnalysis = {
        hasConnectedAccount: !!account?.id,
        accountId: account?.id,
        hasCompletedProcess: account?.details_submitted,
        isValid: account?.charges_enabled && account?.payouts_enabled,
        displayName: name
    };

    const shouldAllowUnlink = accountAnalysis.hasConnectedAccount && (!accountAnalysis.isValid || !accountAnalysis.hasCompletedProcess || !accountAnalysis.displayName);

    const data = {
        auth: account,
        unlinkable: shouldAllowUnlink,
        name: name
    };
    return data;
}

export const unlinkStripeAccount = async (session: any) => {
    if (!session) {
        throw new Error('Invalid Session!');
    }

    const userId = session.user.id;

    // Delete the stripe account link for this user
    await prisma.stripeAccount.delete({
        where: { userId: userId },
    });
};


export const getStripeAccount = async (session: any) => {
    if (!session) throw new Error('Invalid Session!');

    const userId = session.user.id;

    let existingStripeAccount;
    try {
        existingStripeAccount = await prisma.stripeAccount.findUnique({
            where: { userId: userId },
        });
    } catch (dbError: any) {
        throw new Error(`Database Error: ${dbError.message}`);
    }
    return existingStripeAccount;

}

export const getStripeAuthorization = async (stripeAccount: any) => {
    const accountId = stripeAccount.accountId;

    let stripeAuthorization;
    try {
        stripeAuthorization = await stripe.accounts.retrieve(accountId);
    } catch (stripeError: any) {
        throw new Error(`Stripe Error: ${stripeError.message}`);
    }

    const name =
        stripeAuthorization?.settings?.dashboard?.display_name ||
        stripeAuthorization?.display_name ||
        null;


    console.log('accountId ' + accountId);

    const account = await stripe.accounts.retrieve(accountId);

    console.log('account: ' + account);

    const accountAnalysis = {
        hasConnectedAccount: !!account?.id,
        accountId: account?.id,
        hasCompletedProcess: account?.details_submitted,
        isValid: account?.charges_enabled && account?.payouts_enabled,
        displayName: name
    };

    console.log(account?.details_submitted + ' ' + account?.charges_enabled + ' ' + account?.payouts_enabled);

    const shouldAllowUnlink = accountAnalysis.hasConnectedAccount && (!accountAnalysis.isValid || !accountAnalysis.hasCompletedProcess || !accountAnalysis.displayName);
    console.log('shouldAllowUnlink ' + shouldAllowUnlink);

    return {
        account: stripeAccount,
        auth: stripeAuthorization,
        unlinkable: shouldAllowUnlink,
        name: name
    }
}

// export const getLinkedStripeDetails = async (session: any) => {
//     if (!session) throw new Error('Invalid Session!');

//     const userId = session.user.id;

//     let existingStripeAccount;
//     try {
//         existingStripeAccount = await prisma.stripeAccount.findUnique({
//             where: { userId: userId },
//         });
//     } catch (dbError: any) {
//         throw new Error(`Database Error: ${dbError.message}`);
//     }



//     if (!existingStripeAccount || !existingStripeAccount.accountId/* || typeof existingStripeAccount.id !== 'string'*/) {
//         // throw new Error('Invalid or missing Stripe account ID.');
//         console.log('undefined');
//         return undefined;
//     }

//     console.log('id: ' + existingStripeAccount.accountId);

//     let stripe_account;
//     try {
//         // If you're just passing the ID, it should look like this:
//         stripe_account = await stripe.accounts.retrieve(existingStripeAccount.accountId);

//         // If you're passing additional options, it should look like this:
//         // account = await stripe.accounts.retrieve(existingStripeAccount.id, { YOUR_OPTIONS_HERE });
//     } catch (stripeError: any) {
//         throw new Error(`Stripe Error: ${stripeError.message}`);
//     }

//     console.log('existingStripeAccount: ' + existingStripeAccount);
//     const name =
//         stripe_account?.settings?.dashboard?.display_name ||
//         stripe_account?.display_name ||
//         null;

//     console.log(stripe_account?.payouts_enabled);
//     console.log(stripe_account?.charges_enabled);
//     console.log(stripe_account?.details_submitted);

//     return {
//         account_details: existingStripeAccount,
//         stripe_account: stripe_account,
//         name: name
//     };
// };

/*
In our demo example, we check if an account should be able to unlink itself, like this (check verifyStripe.ts) 👇

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

// @type boolean
const shouldAllowUnlink =
  accountAnalysis?.hasConnectedAccount &&
  (!accountAnalysis?.isValid ||
    !accountAnalysis?.hasCompletedProcess ||
    !accountAnalysis?.displayName);
In our example, we should allow unlinking the account if the account is connected and if any of the below are false or null:

account.charges_enabled
account.payouts_enabled
account.details_submitted
Account display name
*/

// export const shouldAllowUnlink = async (session: any) => {
//     const existingStripeAccount = await getLinkedStripeDetails(session);

//     if (!existingStripeAccount) {
//         console.log('No Stripe account linked to this session.');
//         return true;
//         //throw new Error('No Stripe account linked to this session.');
//     }

//     const account = await stripe.accounts.retrieve(existingStripeAccount.account_details?.accountId);

//     const accountAnalysis = {
//         hasConnectedAccount: !!account?.id,
//         accountId: account?.id,
//         hasCompletedProcess: account?.details_submitted,
//         isValid: account?.charges_enabled && account?.payouts_enabled,
//         displayName: account?.settings?.dashboard?.display_name || account?.display_name || null,
//     };

//     return accountAnalysis.hasConnectedAccount && (!accountAnalysis.isValid || !accountAnalysis.hasCompletedProcess || !accountAnalysis.displayName);
// };

