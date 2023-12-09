import * as Yup from 'yup';

const PropertyDetailsValidationSchema = Yup.object().shape({
    id: Yup.string().required('Property Details id is required'),
    listingType: Yup.string()
        .required('Listing Type is required'),
    placeType: Yup.string()
        .required('Place Type is required'),
    propertyType: Yup.string()
        .required('Property Type is required'),
    maxGuests: Yup.number()
        .required('Max Guests is required')
        .positive('Max Guests must be a positive number')
        .integer('Max Guests must be an integer')
        .max(20, 'Maximum number of guests is 20'),
    maxPets: Yup.number()
        .required('Max Pets is required')
        .positive('Max Pets must be a positive number')
        .integer('Max Pets must be an integer')
        .max(5, 'Maximum number of pets is 5'),
    totalBedrooms: Yup.number()
        .required('Total Bedrooms is required')
        .positive('Total Bedrooms must be a positive number')
        .integer('Total Bedrooms must be an integer')
        .max(20, 'Maximum number of bedrooms is 20'),
    bathrooms: Yup.number()
        .required('Bathrooms is required')
        .positive('Bathrooms must be a positive number')
        .integer('Bathrooms must be an integer')
        .max(20, 'Maximum number of bathrooms is 20'),
});

export default PropertyDetailsValidationSchema;