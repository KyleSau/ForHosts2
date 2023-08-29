"use client"

const StripeDisconnectButton: React.FC = ({ }) => {

    const handleClick = async () => {
        try {
            const response = await fetch("/api/stripe/unlink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const responseData = await response.json();

            // Check for a successful response status and refresh the page
            if (response.ok && responseData?.status === 'OK') {
                // Navigate to the current page without any query parameters
                window.location.href = window.location.pathname;
            } else {
                console.error('Error unlinking Stripe account:', responseData?.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Failed to unlink Stripe:', err);
        }
    };


    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Unlink Stripe Account
            </button>
        </div>
    );
};

export default StripeDisconnectButton;