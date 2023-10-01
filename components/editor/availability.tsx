"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePost } from "@/lib/actions";
import TabTitle from "./tab-title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Toggle } from "@/components/ui/toggle";
import EditorSaveButton from "./editor-save-button";
import EditorWrapper from "./editor-container-wrapper";

type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const dayMapping: Record<DayName, number> = {
  "Monday": 0,
  "Tuesday": 1,
  "Wednesday": 2,
  "Thursday": 3,
  "Friday": 4,
  "Saturday": 5,
  "Sunday": 6
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
  advanceNotice: Yup.number().min(0)
    .required("Advance notice is required"),
  // sameDayAdvanceNotice: Yup.number()
  //   .required("Same-day advance notice is required")
  //   .positive("Same-day advance notice must be a positive number"),
  // preparationTime: Yup.number()
  //   .required("Preparation time is required")
  //   .positive("Preparation time must be a positive number"),
  // availabilityWindow: Yup.number()
  //   .required("Availability window is required")
  //   .positive("Availability window must be a positive number"),
  // restrictedCheckIn: Yup.boolean().required("Restricted check-in is required"),
  // restrictedCheckOut: Yup.boolean().required("Restricted check-out is required"),
  // checkInWindowStart: Yup.string().required("Check-in window start time is required"),
  // checkInWindowEnd: Yup.string().required("Check-in window end time is required"),
  // checkInTime: Yup.string().required("Check-in time is required"),
  // checkOutTime: Yup.string().required("Check-out time is required"),
});

const daysToBooleanArray = (daysArray: number[]) => {
  const week = new Array(7).fill(false);
  daysArray.forEach(day => {
    week[day] = true;
  });
  return week;
}

export default function Availability({ data }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const availability = data.availability;

  // const [restrictedCheckIn, setRestrictedCheckIn] = useState(data.availability.restrictedCheckIn);
  // const [restrictedCheckOut, setRestrictedCheckOut] = useState(data.availability.restrictedCheckOut);

  const formik = useFormik({
    initialValues: {
      id: data.id,
      availabilityId: availability.id,
      instantBooking: availability.instantBooking,
      minStay: availability.minStay,
      maxStay: availability.maxStay,
      advanceNotice: availability.advanceNotice,
      restrictedCheckIn: availability.restrictedCheckIn,
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
      console.log("values" + JSON.stringify(values))
      setSubmitted(false);
      setIsLoading(true);
      const transformedValues = {
        id: values.id,
        availability: {
          instantBooking: values.instantBooking,
          minStay: values.minStay,
          maxStay: values.maxStay,
          advanceNotice: values.advanceNotice,
          restrictedCheckIn: values.restrictedCheckIn,
          restrictedCheckOut: values.restrictedCheckOut,
        },
      };
      alert(JSON.stringify(values.restrictedCheckIn));
      debugger;
      const result = await updatePost(transformedValues);
      if (result) {
        console.log("Post updated successfully:", result);
        setSubmitted(true);
        setIsLoading(false);
        // formik.resetForm({ values: transformedValues });
      }
      if (result?.error) {
        console.error(result.error);
      } else {
        console.log(values);
      }
    },
  });

  // const toggleRestrictedCheckinDay = (dayName: DayName): void => {
  //   console.log('day: ' + dayName);
  //   const dayIndex = dayMapping[dayName];
  //   setRestrictedCheckIn(prevState => {
  //     const updatedState = [...prevState];
  //     updatedState[dayIndex] = !updatedState[dayIndex];
  //     return updatedState;
  //   });
  // }
  // const toggleRestrictedCheckinDay = (dayName: DayName): void => {
  //   const idx = dayMapping[dayName];
  //   const arr = formik.values.restrictedCheckIn;
  //   arr[idx] = !arr[idx];
  //   formik.setFieldValue("restrictedCheckIn", arr);
  //   return arr;
  //   debugger;
  //   // formik.setFieldValue("restrictedCheckIn", prevState => {
  //   //   const updatedState = [...prevState];
  //   //   updatedState[dayIndex] = !updatedState[dayIndex];
  //   //   return updatedState;
  //   // });
  // };

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
    return (
      days.map(day => (
        <Toggle
          data-state={formik.values.restrictedCheckIn[dayMapping[day]] ? "on" : "off"}
          // value={formik.values.restrictedCheckIn[dayMapping[day]]}
          onClick={() => toggleRestrictedCheckinDay(day as DayName)}
          className="mr-2 mb-2"
          key={day}
        >
          {day}
        </Toggle>
      ))
    );
  }

  const renderRestrictedCheckOutDaysToggle = () => {
    /*return (
      days.map(day => <Toggle onClick={() => toggleRestrictedCheckinDay(day as DayName)} className="mr-2 mb-2" key={day}>{day}</Toggle>
      ));*/
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const togglesArray = days.map(day => <Toggle onClick={() => toggleRestrictedCheckinDay(day as DayName)} className="mr-2 mb-2" key={day}>{day}</Toggle>);
  // formik

  const handleBeforeUnload = (e) => {
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
      {/* {JSON.stringify(avaData)} */}
      <form onSubmit={formik.handleSubmit}>
        <h1 className="font-bold text-3xl">Availability</h1>
        {/* <TabTitle title="Availability" desc="Information regarding availability of your property" /> */}
        <hr className="mt-4" />
        <div>
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Instant Booking</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="hidden"
                checked={formik.values.instantBooking}
                onChange={() =>
                  formik.setFieldValue("instantBooking", !formik.values.instantBooking)
                }
              />
              <div
                className={`h-6 w-12 bg-${formik.values.instantBooking ? "blue-500" : "gray-300"
                  } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.instantBooking ? "translate-x-6" : "translate-x-0"
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
            <div className="text-red-600">{formik.errors.minStay}</div>
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
            <div className="text-red-600">{formik.errors.maxStay}</div>
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
            <div className="text-red-600">{formik.errors.advanceNotice}</div>
          ) : null}
          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="sameDayAdvancedNotice"
              className="col-span-1 col-start-1 flex items-center"
            >
              Same Day Advanced Notice
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
              <select
                id="sameDayAdvanceNotice"
                name="sameDayAdvanceNotice"
                // value={formik.values.sameDayAdvancedNotice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border p-2"
              >
                <option value="" disabled>
                  Select Same Day Advanced Notice
                </option>
                {hourAN.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formik.touched.sameDayAdvanceNotice &&
            formik.errors.sameDayAdvanceNotice ? (
            <div className="text-red-600">
              {formik.errors.sameDayAdvanceNotice}
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
            {/* {JSON.stringify(restrictedCheckIn)} */}
            <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
              <Label
                htmlFor="restrictedCheckIn"
                className="col-span-1 col-start-1 flex items-center"
              >
                Restricted Check-In
              </Label>
              <div className="col-span-4 col-start-2 flex flex-wrap items-center">
                {/* Create custom Toggle component or use your own implementation */}
                {/* {togglesArray} */}
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
              <div className="col-span-4 col-start-2 flex flex-wrap items-center">
                {/* Create custom Toggle component or use your own implementation */}
                {/* {togglesArray} */}
              </div>
            </div>
          </div>
          <hr className="mb-5" />
          <EditorSaveButton dirty={formik.dirty} submitted={submitted} isLoading={isLoading} />

        </div>

      </form>
    </EditorWrapper>
  );
}
