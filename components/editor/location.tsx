"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditorSaveButton from "./editor-save-button";
import EditorWrapper from "./editor-container-wrapper";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { PlusCircle, MinusCircle, XCircle } from "lucide-react";
import { updatePost } from "@/lib/actions";
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/users-sites/open-street-map'), {
  ssr: false,
})

export default function Location({ data }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
  });
  const locData = data.location;
  const formik = useFormik({
    initialValues: {
      id: data.id,
      locationId: locData.id,
      radius: locData.radius,
      address: locData.address,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmitted(false);
      try {
        const results = await geocodeByAddress(values.address);
        const coordinates = await getLatLng(results[0]);
        // const proximity = approximateLocation(coordinates.lat, coordinates.lng, values.radius);
        // const latLng = await getLatLng(results[0]);
        // const proximity = approximateLocation(
        //   latLng.lat,
        //   latLng.lng,
        //   values.radius,
        // );
        const transformedValues = {
          id: values.id,
          location: {
            address: values.address ?? locData.address,
            radius: values.radius ?? locData.radius,
            longitude: coordinates.lng.toString(),
            latitude: coordinates.lat.toString(),
          },
        };

        console.log('transformedValues: ', transformedValues);

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
  const incrementRadius = () => {
    formik.setFieldValue("radius", formik.values.radius + 1);
  };

  const decrementRadius = () => {
    formik.setFieldValue("radius", Math.max(0, formik.values.radius - 1));
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
            htmlFor="address"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Address
          </label>
          <PlacesAutocomplete
            value={formik.values.address}
            onChange={(address) => formik.setFieldValue("address", address)}
            onSelect={(address) => formik.setFieldValue("address", address)}
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
                    className: `w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.address && formik.errors.address
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
          {formik.touched.address && formik.errors.address && (
            <div className="mt-2 text-sm text-red-600">
              {formik.errors.address}
            </div>
          )}
          <hr />
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="radius"
              className="col-span-1 col-start-1 flex items-center"
            >
              How far out should we randomize the location of your property
              until someone has booked (in miles)
            </Label>
            <div className="col-span-2 flex items-center justify-end">
              <div className="flex items-center space-x-2 ml-auto"> {/* Add ml-auto here */}
                <button
                  type="button"
                  onClick={decrementRadius}
                  className={`focus:outline-none ${!formik.values.radius && "text-gray-400"
                    }`}
                >
                  <MinusCircle strokeWidth={1} size={34} />
                </button>
                <span className="pl-4 pr-4 text-gray-700">
                  {formik.values.radius || 0}
                </span>
                <button
                  type="button"
                  onClick={incrementRadius}
                  className="ml-5 text-gray-700 focus:outline-none"
                >
                  <PlusCircle strokeWidth={1} size={34} />
                </button>

              </div>

            </div>
          </div>
          <hr />
          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div >
      </form >
      <Map lat={data.location.latitude} lng={data.location.longitude} />
    </EditorWrapper >
  );
}
