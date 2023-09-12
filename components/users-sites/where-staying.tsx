"use client";

function WhereStaying() {
    return (
        <div className="bg-white col-span-1 md:col-span-full m-2 rounded-sm">
            <p className="text-xl font-bold flex justify-center mb-5">What To Know About Where You&apos;re Staying</p>
            <div className="grid grid-cols-3">
                <div className="m-2">
                    <p className="text-lg font-bold flex justify-center">House Rules</p>
                    <hr />
                    <p className=" flex justify-center">Check-in after 3:00 PM<br />
                        Checkout before 11:00 AM<br />
                        No pets

                    </p>
                </div>
                <div className="m-2">
                    <p className="text-lg font-bold flex justify-center">Cancellation Info</p>
                    <hr />
                    <p className="flex justify-center">Check-in after 3:00 PM<br />
                        Checkout before 11:00 AM<br />
                        No pets

                    </p>
                </div>
                <div className="m-2">
                    <p className="text-lg font-bold flex justify-center">Safety</p>
                    <hr />
                    <p className=" flex justify-center">Check-in after 3:00 PM<br />
                        Checkout before 11:00 AM<br />
                        No pets
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WhereStaying;