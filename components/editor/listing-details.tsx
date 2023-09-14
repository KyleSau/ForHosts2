import React from 'react';
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePostMetadata, updatePropertyDescript } from '@/lib/actions';
import { Post } from "@prisma/client";
import { off } from 'process';
import { useState } from 'react';
import DeletePostForm from '../form/delete-post-form';



export default function ListingDetails({ data }) {

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
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      const result = await updatePropertyDescript(values);

      if (result?.error) {
        console.error(result.error);
      } else {
        console.log('Post updated successfully:', result);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <p>Listing Basics</p>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Listing Title
            </label>
            <div className="mt-2">
              <input type="text" name="title" id="title" className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''}`}
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
              className={`block w-full h-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''
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
      <div className="">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4 flex">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Maximum number of guests allowed</label>
                  <div className="mt-2">
                    <input type="number" name="maxGuests" id="maxGuests" className="block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Minimum stay required (in days)</label>
                  <div className="mt-2">
                    <input type="number" name="minDays" id="minDays" className="block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Number of Bedrooms</label>
                  <div className="mt-2">
                    <input type="number" name="numRooms" id="numRooms" className="block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">Number of Bathrooms</label>
                  <div className="mt-2">
                    <input type="number" name="numRooms" id="numRooms" className="block w-[50px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
              </div>

            </div>

            <div className="col-span-full">
              <div className="mt-2 fond-bold ">
                <div>put amenities modal button/icon here</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Open up the amenities icon above to select all the amenities your property includes.</p>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Location</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">Country</label>
              <div className="mt-2">
                <select id="country" name="country" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <div className="col-span-full">
              <label for="street-address" className="block text-sm font-medium leading-6 text-gray-900">Street address</label>
              <div className="mt-2">
                <input type="text" name="street-address" id="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label for="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
              <div className="mt-2">
                <input type="text" name="city" id="city" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label for="region" className="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
              <div className="mt-2">
                <input type="text" name="region" id="region" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label for="postal-code" className="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
              <div className="mt-2">
                <input type="text" name="postal-code" id="postal-code" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-auto flex flex-row-reverse">
        <button
          type="submit" // Specify the button type as "submit" to trigger form submission
          className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>


  );
}
