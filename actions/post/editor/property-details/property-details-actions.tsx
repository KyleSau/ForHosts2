"use server";
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import PropertyDetailsValidationSchema from './property-details-valdiation-schema';
import { UpdatePropertyDetailsRequest } from './update-property-details-request';
import * as yup from 'yup';

export const updatePropertyDetails = async (request: UpdatePropertyDetailsRequest) => {
    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    // Validate the input data with Yup
    let validatedData: UpdatePropertyDetailsRequest;
    try {
        validatedData = await PropertyDetailsValidationSchema.validate(request);
    } catch (error) {
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
    const record = await prisma.propertyDetails.findFirst({
        where: {
            id: validatedData.id,
            userId: userId
        }
    });

    if (record) {
        const response = await prisma.propertyDetails.update({
            where: { id: record.id },
            data: validatedData
        });

        return response;
    }
}
