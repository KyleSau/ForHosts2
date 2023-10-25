"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditorSaveButton from "../editor-save-button";
import EditorWrapper from "../editor-container-wrapper";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Label } from "../../ui/label";
import IncrementDecrementButton from "../increment-decrement-button";
// import { updatePost } from "@/lib/actions";
import OpenStreetMap from "../../users-sites/open-street-map";
import { useMap, Circle } from "react-leaflet";
import { updateLocation } from "@/actions/post/editor/location/location-actions";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapViewUpdaterProps {
  coordinates: Coordinates;
}
interface LocationData {
  id: string; // Assuming that 'id' is a number
  location: {
    id: string; // Assuming 'id' within 'location' is a number
    radius: number; // Assuming 'radius' is a number
    address: string; // Assuming 'address' is a string
    latitude: string; // Assuming 'latitude' is a string
    longitude: string; // Assuming 'longitude' is a string
  };
  // Add more properties as needed
}

function MapViewUpdater({ coordinates }: MapViewUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      map.setView(coordinates, 12);
    }
  }, [coordinates, map]);

  return <Circle center={[coordinates.lat, coordinates.lng]} radius={1000} />;
}

export default function Location({ data }: { data: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: parseFloat(data.location.latitude),
    lng: parseFloat(data.location.longitude),
  });

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
  });
  const locData = data.location;
  const formik = useFormik({
    initialValues: {
      id: data.location.id,
      locationId: locData.id,
      address: locData.address,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmitted(false);
      try {
        const results = await geocodeByAddress(values.address);
        const coordinates = await getLatLng(results[0]);

        // this will follow UpdateLocationRequest type
        const transformedValues = {
          id: values.id,
          address: values.address ?? locData.address,
          longitude: coordinates.lng.toString(),
          latitude: coordinates.lat.toString(),
        };

        console.log("transformedValues: ", transformedValues);

        const result = await updateLocation(transformedValues as any);
        if (result) {
          // force a rerender
          console.log("Post updated successfully:", result);
          setCoordinates({
            lat: parseFloat(transformedValues.latitude),
            lng: parseFloat(transformedValues.longitude),
          });

          console.log("new coordinates: ", JSON.stringify(coordinates));
          // map.setView(coordinates, 12);
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

  const handleBeforeUnload = useCallback((e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  }, [formik.dirty]);

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
                    className: `pl-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.address && formik.errors.address
                      ? "border-red-500"
                      : ""
                      }`,
                  })}
                />
                <div>
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active
                      ? "suggestion-item--active cursor-pointer bg-gray-200"
                      : "suggestion-item cursor-pointer";

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                        })}
                        key={suggestion.id}
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
              {formik.errors.address.toString()}
            </div>
          )}

          <hr />
          <div className="mb-5 mt-5 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="radius"
              className="text-md col-span-1 col-start-1 flex items-center leading-tight tracking-tighter text-gray-600"
            >
            </Label>

            <div className="grid grid-cols-2 items-center">
              <div className="col-start-1 flex">Approximate Location</div>
              <div className="col-start-2 flex justify-end">

              </div>
            </div>
          </div>
          <hr />
          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div>
      </form>
      Coordinates: {JSON.stringify(coordinates)}
      {JSON.stringify(data)}
      <OpenStreetMap lat={coordinates.lat} lng={coordinates.lng}>
        <MapViewUpdater coordinates={coordinates} />
      </OpenStreetMap>
    </EditorWrapper>
  );
}
