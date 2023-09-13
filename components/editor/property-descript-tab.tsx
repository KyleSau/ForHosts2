import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePropertyDescript } from '@/lib/actions';
import { Post } from "@prisma/client";
import { off } from 'process';
import { useState } from 'react';



export default function PropertyDescription({ data, setActive }) {
  const id = data['id'];
  const [siteData, setSiteData] = useState(id);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
  });
  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      title: '',
      description: '',
      // Initialize other form fields here
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      // Call the updatePost function with the data from Formik
      const result = await updatePropertyDescript(values);

      if (result?.error) {
        // Handle the error, e.g., display an error message
        console.error(result.error);
      } else {
        // Handle success, e.g., navigate to a success page or show a success message
        console.log('Post updated successfully:', result);
        // setActive("PropDetails")
      }
    },
  });

  return (
<form onSubmit={formik.handleSubmit}>  
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">
          Property Description Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
         Title and Description of your property.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Price per night of listing
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
            </div>
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.title}</div>
            )}
          </div>
              </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900 mt-10">
              Description of property
            </label>
            <div className="mt-2">
              <textarea
                name="description"
                id="description"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
            </div>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.description}</div>
            )}
          </div>
      </div>
      <div className="flex-auto flex flex-row-reverse">
  <button
    type="submit" // Specify the button type as "submit" to trigger form submission
    className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    Next
  </button>

      </div>
      </form>
 

  );
}
