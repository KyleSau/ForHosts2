"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabTitle from "./tab-title";
import { useTransition } from "react";
import EditorSaveButton from "./editor-save-button";
import EditorWrapper from "./editor-container-wrapper";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updatePost } from "@/lib/actions";
function approximateLocation(lat: number, lng: number, maxOffsetInKm: number) {
  const latRadian = lat * (Math.PI / 180);
  const lngRadian = lng * (Math.PI / 180);
  const earthRadius = 6371;
  const randomDirection = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * maxOffsetInKm;
  const deltaLat = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(latRadian);
  const deltaLng = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(lngRadian);
  const newLat = lat + deltaLat * Math.sin(randomDirection);
  const newLng = lng + deltaLng * Math.cos(randomDirection);

  return { lat: newLat, lng: newLng };
}
export default function Location({data}) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 

  const validationSchema = Yup.object().shape({
    // title: Yup.string().required("Title is required"),
    // description: Yup.string().required("Description is required"),
    // bedrooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    // bathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    street: Yup.string().required("Street Address is required"),
    // streetAddress: Yup.string().required('Street address is required'),
    // city: Yup.string().required('City is required'),
    // region: Yup.string().required('State / Province is required'),
    // postalCode: Yup.string().required('ZIP / Postal code is required'),
  });
  const locData = data.location;
  const formik = useFormik({
    initialValues: {
      id: data.id,
      locationId: locData.id,
      radius: locData.radius,
      street: locData.street,
      // country: "",
      // streetAddress: "",
      // city: "",
      // region: "",
      // postalCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmitted(false);
      try {
        const results = await geocodeByAddress(values.street);
        const latLng = await getLatLng(results[0]);
        const proximity = approximateLocation(latLng.lat, latLng.lng, values.radius);
        const transformedValues = {
          id: values.id,
          location: {
            street: values.street,
            radius: values.radius,
            longitude: proximity.lng.toString(),
            latitude: proximity.lat.toString(),
          },
        };
       
  
        const result = await updatePost(transformedValues);
        if (result) {
          console.log("Post updated successfully:", result);
          setSubmitted(true);
          setIsLoading(false);
        }

       
      } catch (error) {
        console.error("Error geocoding address:", error);
        setSubmitted(false);
        setIsLoading(false);
      }
    },
  });
  const handleBeforeUnload = (e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
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
        <div className="space-y-4">
          <label
            htmlFor="street"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Street Address
          </label>
          <PlacesAutocomplete
            value={formik.values.street}
            onChange={(address) => formik.setFieldValue("street", address)}
            onSelect={(address) => formik.setFieldValue("street", address)}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Search for an address...",
                    className: `w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      formik.touched.street && formik.errors.street
                        ? "border-red-500"
                        : ""
                    }`,
                  })}
                />
                <div>
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                        })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          {formik.touched.street && formik.errors.street && (
            <div className="mt-2 text-sm text-red-600">
              {formik.errors.street}
            </div>
          )}
          <hr/>
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="radius"
              className="col-span-1 col-start-1 flex items-center"
            >
              How far out should we randomize the location of your property until someone has booked (in miles)
            </Label>
            <div className="col-span-1 col-start-3 flex max-w-[200px] items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
           
              <Input
                type="number"
                className="w-full"
                id="radius"
                name="radius"
                value={formik.values.radius}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
          </div>
          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div>
      </form>
    </EditorWrapper>
  );
}
