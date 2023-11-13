"use client"
import { ContainerDiv } from './stripe-styles'

interface Props {
}

const StripeConnectButton: React.FC<Props> = ({ }) => {

    const handleClick = () => {
        const url = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID}&scope=read_write&state=${Math.random() * 100}&redirect_uri=${process.env.NEXT_PUBLIC_PAYMENTS_URL}`;
        window.document.location.href = url;
    };

    return (
        <div>
            <ContainerDiv>
                <button
                    type="button"
                    onClick={handleClick}
                    className="stripe-connect"
                >
                    <span>Connect with Stripe</span>
                </button>
            </ContainerDiv>
        </div>
    );
};

export default StripeConnectButton;