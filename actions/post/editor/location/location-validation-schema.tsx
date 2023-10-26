import * as Yup from 'yup';

const LocationValidationSchema = Yup.object().shape({
    id: Yup.string().required('Property Details id is required'),
    address: Yup.string().required('Address is required'),
    longitude: Yup.string().required('location longitude required'),
    latitude: Yup.string().required('location longitude required'),
    approximate: Yup.boolean().required('approximation value required')
});

export default LocationValidationSchema;