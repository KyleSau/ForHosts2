"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ContainerDiv } from "./Styles";

const YES = <>✅&nbsp;&nbsp;Yes.</>;
const NO = <>❌&nbsp;&nbsp;No.</>;

const HomeView: React.FC<{}> = () => {
    const [data, setData] = useState<any>();

    const searchParams = useSearchParams()

    useEffect(() => {
        async function fetchData() {
            const code = searchParams.get("code");
            const scope = searchParams.get("scope");

            if (code && scope) {
                try {
                    const response = await fetch('http://localhost:3000/api/verifyStripe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code, scope })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setData(result);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }

        fetchData();
    }, [searchParams]);

    return (
        <>
            <h1>Stripe Connect Demo</h1>
            <h4>Code: {searchParams.get("code")}</h4>
            <h4>Scope: {searchParams.get("scope")}</h4>
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

                {data?.req?.code?.startsWith('ac_') && (
                    <>
                        <br />
                        <br />
                        <hr />
                        <br />
                    </>
                )}

                {data?.data?.account?.id && (
                    <>
                        <div className="accountAnalysis">
                            <div>
                                <h3>Payouts Enabled?</h3>
                                <h2>{data?.data?.account?.payouts_enabled ? YES : NO}</h2>
                            </div>
                            <div>
                                <h3>Charges Enabled?</h3>
                                <h2>{data?.data?.account?.charges_enabled ? YES : NO}</h2>
                            </div>
                            <div>
                                <h3>Details Submitted?</h3>
                                <h2>{data?.data?.account?.details_submitted ? YES : NO}</h2>
                            </div>
                        </div>

                        <br />
                        <hr />
                        <br />

                        <div className="allowUnlink">
                            <h3>Allow Unlink?</h3>
                            <p>
                                When users connect their Stripe account, and if it is incomplete
                                or invalid, you might want to let them unlink.
                            </p>
                            <h2>{data?.data?.shouldAllowUnlink ? YES : NO}</h2>
                        </div>

                        <br />
                        <hr />
                        <br />
                    </>
                )}

                {data?.req?.code?.startsWith('ac_') && (
                    <>
                        <div className="fetchedData">
                            <h3>Fetched data</h3>
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>

                        <>
                            <br />
                            <p style={{ textAlign: 'right' }}>
                                by <a href="https://kumarabhirup.me">Kumar Abhirup</a>
                                <br />
                                <a href="https://logrocket.io">A Logrocket Tutorial</a>
                            </p>
                        </>
                    </>
                )}
            </ContainerDiv>
        </>
    );
};

export default HomeView;