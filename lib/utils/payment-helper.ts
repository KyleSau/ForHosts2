const { DateTime } = require('luxon');
export default function calculateTotalCost(startDate: Date, endDate: Date, pricePerNight: number) {
    // Input validation
    if (!startDate || !endDate || !pricePerNight) {
        throw new Error('Invalid input');
    }

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (end <= start) {
        throw new Error('End date must be after start date');
    }

    const daysDiff = Math.round(end.diff(start, 'days').days);

    return {
        price: daysDiff * pricePerNight,
        nights: daysDiff
    }
}