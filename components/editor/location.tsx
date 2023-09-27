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
export default function Location() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const validationSchema = Yup.object().shape({
    // title: Yup.string().required("Title is required"),
    // description: Yup.string().required("Description is required"),
    // bedrooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    // bathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    location: Yup.string().required("Street Address is required"),
    // streetAddress: Yup.string().required('Street address is required'),
    // city: Yup.string().required('City is required'),
    // region: Yup.string().required('State / Province is required'),
    // postalCode: Yup.string().required('ZIP / Postal code is required'),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      site: "",
      siteId: "",

      location: "",
      // country: "",
      // streetAddress: "",
      // city: "",
      // region: "",
      // postalCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitted(false);
      try {
        const results = await geocodeByAddress(values.location);
        const latLng = await getLatLng(results[0]);

        console.log("Latitude:", latLng.lat);
        console.log("Longitude:", latLng.lng);

        // Continue with form submission logic
        // For example, you can save the latLng values to your backend here
        // and then set submitted and isLoading states accordingly

        setSubmitted(true);
        setIsLoading(false);
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
            htmlFor="location"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Street Address
          </label>
          <PlacesAutocomplete
            value={formik.values.location}
            onChange={(address) => formik.setFieldValue("location", address)}
            onSelect={(address) => formik.setFieldValue("location", address)}
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
                      formik.touched.location && formik.errors.location
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
          {formik.touched.location && formik.errors.location && (
            <div className="mt-2 text-sm text-red-600">
              {formik.errors.location}
            </div>
          )}
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
