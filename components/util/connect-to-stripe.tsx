'use client'
import { ContainerDiv } from "../styles";

const ConnectToStripe = (data: any) => {

    return (
        <div>
            <ContainerDiv>
                <button
                    type="button"
                    className="stripe-connect"
                    onClick={() => {
                        if (window) {
                            const url = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID
                                }&scope=read_write&state=${Math.random() * 100}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL
                                }`;

                            window.document.location.href = url;
                        }
                    }}
                >
                    {data?.data?.account?.id ? (
                        <span>Connected: {data?.data?.account?.display_name}</span>
                    ) : (
                        <span>Connect with Stripe</span>
                    )}
                </button>
            </ContainerDiv>
        </div>
    );
};

export default ConnectToStripe