import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { updateListingDetails } from '@/lib/actions';
import { CalendarModal } from './calendar-editor-modal';
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions";
import DeletePostForm from "@/components/form/delete-post-form";

export default function ListingDetails({ data }) {
  const id = data['id'];
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    maxGuests: Yup.number().required('Maximum guests is required').min(1, 'Must be at least 1'),
    minimumStay: Yup.number().required('Minimum stay is required').min(1, 'Must be at least 1'),
    bedrooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    bathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    // country: Yup.string().required('Country is required'),
    // streetAddress: Yup.string().required('Street address is required'),
    // city: Yup.string().required('City is required'),
    // region: Yup.string().required('State / Province is required'),
    // postalCode: Yup.string().required('ZIP / Postal code is required'),
  });

  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      title: '',
      description: '',
      maxGuests: '',
      minimumStay: '',
      bedrooms: '',
      bathrooms: '',
      // country: '',
      // streetAddress: '',
      // city: '',
      // region: '',
      // postalCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setSubmitted(false);
      setIsLoading(true);
      // Your form submission logic
      const result = await updateListingDetails(values);


      if (result) {
        console.log('Post updated successfully:', result);
        setSubmitted(true);
        setIsLoading(false);
      }
      if (result?.error) {
        // Handle the error, e.g., display an error message
        console.error(result.error);
        setSubmitted(false);
      } else {
        // Handle success, e.g., navigate to a success page or show a success message


      }
      // You can add your logic to send this data to the server or handle it as needed
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TabTitle title="Basic Details" desc="Basic Listing Details About Your Property" />
      <div className="mt-10">
        <label htmlFor="title" className="block text-sm font-medium leading-6  text-gray-900">
          Listing Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className={`block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''
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
          className={`block w-full h-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''
            }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-600 text-sm mt-2">{formik.errors.description}</div>
        )}
        <div className="mt-5">
          <Form
            title="Post Slug"
            description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
            helpText="Please use a slug that is unique to this post."
            inputAttrs={{
              name: "slug",
              type: "text",
              defaultValue: data?.slug!,
              placeholder: "slug",
            }}
            handleSubmit={updatePostMetadata}
          />
        </div>
      </div>
      <hr className='mt-10' />
      <TabTitle title="Facilities" desc="Choose the amount for various facilities in your property" />
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium leading-6 text-gray-900">
            Number of Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            id="bedrooms"
            className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.bedrooms && formik.errors.bedrooms ? 'border-red-500' : ''
              }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bedrooms}
          />
          {formik.touched.bedrooms && formik.errors.bedrooms && (
            <div className="text-red-600 text-sm mt-2">{formik.errors.bedrooms}</div>
          )}
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium leading-6 text-gray-900">
            Number of Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            id="bathrooms"
            className={`block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.bathrooms && formik.errors.bathrooms ? 'border-red-500' : ''
              }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bathrooms}
          />
          {formik.touched.bathrooms && formik.errors.bathrooms && (
            <div className="text-red-600 text-sm mt-2">{formik.errors.bathrooms}</div>
          )}
        </div>
      </div>

      <hr className='mt-10' />
      <TabTitle title="Address Information" desc='Address Information regarding your listing (This will not be shown to anyone until 24 hours before check-in)' />
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label htmlFor="streetAddress" className="block text-sm font-medium leading-6 text-gray-900">
            Street address
          </label>
          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.streetAddress && formik.errors.streetAddress ? 'border-red-500' : ''
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
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.city && formik.errors.city ? 'border-red-500' : ''
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
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.region && formik.errors.region ? 'border-red-500' : ''
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
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : ''
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
      <div className="mt-5">
        <DeletePostForm postName={data?.title!} />
      </div>
      <hr className='mt-10' />
      <div className='mt-4'>
        <EditorSaveButton submitted={submitted} isLoading={isLoading} />
      </div>
    </form>
  );
}
