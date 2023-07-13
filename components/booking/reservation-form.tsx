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
