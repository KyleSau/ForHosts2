"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { amenityDetails } from "@/components/amenities/amenities-data";
import EditorWrapper from "../editor-container-wrapper";
import EditorSaveButton from "../editor-save-button";
import { useState, useEffect, useCallback } from "react";
export default function AmenitySelection({
  staticAmenities,
}: {
  staticAmenities: string[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      selectedAmenityIndexes: [] as number[], // Initialize with an empty array
    },
    validationSchema: Yup.object({
      selectedAmenityIndexes: Yup.array()
        .of(Yup.number())
        .required("Select at least one amenity"),
    }),

    onSubmit: async (values) => {
      // kyle deflate your forehead, and put the new action for posting here
      console.log("Selected Amenity Indexes:", values.selectedAmenityIndexes);
    },
  });

  const toggleAmenity = (index: number) => {
    const selectedAmenityIndexes = formik.values.selectedAmenityIndexes;
    if (selectedAmenityIndexes.includes(index)) {
      formik.setFieldValue(
        "selectedAmenityIndexes",
        selectedAmenityIndexes.filter((i) => i !== index),
      );
    } else {
      formik.setFieldValue("selectedAmenityIndexes", [
        ...selectedAmenityIndexes,
        index,
      ]);
    }
  };
  const handleBeforeUnload = useCallback(
    (e: any) => {
      if (formik.dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [formik.dirty],
  );

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
          <h2 className="mb-4 text-2xl font-bold">Select Amenities:</h2>
          <div className="flex">
            <div className="grid grid-cols-2  gap-4  md:grid-cols-3">
              {staticAmenities.map((amenity, index) => (
                <div
                  key={index}
                  className={`transform cursor-pointer rounded-lg p-4 shadow-lg transition-transform hover:scale-105 ${
                    formik.values.selectedAmenityIndexes.includes(index)
                      ? "bg-blue-200"
                      : ""
                  }`}
                  onClick={() => toggleAmenity(index)}
                >
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={amenityDetails[amenity].icon}
                      className="mb-2 text-4xl"
                    />
                    <p className="text-sm">
                      {amenityDetails[amenity].description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </EditorWrapper>
  );
}
