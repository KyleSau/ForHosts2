"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { updatePost } from '@/lib/actions';
import LoadingDots from "../icons/loading-dots";
import { toast } from "sonner";
import { useTransition } from "react";
import { updatePostMetadata } from '@/lib/actions';
import { ExternalLink } from 'lucide-react';
import clsx from "clsx";
import EditorWrapper from './editor-container-wrapper';
import AmenityDataTable from '../amenities/amenity-data-table';
import BedroomList from '../bedroom-list';
import IncrementDecrementButton from '../increment-decrement-buttons';
import { useDebounce } from 'use-debounce';
import { Label } from '../ui/label';
import { ListingTypesArray, PlaceTypesArray, PropertyTypesArray } from './place-utils';
import PlaceTypes from './place-types';
import AmenityEditor from '../amenities/amenity-editor';

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
  });

  const formik = useFormik({
    initialValues: {
      maxGuests: data.propertyDetails.maxGuests,
      maxPets: data.propertyDetails.maxPets,
      totalBedrooms: data.propertyDetails.totalBedrooms,
      bathrooms: data.propertyDetails.bathrooms,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitted(false);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("published", String(!data.published));
      const updateRequest = {
        id: data.id,
        propertyDetails: {
          maxGuests: values.maxGuests,
          maxPets: values.maxPets,
          totalBedrooms: values.totalBedrooms,
          bathrooms: values.bathrooms
        }
      }
      const result = await updatePost(updateRequest);
      if (result?.error) {
        console.error(result.error);
        setSubmitted(false);
      } else {
        console.log('Post updated successfully:', result);
        setSubmitted(true);
        setIsLoading(false);
      }
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
    <EditorWrapper>
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
              formData.append("published", String(!data.published));
              startTransitionPublishing(async () => {
                await updatePostMetadata(formData, data.id, "published").then(
                  () => {
                    toast.success(
                      `Successfully ${data.published ? "unpublished" : "published"} your post.`
                    );
                  }
                );
              });
            }}
            className={clsx(
              "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
              isPendingPublishing
                ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                : "border border-green-600 bg-green-600 hover:bg-green-500 text-white hover:bg-sitecolor active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200",
            )}
            disabled={isPendingPublishing}
          >
            {isPendingPublishing ? (
              <LoadingDots />
            ) : (
              <p>{data.published ? "Unpublish" : "Publish"}</p>
            )}
          </button>
        </div>
        <TabTitle title="Facilities" desc="Choose the amount for various facilities in your property" />
        <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8">

          <label htmlFor="maxGuests" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Listing Type
          </label>
          <div className='flex flex-col col-start-2 col-span-2 sm:col-start-3 sm:col-span-1'>
            <select
              id="listingType"
              name="listingType"
              value={formik.values.listingType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border p-2"
            >
              <option value="" disabled>
                Select Listing Type
              </option>
              {ListingTypesArray.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="propertyType" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Property Type
          </label>
          <div className='flex flex-col justify-end sm:col-span-2 sm:col-start-2 col-start-3'>
            <select
              id="propertyType"
              name="propertyType"
              value={formik.values.propertyType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border p-2"
            >
              <option value="" disabled>
                Select Property Type
              </option>
              {PropertyTypesArray.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="maxGuests" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Place Type
          </label>
          <div className='flex flex-col col-start-2'>
            <select
              id="placeType"
              name="placeType"
              value={formik.values.placeType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="max-w-[140px] rounded-md border p-2"
            >
              <option value="" disabled>
                Select Place Type
              </option>
              {PlaceTypesArray.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="maxGuests" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Max Guests
          </label>
          <div className='flex flex-col col-start-2'>
            <IncrementDecrementButton increment={() => (formik.setFieldValue("maxGuests", formik.values.maxGuests + 1))} decrement={() => (formik.setFieldValue("maxGuests", formik.values.maxGuests - 1))} value={formik.values.maxGuests} />
            {formik.touched.maxGuests && formik.errors.maxGuests && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.maxGuests}</div>
            )}
          </div>

          <label htmlFor="maxPets" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Max Pets (disabled if pets not allowed)
          </label>
          <div className='flex flex-col col-start-2'>
            <IncrementDecrementButton increment={() => (formik.setFieldValue("maxPets", formik.values.maxPets + 1))} decrement={() => (formik.setFieldValue("maxPets", formik.values.maxPets - 1))} value={formik.values.maxPets} />
            {formik.touched.maxPets && formik.errors.maxPets && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.maxPets}</div>
            )}
          </div>

          <label htmlFor="bedrooms" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Number of Bedrooms
          </label>
          <div className='flex flex-col col-start-2'>
            <IncrementDecrementButton increment={() => (formik.setFieldValue("totalBedrooms", formik.values.totalBedrooms + 1))} decrement={() => (formik.setFieldValue("totalBedrooms", formik.values.totalBedrooms - 1))} value={formik.values.totalBedrooms} />
            {formik.touched.bedrooms && formik.errors.bedrooms && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.bedrooms}</div>
            )}
          </div>

          <label htmlFor="bathrooms" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
            Number of Bathrooms
          </label>
          <div className='flex flex-col col-start-2 mb-5'>
            <IncrementDecrementButton increment={() => (formik.setFieldValue("bathrooms", formik.values.bathrooms + 1))} decrement={() => (formik.setFieldValue("bathrooms", formik.values.bathrooms - 1))} value={formik.values.bathrooms} />
            {formik.touched.bathrooms && formik.errors.bathrooms && (
              <div className="text-red-600 text-sm mt-2">{formik.errors.bathrooms}</div>
            )}
          </div>
        </div>
        <BedroomList key={formik.values.totalBedrooms} totalBedrooms={formik.values.totalBedrooms} />
        <AmenityDataTable />
        {/* <BedroomList totalBedrooms={formik.values.totalBedrooms} /> */}
      </form>
    </EditorWrapper >
  );
}
