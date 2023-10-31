import * as Yup from 'yup';

const AvailabilityValidationSchema = Yup.object().shape({
    id: Yup.string().required('Property Details id is required'),
    instantBooking: Yup.boolean().required('Instant Booking is required'),
    minStay: Yup.number().required('Minimum Stay is required'),
    maxStay: Yup.number().required('Maximum Stay is required'),
    advanceNotice: Yup.number().required('Advance Notice is required'),
    sameDayAdvanceNotice: Yup.string().required('Same Day Advance Notice is required'),
    preparationTime: Yup.number().required('Preparation Time is required'),
    availabilityWindow: Yup.number().required('Availability Window is required'),
    restrictedCheckIn: Yup.array(Yup.boolean()).required('Restricted Check-In is required'),
    restrictedCheckOut: Yup.array(Yup.boolean()).required('Restricted Check-Out is required'),
    checkInWindowStart: Yup.string().required('Check-In Window Start is required'),
    checkInWindowEnd: Yup.string().required('Check-In Window End is required'),
    checkInTime: Yup.string().required('Check-In Time is required'),
    checkOutTime: Yup.string().required('Check-Out Time is required'),
    userId: Yup.string().required('User ID is required'),
});

export default AvailabilityValidationSchema;
