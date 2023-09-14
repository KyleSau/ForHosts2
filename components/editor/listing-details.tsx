import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
export default function ListingDetails({ data }) {
  const id = data['id'];

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    maxGuests: Yup.number().required('Maximum guests is required').min(1, 'Must be at least 1'),
    minDays: Yup.number().required('Minimum stay is required').min(1, 'Must be at least 1'),
    numRooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    numBathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    country: Yup.string().required('Country is required'),
    streetAddress: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('State / Province is required'),
    postalCode: Yup.string().required('ZIP / Postal code is required'),
  });

  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      title: '',
      description: '',
      maxGuests: '',
      minDays: '',
      numRooms: '',
      numBathrooms: '',
      country: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Your form submission logic
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TabTitle title="Propery Description" desc="Title and Description for your property listing" />
      <div className="mt-10">
        <label htmlFor="title" className="block text-sm font-medium leading-6  text-gray-900">
          Listing Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className={`block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            formik.touched.title && formik.errors.title ? 'border-red-500' : ''
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-600 text-sm mt-2">{formik.errors.title}</div>
        )}
      </div>

      <div className="mt-10">
        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
          Description of property
        </label>
        <textarea
          name="description"
          id="description"
          className={`block w-full h-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            formik.touched.description && formik.errors.description ? 'border-red-500' : ''
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-600 text-sm mt-2">{formik.errors.description}</div>
        )}
      </div>
      <hr className='mt-10' />
<TabTitle title="Facilities" desc="Choose the amount for various facilities in your property" />
<div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
  <div>
    <label htmlFor="maxGuests" className="block text-sm font-medium leading-6 text-gray-900">
      Maximum number of guests allowed
    </label>
    <input
      type="number"
      name="maxGuests"
      id="maxGuests"
      className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.maxGuests && formik.errors.maxGuests ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.maxGuests}
    />
    {formik.touched.maxGuests && formik.errors.maxGuests && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.maxGuests}</div>
    )}
  </div>

  <div>
    <label htmlFor="minDays" className="block text-sm font-medium leading-6 text-gray-900">
      Minimum stay required (in days)
    </label>
    <input
      type="number"
      name="minDays"
      id="minDays"
      className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.minDays && formik.errors.minDays ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.minDays}
    />
    {formik.touched.minDays && formik.errors.minDays && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.minDays}</div>
    )}
  </div>

  <div>
    <label htmlFor="numRooms" className="block text-sm font-medium leading-6 text-gray-900">
      Number of Bedrooms
    </label>
    <input
      type="number"
      name="numRooms"
      id="numRooms"
      className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.numRooms && formik.errors.numRooms ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.numRooms}
    />
    {formik.touched.numRooms && formik.errors.numRooms && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.numRooms}</div>
    )}
  </div>

  <div>
    <label htmlFor="numBathrooms" className="block text-sm font-medium leading-6 text-gray-900">
      Number of Bathrooms
    </label>
    <input
      type="number"
      name="numBathrooms"
      id="numBathrooms"
      className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.numBathrooms && formik.errors.numBathrooms ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.numBathrooms}
    />
    {formik.touched.numBathrooms && formik.errors.numBathrooms && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.numBathrooms}</div>
    )}
  </div>
</div>

      <hr className='mt-10' />
      <TabTitle title="Address Information" desc='Address Information regarding your listing (This will not be shown to anyone until they have booked the listing)' />
      <div className="mt-10 grid grid-cols-2 gap-4">
  <div className="space-y-4">
    <label htmlFor="streetAddress" className="block text-sm font-medium leading-6 text-gray-900">
      Street address
    </label>
    <input
      type="text"
      name="streetAddress"
      id="streetAddress"
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.streetAddress && formik.errors.streetAddress ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.streetAddress}
    />
    {formik.touched.streetAddress && formik.errors.streetAddress && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.streetAddress}</div>
    )}
    
    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
      City
    </label>
    <input
      type="text"
      name="city"
      id="city"
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.city && formik.errors.city ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.city}
    />
    {formik.touched.city && formik.errors.city && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.city}</div>
    )}
  </div>

  <div className="space-y-4">
    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
      State / Province
    </label>
    <input
      type="text"
      name="region"
      id="region"
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.region && formik.errors.region ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.region}
    />
    {formik.touched.region && formik.errors.region && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.region}</div>
    )}
    
    <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
      ZIP / Postal code
    </label>
    <input
      type="text"
      name="postalCode"
      id="postalCode"
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : ''
      }`}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.postalCode}
    />
    {formik.touched.postalCode && formik.errors.postalCode && (
      <div className="text-red-600 text-sm mt-2">{formik.errors.postalCode}</div>
    )}
  </div>
</div>
      <hr className='mt-10'/>
<div className='mt-4'>
        <EditorSaveButton />
        </div>
    </form>
  );
}
