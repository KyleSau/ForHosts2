import { z } from 'zod';

export const PropertyDetailsRequestSchema = z.object({
    id: z.string(),
    listingType: z.string(),
    placeType: z.string(),
    propertyType: z.string(),
    maxGuests: z.number(),
    maxPets: z.number(),
    totalBedrooms: z.number(),
    bathrooms: z.number(),
});
