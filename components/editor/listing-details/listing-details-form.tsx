"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import TabTitle from "@/components/tab-title";
import EditorSaveButton from "../editor-save-button";
import EditorWrapper from "../editor-container-wrapper";
import {
  ListingTypesArray,
  PlaceTypesArray,
  PropertyTypesArray,
} from "./place-utils";
import { UpdatePropertyDetailsRequest } from "@/actions/post/editor/property-details/update-property-details-request";
import { updatePropertyDetails } from "@/actions/post/editor/property-details/property-details-actions";
import PropertyDetailsValidationSchema from "@/actions/post/editor/property-details/property-details-valdiation-schema";
import ListingDetailsSelect from "../editor-select";
import ListingDetailsIncrement from "../editor-increment";

interface ListingDetailsProps {
  propertyDetails: {
    id: string;
    listingType: string | null;
    placeType: string | null;
    propertyType: string | null;
    maxGuests: number | null;
    maxPets: number | null;
    totalBedrooms: number | null;
    bathrooms: number | null;
  };
}

export default function ListingDetailsForm({ propertyDetails }: ListingDetailsProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      ...propertyDetails
    },
    validationSchema: PropertyDetailsValidationSchema,
    onSubmit: async () => {
      setSubmitted(false);
      setIsLoading(true);

      const updateRequest: UpdatePropertyDetailsRequest = {
        id: propertyDetails.id,
        listingType: propertyDetails.listingType!,
        placeType: propertyDetails.placeType!,
        propertyType: propertyDetails.propertyType!,
        maxGuests: propertyDetails.maxGuests!,
        maxPets: propertyDetails.maxPets!,
        totalBedrooms: propertyDetails.totalBedrooms!,
        bathrooms: propertyDetails.bathrooms!
      };

      const result = await updatePropertyDetails(updateRequest);
      setIsLoading(false);
      setSubmitted(result ? true : false);
    },

  });

  const handleBeforeUnload = useCallback((e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  }, [formik.dirty]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  return (
    <EditorWrapper>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TabTitle title="Facilities" desc="Choose the amount for various facilities in your property" />
          <hr />
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <ListingDetailsSelect formik={formik} label="Listing Type" name="listingType" options={ListingTypesArray} />
            <ListingDetailsSelect formik={formik} label="Property Type" name="propertyType" options={PropertyTypesArray} />
            <ListingDetailsSelect formik={formik} label="Place Type" name="placeType" options={PlaceTypesArray} />
            <ListingDetailsIncrement formik={formik} label="Max Guests" name="maxGuests" />
            <ListingDetailsIncrement formik={formik} label="Max Pets" name="maxPets" />
            <ListingDetailsIncrement formik={formik} label="Number of Bedrooms" name="totalBedrooms" />
            <ListingDetailsIncrement formik={formik} label="Number of Bathrooms" name="bathrooms" />
          </div>
          <EditorSaveButton dirty={formik.dirty} submitted={submitted} isLoading={isLoading} />
        </div>
      </form>
    </EditorWrapper>
  );
}

