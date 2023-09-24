"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { updateListingDetails } from '@/lib/actions';
import LoadingDots from "../icons/loading-dots";
import { toast } from "sonner";
import { useTransition } from "react";
import { updatePostMetadata } from '@/lib/actions';
import { ExternalLink } from 'lucide-react';
import clsx from "clsx";
export default function ListingDetails({ data }) {
  const id = data['id'];
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    bedrooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    bathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    location: Yup.string().required('Street Address is required'),
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
      title: data.title,
      description: data.description,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      location: data.location,
      // country: '',
      // streetAddress: '',
      // city: '',
      // region: '',
      // postalCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitted(false);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("published", String(!data.published));

      console.log(data.published, typeof data.published);
      console.log(formData)
      // Your form submission logic
      const result = await updateListingDetails(values);

      if (result?.error) {
        // Handle the error, e.g., display an error message
        console.error(result.error);
        setSubmitted(false);
      } else {
        // Handle success, e.g., navigate to a success page or show a success message
        console.log('Post updated successfully:', result);
        setSubmitted(true);
        setIsLoading(false);

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

      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <button
          onClick={() => {
            setSubmitted(false);
            const formData = new FormData();
            console.log(data.published, typeof data.published);
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updatePostMetadata(formData, data.id, "published").then(
                () => {
                  toast.success(
                    `Successfully ${data.published ? "unpublished" : "published"
                    } your post.`,
                  );

                },
              );
            });
          }}
          className={clsx(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            isPendingPublishing
              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              : "border border-black bg-black text-white hover:bg-sitecolor hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200",
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "Edit Listing" : "Publish Listing"}</p>
          )}
        </button>
        {data.published && submitted && (
          <div>
            YOU HAVE UNPUBLISHED SAVED CHANGES
          </div>
        )}

      </div>
      <TabTitle title="Basic Details" desc="Basic Listing Details About Your Property" />
      <div className="mt-8">
        <label htmlFor="title" className="block text-sm font-medium leading-6  text-gray-900">
          Listing Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''
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
      </div>
      <hr className='mt-8' />
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
            min="0"
            onWheel={event => event.currentTarget.blur()}
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
            min="0"
            onWheel={event => event.currentTarget.blur()}
          />
          {formik.touched.bathrooms && formik.errors.bathrooms && (
            <div className="text-red-600 text-sm mt-2">{formik.errors.bathrooms}</div>
          )}
        </div>
      </div>

      <hr className='mt-8' />
      <TabTitle title="Address Information" desc='Address Information regarding your listing (This will not be shown to anyone until 24 hours before check-in)' />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label htmlFor="location" className="block text-sm font-medium leading-6  text-gray-900">
            Street Address
          </label>
          <input
            type="text"
            name="location"
            id="location"
            className={` w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.location && formik.errors.location ? 'border-red-500' : ''
              }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}

            value={formik.values.location}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-600 text-sm mt-2">{formik.errors.location}</div>
          )}

        </div>
      </div>
      <hr className='mt-8' />
      <div className='mt-4'>
        <EditorSaveButton submitted={submitted} isLoading={isLoading} />
      </div>
    </form>
  );
}