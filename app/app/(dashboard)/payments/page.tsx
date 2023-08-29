import { getSession } from "@/lib/auth";
import {
    getStripeAuthorization,
    getStripeAccount,
    linkStripeAccount,
} from '@/lib/stripe-connect';
import { redirect } from "next/navigation";
import StripeLinkButton from "@/components/stripe-connect/stripe-connect-button";
import StripeUnlinkButton from "@/components/stripe-connect/stripe-disconnect-button";
const YES = <>✅&nbsp;&nbsp;Yes.</>;
const NO = <>❌&nbsp;&nbsp;No.</>;

export default async function Page({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    //const unlink = await unlinkStripeAccount(session);
    const stripeAccount = await getStripeAccount(session);

    if (!stripeAccount) {
        const code = typeof searchParams['code'] === 'string' ? searchParams['code'] : '';
        if (code) {
            const stripe = await linkStripeAccount(code, session);
            if (stripe) {
                return (
                    <div>
                        <div className="inline-block bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 shadow-md">
                            Stripe Account successfully linked!
                        </div>

                        <div className="mb-6">
                            <span className="font-semibold text-lg">Connected:</span>
                            <span className="text-blue-600 ml-2 text-xl font-medium">{stripe.name}</span>
                        </div>
                        <div>
                            <h3>Payouts Enabled?</h3>
                            <h2>{stripe.auth.payouts_enabled ? YES : NO}</h2>
                        </div>
                        <div>
                            <h3>Charges Enabled?</h3>
                            <h2>{stripe.auth.charges_enabled ? YES : NO}</h2>
                        </div>
                        <div>
                            <h3>Details Submitted?</h3>
                            <h2>{stripe.auth.details_submitted ? YES : NO}</h2>
                        </div>
                        {stripe.unlinkable && <StripeUnlinkButton />}
                    </div>
                );
            } else {
                return (
                    <div>
                        Unable to link Stripe Account
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <StripeLinkButton />
                </div>
            );
        }
    } else {
        const stripe = await getStripeAuthorization(stripeAccount);
        if (stripe) {
            return (
                <div>
                    <div className="mb-6">
                        <span className="font-semibold text-lg">Connected:</span>
                        <span className="text-blue-600 ml-2 text-xl font-medium">{stripe.name}</span>
                    </div>
                    <div>
                        <h3>Payouts Enabled?</h3>
                        <h2>{stripe.auth.payouts_enabled ? YES : NO}</h2>
                    </div>
                    <div>
                        <h3>Charges Enabled?</h3>
                        <h2>{stripe.auth.charges_enabled ? YES : NO}</h2>
                    </div>
                    <div>
                        <h3>Details Submitted?</h3>
                        <h2>{stripe.auth.details_submitted ? YES : NO}</h2>
                    </div>
                    {stripe.unlinkable && <StripeUnlinkButton />}
                </div >
            );
        } else {
            return (
                <div>
                    Unable to authorize stripe account
                    {/* Optionally, you can add the unlink button here too */}
                </div>
            );
        }
    }
}
