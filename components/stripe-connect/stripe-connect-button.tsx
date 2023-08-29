"use client"
interface Props {
}

const StripeConnectButton: React.FC<Props> = ({ }) => {

    const handleClick = () => {
        const url = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID}&scope=read_write&state=${Math.random() * 100}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}`;
        window.document.location.href = url;
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Link Stripe Account
            </button>
        </div>
    );
};

export default StripeConnectButton;