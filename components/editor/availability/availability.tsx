"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import TabTitle from "@/components/tab-title";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Toggle } from "@/components/ui/toggle";
import EditorSaveButton from "../editor-save-button";
import EditorWrapper from "../editor-container-wrapper";
import AvailabilityValidationSchema from "@/actions/listing/editor/availability/availability-validation-schema";
import { UpdateAvailabilityRequest } from "@/actions/listing/editor/availability/update-availability-request";
import { updateAvailability } from "@/actions/listing/editor/availability/availability-actions";

type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const dayMapping: Record<DayName, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const preparationTimeOptions = [
  "None",
  "1 night before and after each reservation",
  "2 nights before and after each reservation",
];

const availabilityWindowOptions = [
  "24 months in advance",
  "12 months in advance",
  "9 months in advance",
  "6 months in advance",
  "3 months in advance",
];

interface AvailabilityProps {
  availability: {
    id: string;
    instantBooking: boolean | null;
    minStay: number | null;
    maxStay: number | null;
    advanceNotice: number | null;
    sameDayAdvanceNotice: string | null;
    preparationTime: number | null;
    availabilityWindow: number | null;
    restrictedCheckIn: boolean[] | null;
    restrictedCheckOut: boolean[] | null;
    checkInWindowStart: string | null;
    checkInWindowEnd: string | null;
    checkInTime: string | null;
    checkOutTime: string | null;
  };
}

