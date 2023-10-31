"use server";
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AvailabilityValidationSchema from './availability-validation-schema';
import { UpdateAvailabilityRequest } from './update-availability-request';
import * as yup from 'yup';

export const updateAvailability = async (request: UpdateAvailabilityRequest) => {
    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    // Validate the input data with Yup
    let validatedData: UpdateAvailabilityRequest;
    try {
        const validationResult = await AvailabilityValidationSchema.validate(request);
        validatedData = sanitizeData(validationResult);
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            return { error: "Invalid input", details: error.errors };
        } else {
            // Handle other errors if necessary
            throw error;
        }
    }

    const userId = session?.user.id;

    console.log('update availability');

    // Update the propertyDetails
    const record = await prisma.availability.findFirst({
        where: {
            id: validatedData.id,
            userId: userId
        }
    });
    if (record) {
        // Ensure only boolean values are in the arrays
        validatedData.restrictedCheckIn = validatedData.restrictedCheckIn?.filter(Boolean) || [];
        validatedData.restrictedCheckOut = validatedData.restrictedCheckOut?.filter(Boolean) || [];

        const response = await prisma.availability.update({
            where: { id: record.id },
            data: validatedData
        });

        return response;
    }
}

function sanitizeData(data: any): UpdateAvailabilityRequest {
    return {
        ...data,
        restrictedCheckIn: data.restrictedCheckIn?.filter(Boolean) || [],
        restrictedCheckOut: data.restrictedCheckOut?.filter(Boolean) || [],
    };
}
