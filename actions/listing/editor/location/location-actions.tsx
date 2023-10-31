"use server";
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LocationValidationSchema from './location-validation-schema';
import { UpdateLocationRequest } from './update-location-request';
import * as yup from 'yup';

export const updateLocation = async (request: UpdateLocationRequest) => {
    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    // Validate the input data with Yup
    let validatedData: UpdateLocationRequest;
    try {
        validatedData = await LocationValidationSchema.validate(request);
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            return { error: "Invalid input", details: error.errors };
        } else {
            // Handle other errors if necessary
            throw error;
        }
    }

    console.log('property details id: ', request.id);

    const userId = session?.user.id;

    // Update the propertyDetails
    const record = await prisma.location.findFirst({
        where: {
            id: validatedData.id,
            userId: userId
        }
    });

    if (record) {
        const response = await prisma.location.update({
            where: { id: record.id },
            data: validatedData
        });

        return response;
    }
}
