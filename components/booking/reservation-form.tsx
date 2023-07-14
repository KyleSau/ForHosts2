import React, { useState } from 'react';

interface ReservationData {
    startDate: Date;
    endDate: Date;
    guests: number;
    listingId: string;
}

// Retrieve the listingId as a prop
// Limit the guestCapacity from the listingId

export default function ReservationForm() {
    const [reservation, setReservation] = useState<ReservationData>();

    const handleFinalizeReservation = () => {
        console.log('Finalize Reservation');
        // Send ReservationData as MetaData to Stripe Checkout
    };

    return (
        <div>
            {/* Date Ranger Picker from AirBnB */}
            <button onClick={handleFinalizeReservation}>Reserve</button>
        </div>
    );
}


/*

            <form
                action={
                    async (data: FormData) =>
                    createReservation(data).then((res: any) => {
                        if (res.error) {
                            toast.error(res.error);
                        } else {
                            va.track("Created Reservation");
                            const { id } = res;
                            router.refresh();
                            router.push(`/reservations/${id}`);
                            modal?.hide();
                            toast.success(`Successfully created reservation!`);
                        }
                    })
                }
                className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
            >
                <div className="relative flex flex-col space-y-4 p-5 md:p-10">
                    <h2 className="font-cal text-2xl dark:text-white">Create a new reservation</h2>

                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-stone-500 dark:text-stone-400"
                        >
                            Website Name (Title)
                        </label>
                    </div>

                    <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="subdomain"
                        className="text-sm font-medium text-stone-500"
                    >
                        Subdomain
                    </label>
                    <div className="flex w-full max-w-md">
                        <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                        .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-stone-500"
                    >
                        Description
                    </label>
                    </div>
                </div>
                <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
                </div>
            </form>

*/