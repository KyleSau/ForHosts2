export interface UpdateAvailabilityRequest {
    id: string;
    instantBooking?: boolean;
    minStay?: number;
    maxStay?: number;
    advanceNotice?: number;
    sameDayAdvanceNotice?: string;
    preparationTime?: number;
    availabilityWindow?: number;
    restrictedCheckIn?: boolean[];
    restrictedCheckOut?: boolean[];
    checkInWindowStart?: string;
    checkInWindowEnd?: string;
    checkInTime?: string;
    checkOutTime?: string;
}