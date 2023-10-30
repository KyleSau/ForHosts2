import React from 'react'

export default function WhatToKnow() {
    return (
        <div className="col-span-1 m-2 rounded-sm  md:col-span-full">
            <p className="mb-5 flex justify-center text-xl font-bold">
                What To Know About Where You&apos;re Staying
            </p>
            <div className="grid grid-cols-3">
                <div className="m-2">
                    <p className="flex justify-center text-lg font-bold">
                        House Rules
                    </p>
                    <hr />
                    <p className=" flex justify-center">
                        Check-in after 3:00 PM
                        <br />
                        Checkout before 11:00 AM
                        <br />
                        No pets
                    </p>
                </div>
                <div className="m-2">
                    <p className="flex justify-center text-lg font-bold">
                        Cancellation Info
                    </p>
                    <hr />
                    <p className="flex justify-center">
                        Check-in after 3:00 PM
                        <br />
                        Checkout before 11:00 AM
                        <br />
                        No pets
                    </p>
                </div>
                <div className="m-2">
                    <p className="flex justify-center text-lg font-bold">Safety</p>
                    <hr />
                    <p className=" flex justify-center">
                        Check-in after 3:00 PM
                        <br />
                        Checkout before 11:00 AM
                        <br />
                        No pets
                    </p>
                </div>
            </div>
        </div>
    )
}