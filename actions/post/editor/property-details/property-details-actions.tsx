"use server"
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PropertyDetailsRequestSchema } from './property-details-valdiation-schema'
import { UpdatePropertyDetailsRequest } from './update-property-details-request';

export const updatePropertyDetails = async (request: UpdatePropertyDetailsRequest) => {
    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    // Validate the input data with Zod
    const validationResult = PropertyDetailsRequestSchema.safeParse(request);

    if (!validationResult.success) {
        return { error: "Invalid input", details: validationResult.error.issues };
    }

    // if (!property || request.userId !== session.user.id) {
    //     return { error: "No access" };
    //   }

    console.log('property details id: ', request.id);

    // If validation passed, cast the data to PropertyDetailsRequest type
    const validatedData: UpdatePropertyDetailsRequest = validationResult.data;

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
