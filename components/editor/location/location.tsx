"use client"
// External Libraries
import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// Internal Components and Utilities
import EditorSaveButton from "../editor-save-button";
import EditorWrapper from "../editor-container-wrapper";
import OpenStreetMap from "../../users-sites/open-street-map";
import { updateLocation } from "@/actions/post/editor/location/location-actions";
import EditorToggle from "../editor-toggle";
import EditorAddressAutocomplete from "../editor-address-autocomplete";
import MapViewUpdater from "./map-view-updater";

interface Coordinates {
  lat: number;
  lng: number;
}

export default function Location({ data }: { data: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: parseFloat(data.location.latitude),
    lng: parseFloat(data.location.longitude),
  });

  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: data.location.id,
      locationId: data.location.id,
      address: data.location.address,
      approximate: data.location.approximate,
    },
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
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

  async function handleFormSubmit(values: any) {
    setIsLoading(true);
    setSubmitted(false);
    try {
      const results = await geocodeByAddress(values.address);
      const coords = await getLatLng(results[0]);

      const transformedValues = {
        id: values.id,
        address: values.address ?? data.location.address,
        longitude: coords.lng.toString(),
        latitude: coords.lat.toString(),
        approximate: values.approximate,
      };

      const result = await updateLocation(transformedValues);
      if (result) {
        setCoordinates({
          lat: parseFloat(transformedValues.latitude),
          lng: parseFloat(transformedValues.longitude),
        });
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      setSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <EditorWrapper>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <EditorAddressAutocomplete
            value={formik.values.address}
            onChange={(address: string) => formik.setFieldValue("address", address)}
            onSelect={(address: string) => formik.setFieldValue("address", address)}
            error={formik.touched.address && formik.errors.address}
          />

          <hr />

          <EditorToggle
            value={formik.values.approximate}
            onChange={() => formik.setFieldValue("approximate", !formik.values.approximate)}
            isLoading={isLoading}
          />

          <hr />

          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div>
      </form>
      <OpenStreetMap lat={coordinates.lat} lng={coordinates.lng}>
        <MapViewUpdater lat={coordinates.lat} lng={coordinates.lng} />
      </OpenStreetMap>
    </EditorWrapper>
  );
}
