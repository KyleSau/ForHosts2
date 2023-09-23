import CheckoutForm from "@/components/checkout/checkout";
export default async function CheckoutPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    return (
        <div>
            <CheckoutForm />
        </div>
    );
}
