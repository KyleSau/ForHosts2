"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePost } from "@/lib/actions";
import TabTitle from "@/components/tab-title";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Toggle } from "@/components/ui/toggle";
import EditorSaveButton from "../editor-save-button";
import EditorWrapper from "../editor-container-wrapper";
import { toast } from "sonner";

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

const hourAN = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
];

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

const validationSchema = Yup.object().shape({
  minStay: Yup.number()
    .required("Minimum stay is required")
    .positive("Minimum stay must be a positive number"),
  maxStay: Yup.number()
    .required("Maximum stay is required")
    .positive("Maximum stay must be a positive number"),
  advanceNotice: Yup.number().min(0).required("Advance notice is required"),
});

const daysToBooleanArray = (daysArray: number[]) => {
  const week = new Array(7).fill(false);
  daysArray.forEach((day) => {
    week[day] = true;
  });
  return week;
};

export default function Availability({ data }: { data: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [restrictedCheckIn, setRestrictedCheckIn] = useState(data.availability.restrictedCheckIn);
  // const [restrictedCheckOut, setRestrictedCheckOut] = useState(data.availability.restrictedCheckOut);
  const availability = data.availability;
  const handleSubmittedChange = (newSubmitted: boolean) => {
    setSubmitted(newSubmitted);
  };

  const formik = useFormik({
    initialValues: {
      id: data.id,
      availabilityId: availability.id,
      instantBooking: availability.instantBooking,
      minStay: availability.minStay,
      maxStay: availability.maxStay,
      advanceNotice: availability.advanceNotice,
      restrictedCheckIn: availability.restrictedCheckIn, // Initialize with an empty array if it's undefined
      restrictedCheckOut: availability.restrictedCheckOut,
      // sameDayAdvanceNotice: data.sameDayAdvanceNotice,
      // preparationTime: data.preparationTime,
      // availabilityWindow: data.availabilityWindow,
      // restrictedCheckIn: data.restrictedCheckIn,
      // restrictedCheckOut: data.restrictedCheckOut,
      // checkInWindowStart: data.checkInWindowStart,
      // checkInWindowEnd: data.checkInWindowEnd,
      // checkInTime: data.checkInTime,
      // checkOutTime: data.checkOutTime,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values" + JSON.stringify(values));
      setSubmitted(false);
      setIsLoading(true);
      const transformedValues = {
        id: values.id,
        availability: {
          instantBooking: values.instantBooking,
          minStay: values.minStay,
          maxStay: values.maxStay,
          advanceNotice: parseInt(values.advanceNotice),
          restrictedCheckIn: values.restrictedCheckIn,
          restrictedCheckOut: values.restrictedCheckOut,
        },
      };

      const result = await updatePost(transformedValues as any);
      if (result) {
        console.log("Post updated successfully:", result);
        setSubmitted(true);
        setIsLoading(false);
        toast.success(`Your data has been sucessfully saved! `);
        setTimeout(() => {
          setSubmitted(false);
          const resetValues = {
            ...values, // Spread the transformedValues
            id: formik.initialValues.id, // Include the 'id' from initialValues
          };
          formik.resetForm({ values: resetValues });
        }, 2000);
      }
      if (!result) {
        console.error("error");
      } else {
        console.log(values);
      }
    },
  });

  const toggleRestrictedCheckinDay = (dayName: DayName): void => {
    const idx = dayMapping[dayName];

    // Copy the current array to a new one so we're not mutating Formik's values directly
    const updatedCheckInDays = [...formik.values.restrictedCheckIn];

    // Toggle the value for the specified day
    updatedCheckInDays[idx] = !updatedCheckInDays[idx];

    // Set the updated array back into Formik's state
    formik.setFieldValue("restrictedCheckIn", updatedCheckInDays);
  };

  const renderRestrictedCheckInDaysToggle = () => {
    return days.map((day) => (
      <Toggle
        data-state={
          formik.values.restrictedCheckIn[dayMapping[day as DayName]]
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

  const handleBeforeUnload = (e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    setSubmitted(false);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formik.dirty]);

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
                checked={formik.values.instantBooking}
                onChange={() =>
                  formik.setFieldValue(
                    "instantBooking",
                    !formik.values.instantBooking,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${
                  formik.values.instantBooking ? "blue-500" : "gray-300"
                } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${
                    formik.values.instantBooking
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
                value={formik.values.minStay}
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
                value={formik.values.maxStay}
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
                value={formik.values.advanceNotice}
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