export default function Availability({ availability }: AvailabilityProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      ...availability
    },
    validationSchema: AvailabilityValidationSchema,
    onSubmit: async () => {
      setSubmitted(false);
      setIsLoading(true);

      const updateRequest: UpdateAvailabilityRequest = {
        id: availability.id,
        instantBooking: availability.instantBooking!,
        minStay: availability.minStay!,
        maxStay: availability.maxStay!,
        advanceNotice: availability.advanceNotice!,
        sameDayAdvanceNotice: availability.sameDayAdvanceNotice!,
        preparationTime: availability.preparationTime!,
        availabilityWindow: availability.availabilityWindow!,
        restrictedCheckIn: availability.restrictedCheckIn!,
        restrictedCheckOut: availability.restrictedCheckOut!,
        checkInWindowStart: availability.checkInWindowStart!,
        checkInWindowEnd: availability.checkInWindowEnd!,
        checkInTime: availability.checkInTime!,
        checkOutTime: availability.checkOutTime!,
      };

      const result = await updateAvailability(updateRequest);
      setIsLoading(false);
      setSubmitted(result ? true : false);
    },
  });

  const toggleRestrictedCheckinDay = (dayName: DayName): void => {
    const idx = dayMapping[dayName];

    // Copy the current array to a new one so we're not mutating Formik's values directly
    const updatedCheckInDays = [...formik.values.restrictedCheckIn!];

    // Toggle the value for the specified day
    updatedCheckInDays[idx] = !updatedCheckInDays[idx];

    // Set the updated array back into Formik's state
    formik.setFieldValue("restrictedCheckIn", updatedCheckInDays);
  };

  const renderRestrictedCheckInDaysToggle = () => {
    return days.map((day) => (
      <Toggle
        data-state={
          formik.values.restrictedCheckIn && formik.values.restrictedCheckIn[dayMapping[day as DayName]]
            ? "on"
            : "off"
        }
        onClick={() => toggleRestrictedCheckinDay(day as DayName)}
        className="mb-2 mr-2"
        key={day}
      >
        {day}
      </Toggle>
    ));
  };


  const renderRestrictedCheckOutDaysToggle = () => {
    /*return (
      days.map(day => <Toggle onClick={() => toggleRestrictedCheckinDay(day as DayName)} className="mr-2 mb-2" key={day}>{day}</Toggle>
      ));*/
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const togglesArray = days.map((day) => (
    <Toggle
      onClick={() => toggleRestrictedCheckinDay(day as DayName)}
      className="mb-2 mr-2"
      key={day}
    >
      {day}
    </Toggle>
  ));
  // formik

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
        <h1 className="text-3xl font-bold">Availability</h1>
        <hr className="mt-4" />
        <div>
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Instant Booking</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                disabled={isLoading}
                className="hidden"
                checked={formik.values.instantBooking!}
                onChange={() =>
                  formik.setFieldValue(
                    "instantBooking",
                    !formik.values.instantBooking,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${formik.values.instantBooking ? "blue-500" : "gray-300"
                  } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.instantBooking
                    ? "translate-x-6"
                    : "translate-x-0"
                    }`}
                ></div>
              </div>
            </label>
          </div>
          <TabTitle title="Trip Length" desc="" />
          <hr className="mt-4" />
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="minStay"
              className="col-span-1 col-start-1 flex items-center"
            >
              Minimum Stay
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-1 sm:col-start-5 md:col-span-1 md:col-start-4">
              <Input
                type="number"
                className="w-full"
                disabled={isLoading}
                id="minStay"
                name="minStay"
                value={formik.values.minStay!}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
          </div>
          {formik.touched.minStay && formik.errors.minStay ? (
            <div className="text-red-600">
              {formik.errors.minStay.toString()}
            </div>
          ) : null}

          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="maxStay"
              className="col-span-1 col-start-1 flex items-center"
            >
              Maximum Stay
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-1 sm:col-start-5 md:col-span-1 md:col-start-4">
              <Input
                type="number"
                className="w-full"
                disabled={isLoading}
                id="maxStay"
                name="maxStay"
                value={formik.values.maxStay!}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
          </div>
          {formik.touched.maxStay && formik.errors.maxStay ? (
            <div className="text-red-600">
              {formik.errors.maxStay.toString()}
            </div>
          ) : null}
          <TabTitle title="Availability" desc="" />
          <hr className="mt-4" />
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="advanceNotice"
              className="col-span-1 col-start-1 flex items-center"
            >
              Advanced Notice
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
              <select
                id="advanceNotice"
                disabled={isLoading}
                name="advanceNotice"
                value={formik.values.advanceNotice!}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border p-2"
              >
                <option value="" disabled>
                  Select Advanced Notice
                </option>
                <option value={0}>Same Day</option>
                <option value={1}>At Least 1 Day</option>
                <option value={2}>At Least 2 Days</option>
                <option value={3}>At Least 3 Days</option>
                <option value={7}>At Least 7 Days</option>
              </select>
            </div>
          </div>
          {formik.touched.advanceNotice && formik.errors.advanceNotice ? (
            <div className="text-red-600">
              {formik.errors.advanceNotice.toString()}
            </div>
          ) : null}

          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="preparationTime"
              className="col-span-1 col-start-1 flex items-center"
            >
              Preparation Time
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
              <select
                id="preparationTime"
                disabled={isLoading}
                name="preparationTime"
                // value={formik.values.preparationTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border p-2"
              >
                <option value="" disabled>
                  Select Preparation Time
                </option>
                {preparationTimeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="availabilityWindow"
              className="col-span-1 col-start-1 flex items-center"
            >
              Availability Window
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
              <select
                id="availabilityWindow"
                disabled={isLoading}
                name="availabilityWindow"
                // value={formik.values.availabilityWindow}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border p-2"
              >
                <option value="" disabled>
                  Select Availability Window
                </option>
                {availabilityWindowOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <TabTitle title="Restricted Days" desc="" />
            <hr className="mt-4" />

            <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
              <Label
                htmlFor="restrictedCheckIn"
                className="col-span-1 col-start-1 flex items-center"
              >
                Restricted Check-In
              </Label>
              <div className="col-span-4 col-start-2 flex flex-wrap items-center">
                {renderRestrictedCheckInDaysToggle()}
              </div>
            </div>
            <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
              <Label
                htmlFor="restrictedCheckOut"
                className="col-span-1 col-start-1 flex items-center"
              >
                Restricted Check-Out
              </Label>
              <div className="col-span-4 col-start-2 flex flex-wrap items-center"></div>
            </div>
          </div>
          <hr className="mb-5" />
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
