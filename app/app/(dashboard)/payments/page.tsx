import { getSession } from "@/lib/auth";
import {
    getStripeAuthorization,
    getStripeAccount,
    linkStripeAccount,
    getTransactions,
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

    const data = {
        pricePerNight: 399.99,
        cleaningFee: 125.00,
        unavailableDates: ['2023-09-05', '2023-09-06', '2023-09-07', '2023-09-12']
        ,
        maxGuests: 3,
        petsAllowed: false
    }

    const stripeAccount = await getStripeAccount(session);

    function formatAmount(amount: any) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
    }

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
                        Unable to link Stripe Account - Try refreshing this page...
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
        const stripe = await getStripeAuthorization(stripeAccount, session);
        if (stripe) {

            const transactions = await getTransactions(stripeAccount.accountId);
            return (
                <div>
                    <div className="mt-4 mb-4 px-8">
                        <span className="font-semibold text-lg">Connected:</span>
                        <span className="text-blue-600 ml-2 text-xl font-medium">{stripe.name}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="px-8">
                            <h3>Payouts Enabled?</h3>
                            <h2>{stripe.auth.payouts_enabled ? YES : NO}</h2>
                        </div>
                        <div className="px-8">
                            <h3>Charges Enabled?</h3>
                            <h2>{stripe.auth.charges_enabled ? YES : NO}</h2>
                        </div>
                        <div className="px-8">
                            <h3>Details Submitted?</h3>
                            <h2>{stripe.auth.details_submitted ? YES : NO}</h2>
                        </div>
                    </div>

                    {stripe.unlinkable && <StripeUnlinkButton />}
                    <table className="min-w-full table-fixed">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction: any) => (
                                <tr key={transaction.id} className="even:bg-gray-100">
                                    <td className="text-center">{formatAmount(transaction.amount)}</td>
                                    <td className="text-center">{transaction.description}</td>
                                    <td className="text-center">{transaction.billing_details.name ? transaction.billing_details.name : 'N/A'}</td>
                                    <td className="text-center">{new Date(transaction.created * 1000).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
