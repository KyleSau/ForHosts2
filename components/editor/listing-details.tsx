"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { getBedrooms, updatePost } from '@/lib/actions';
// import LoadingDots from "../icons/loading-dots";
// import { toast } from "sonner";
// import { useTransition } from "react";
// import { ExternalLink } from 'lucide-react';
// import clsx from "clsx";
import EditorWrapper from './editor-container-wrapper';
// import AmenityDataTable from '../amenities/amenity-data-table';
import IncrementDecrementButton from '../increment-decrement-buttons';
// import { useDebounce } from 'use-debounce';
// import { Label } from '../ui/label';
import { ListingTypesArray, PlaceTypesArray, PropertyTypesArray } from './place-utils';
// import PlaceTypes from './place-types';
// import AmenityEditor from '../amenities/amenity-editor';
// import BedroomList2 from '../bedroom-list2';
import BedroomManager from './bedroom-manager';

export default function ListingDetails({ data, bedrooms }) {

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bedroomData, setBedroomData] = useState(bedrooms);

  const validationSchema = Yup.object().shape({

  });

  const formik = useFormik({
    initialValues: {
      listingType: data.propertyDetails.listingType,
      placeType: data.propertyDetails.placeType,
      propertyType: data.propertyDetails.propertyType,
      maxGuests: data.propertyDetails.maxGuests,
      maxPets: data.propertyDetails.maxPets,
      totalBedrooms: data.propertyDetails.totalBedrooms,
      bathrooms: data.propertyDetails.bathrooms,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      setSubmitted(false);
      setIsLoading(true);

      const updateRequest = {
        id: data.id,
        propertyDetails: {
          maxGuests: values.maxGuests,
          maxPets: values.maxPets,
          totalBedrooms: values.totalBedrooms,
          bathrooms: values.bathrooms,
          listingType: values.listingType,
          placeType: values.placeType,
          propertyType: values.propertyType,
        }
      }

      const result = await updatePost(updateRequest);
      if (result?.error) {
        console.error(result.error);
        setSubmitted(false);
      } else {
        console.log('Post updated successfully:', result);
        const bdrmData = await getBedrooms(data.id);
        setBedroomData(bdrmData);
        setSubmitted(true);
        setIsLoading(false);
        // setUpdateBedrooms(true);
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
        <div>

          <TabTitle title="Facilities" desc="Choose the amount for various facilities in your property" />
          <hr />
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <label htmlFor="listingType" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
              Listing Type
            </label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
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
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
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

            <label htmlFor="placeType" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
              Place Type
            </label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
              <select
                id="placeType"
                name="placeType"
                value={formik.values.placeType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border p-2"
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
            <div className='flex flex-col col-start-3 md:col-start-4'>
            <IncrementDecrementButton
  value={formik.values.maxGuests}
  setValue={(newValue) => formik.setFieldValue('maxGuests', newValue)}
              />
              {formik.touched.maxGuests && formik.errors.maxGuests && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.maxGuests}</div>
              )}
            </div>

            <label htmlFor="maxPets" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
              Max Pets (disabled if pets not allowed)
            </label>
            <div className='flex flex-col col-start-3 md:col-start-4'>
              
            <IncrementDecrementButton
  value={formik.values.maxPets}
  setValue={(newValue) => formik.setFieldValue('maxPets', newValue)}
              />

              {formik.touched.maxPets && formik.errors.maxPets && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.maxPets}</div>
              )}
            </div>

            <label htmlFor="totalBedrooms" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
              Number of Bedrooms
            </label>
            <div className='flex flex-col col-start-3 md:col-start-4'>
            <IncrementDecrementButton
  value={formik.values.totalBedrooms}
  setValue={(newValue) => formik.setFieldValue('totalBedrooms', newValue)}
              />
              {formik.touched.totalBedrooms && formik.errors.totalBedrooms && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.totalBedrooms}</div>
              )}
            </div>

            <label htmlFor="bathrooms" className="col-start-1 block text-sm font-medium leading-6 text-gray-900">
              Number of Bathrooms
            </label>
            <div className='flex flex-col col-start-3 md:col-start-4 mb-5'>
            <IncrementDecrementButton
  value={formik.values.bathrooms}
  setValue={(newValue) => formik.setFieldValue('bathrooms', newValue)}
              />
              {formik.touched.bathrooms && formik.errors.bathrooms && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.bathrooms}</div>
              )}
            </div>
          </div>
          {/* <BedroomList key={formik.values.totalBedrooms} postId={data.id} totalBedrooms={formik.values.totalBedrooms} bedrooms={bedrooms} /> */}
          {/* <AmenityDataTable /> */}
          {/* <BedroomList totalBedrooms={formik.values.totalBedrooms} /> */}
          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div>
      </form>

      <BedroomManager key={data.id} totalBedrooms={formik.values.totalBedrooms} postId={data.id} bedrooms={bedroomData} />
      {/* <BedroomList2 key={data.id} bedrooms={bedroomData} postId={data.id} /> */}
      {/* <BedroomManager bedroomData={bedroomData} postId={data.id} totalBedrooms={formik.values.totalBedrooms} /> */}

    </EditorWrapper >
  );
}
