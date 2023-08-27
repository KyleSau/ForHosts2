// import { getSession } from "@/lib/auth";
import HomeView from '@/components/stripe/HomeView';

// export default function PaymentsPage({ }) {

//     return <HomeView />;

// }

// export default function Page({
//     params,
//     searchParams,
// }: {
//     params: { slug: string }
//     searchParams: { [key: string]: string | string[] | undefined }
// }) {
//     return <pre>{JSON.stringify({ params, searchParams }, null, 2)}</pre>
// }


// app/payments/page.tsx:
// app/payments/page.server.tsx:

// app/payments/page.server.tsx:

// app/payments/page.tsx:
import { getSession } from "@/lib/auth";
import { getStripeAuth } from '@/lib/actions';
import { redirect } from "next/navigation";

export default async function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }


    const code = typeof searchParams['code'] === 'string' ? searchParams['code'] : '';
    let data = undefined;
    if (code) {
        // authorizeStripeCode
        data = await getStripeAuth(code, session);
        // display error if 
        // Error: This authorization code has already been used. All tokens issued with this code have been revoked.
        // or
        // Error: Authorization code does not exist: ac_OWhzK44Dk5ctCxE6gjcmmq8FjJejuu6R
        // or
        // Error: Too many attempts. Please try again later.
    }

    // const stripeData = 

    console.log("Received searchParams:", searchParams);
    return <HomeView data={data} />
}
