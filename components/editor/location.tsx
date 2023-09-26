"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabTitle from "./tab-title";
import { useTransition } from "react";
import EditorSaveButton from "./editor-save-button";
import EditorWrapper from "./editor-container-wrapper";
export default function Location() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    // bedrooms: Yup.number().required('Number of bedrooms is required').min(1, 'Must be at least 1'),
    // bathrooms: Yup.number().required('Number of bathrooms is required').min(1, 'Must be at least 1'),
    // location: Yup.string().required('Street Address is required'),
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
      country: "",
      streetAddress: "",
      city: "",
      region: "",
      postalCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitted(false);
      setIsLoading(true);

      console.log(formData);
      //  form submission logic
      //   const result = await updatePost(values);

      if (result?.error) {
        console.error(result.error);
        setSubmitted(false);
      } else {
        console.log("Post updated successfully:", result);
        setSubmitted(true);
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
      <div>
        <TabTitle
          title="Address Information"
          desc="Address Information regarding your listing (This will not be shown to anyone until 24 hours before check-in)"
        />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium leading-6  text-gray-900"
            >
              Street Address
            </label>
            <input
              type="text"
              name="location"
              id="location"
              className={` w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.location && formik.errors.location
                ? "border-red-500"
                : ""
                }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="mt-2 text-sm text-red-600">
                {formik.errors.location}
              </div>
            )}
          </div>
        </div>
        <hr className="mt-8" />
        <div className="mt-4">
          <EditorSaveButton dirty={formik.dirty} submitted={submitted} isLoading={isLoading} />
        </div>
      </div>
    </EditorWrapper>
  );
}
