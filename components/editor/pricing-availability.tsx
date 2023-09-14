'use client';
import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePropertyPriceInfo } from "@/lib/actions";

const validationSchema = Yup.object().shape({
  price: Yup.number()
    .required('Price per night is required')
    .positive('Price per night must be a positive number'),
  securityDeposit: Yup.number()
    .required('Security Deposit is required')
    .positive('Security Deposit must be a positive number'),
  maxGuests: Yup.number()
    .required('Max guests allowed is required')
    .positive('Max guests allowed must be a positive number'),
  minimumStay: Yup.number()
    .required('Minimum stay required is required')
    .positive('Minimum stay must be a positive number'),
  bedrooms: Yup.number()
    .required('Number of rooms is required')
    .positive('Number of rooms must be a positive number'),
  cleaningFee: Yup.number()
    .required('Cleaning Fee is required')
    .positive('Cleaning Fee must be a positive number'),
  // Add validation for other fields here
});

export default function PricingAvailability({ data }) {
  const id = data['id'];
  const [siteData, setSiteData] = useState(id);
  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      price: '',
      securityDeposit: '',
      maxGuests: '',
      minimumStay: '',
      bedrooms: '',
      cleaningFee: '',
      // Initialize other fields here
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      // Handle form submission logic here
      const result = await updatePropertyPriceInfo(values);

      if (result?.error) {
        // Handle the error, e.g., display an error message
        console.error(result.error);
      } else {
        // Handle success, e.g., navigate to a success page or show a success message
        console.log('Post updated successfully:', result);

      }
      // You can add your logic to send this data to the server or handle it as needed
    },
  });
  const handleBeforeUnload = (e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formik.dirty]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                Price per night
              </label>
              <div className="mt-2">
                <input type="number" name="price" id="price"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.price && formik.errors.price ? 'border-red-500' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
              </div>
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.price}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="securityDeposit" className="block text-sm font-medium leading-6 text-gray-900">
                Security Deposit required by client
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="securityDeposit"
                  id="securityDeposit"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.securityDeposit && formik.errors.securityDeposit ? 'border-red-500' : ''
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.securityDeposit}
                />
              </div>
              {formik.touched.securityDeposit && formik.errors.securityDeposit && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.securityDeposit}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="maxGuests" className="block text-sm font-medium leading-6 text-gray-900">
                Max guests allowed
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="maxGuests"
                  id="maxGuests"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.maxGuests && formik.errors.maxGuests ? 'border-red-500' : ''
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxGuests}
                />
              </div>
              {formik.touched.maxGuests && formik.errors.maxGuests && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.maxGuests}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="minimumStay" className="block text-sm font-medium leading-6 text-gray-900">
                Minimum stay required (in days)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="minimumStay"
                  id="minimumStay"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.minimumStay && formik.errors.minimumStay ? 'border-red-500' : ''
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.minimumStay}
                />
              </div>
              {formik.touched.minimumStay && formik.errors.minimumStay && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.minimumStay}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bedrooms" className="block text-sm font-medium leading-6 text-gray-900">
                Number of rooms in listing
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.bedrooms && formik.errors.bedrooms ? 'border-red-500' : ''
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bedrooms}
                />
              </div>
              {formik.touched.bedrooms && formik.errors.bedrooms && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.bedrooms}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cleaningFee" className="block text-sm font-medium leading-6 text-gray-900">
                Cleaning Fee
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="cleaningFee"
                  id="cleaningFee"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.cleaningFee && formik.errors.cleaningFee ? 'border-red-500' : ''
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cleaningFee} />
              </div>
              {formik.touched.cleaningFee && formik.errors.cleaningFee && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.cleaningFee}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex p-2 mt-4">
          <div className="flex-auto flex flex-row-reverse">
            <button
              type="submit" // Specify the button type as "submit" to trigger form submission
              className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
