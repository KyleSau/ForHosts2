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
import { HelpCircle } from "lucide-react";
import Image from "next/image";
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
                <div className="">
                    {/* First Card */}
                    <div className="bg-white p-6 shadow rounded mb-6">
                        {/* Stripe Logo and Title Section */}
                        <div className="flex items-center space-x-2 mb-4">
                            {/* Replace with actual image */}
                            <Image width={100} height={52} src="/stripe.png" alt="Stripe Logo" className="h-8" />
                            <h1 className="text-xl font-normal text-gray-800">Stripe</h1>
                        </div>

                        {/* <hr className="border-gray-200 mb-4" /> */}

                        {/* Description */}
                        <p className="text-gray-600 mb-4">
                            Process direct booking payments.
                        </p>
                        <hr className="mb-4" />
                        <p>
                            Stripe is the easiest way to accept credit cards. Process major international debit or credit cards, including Visa, Mastercard and American Express. You don't need a merchant account so you can start accepting payments today.
                        </p>

                        {/* Payment processing card */}
                        <div className="bg-blue-100 p-2 rounded mb-4 inline-block">
                            <span className="text-sm text-blue-800">Payment processing</span>
                        </div>

                    </div>

                    {/* Second Card */}
                    <div className="bg-white p-6 shadow rounded">
                        {/* How to connect to Stripe Section */}
                        <div className="flex items-center mb-4">
                            {/* Replace with an actual question mark icon */}
                            <HelpCircle color='black' size={18} />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900">How to connect to Stripe</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Select the 'Connect with Stripe' button below. This will open your Stripe account to enable the connection.
                        </p>

                        <a href="/link-to-guide" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">Click here for a step by step guide.</a>

                        {/* Centered Stripe Link Button */}
                        <div className="flex justify-center mt-4">
                            <StripeLinkButton />
                        </div>
                    </div>
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
                                    <td className="text-center">{transaction.billing_details.name}</td>
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
