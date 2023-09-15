'use client';
import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePropertyPriceInfo } from "@/lib/actions";
import TabTitle from "./tab-title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Toggle } from "@/components/ui/toggle"
import CalendarImportForm from "./calendar-import";
import { CalendarModal } from "./calendar-editor-modal";

const validationSchema = Yup.object().shape({
  price: Yup.number()
    .required('Price per night is required')
    .positive('Price per night must be a positive number'),
  securityDeposit: Yup.number()
    .required('Security Deposit is required')
    .positive('Security Deposit must be a positive number'),
  maxGuests: Yup.number()
    .required('Max guests allowed is required')
    .positive('Max guests allowed must be a positive number'),
  minimumStay: Yup.number()
    .required('Minimum stay required is required')
    .positive('Minimum stay must be a positive number'),
  bedrooms: Yup.number()
    .required('Number of rooms is required')
    .positive('Number of rooms must be a positive number'),
  cleaningFee: Yup.number()
    .required('Cleaning Fee is required')
    .positive('Cleaning Fee must be a positive number'),
});

export default function PricingAvailability({ data }) {
  const id = data['id'];
  const [siteData, setSiteData] = useState(id);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      price: '',
      securityDeposit: '',
      maxGuests: '',
      minimumStay: '',
      bedrooms: '',
      cleaningFee: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setSubmitted(false);
      setIsLoading(true);
      const result = await updatePropertyPriceInfo(values);
      if (result) {
        console.log('Post updated successfully:', result);
        setSubmitted(true);
        setIsLoading(false);
      }
      if (result?.error) {
        console.error(result.error);
      } else {

      }
    },
  });

  const handleBeforeUnload = (e: any) => {
    if (formik.dirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formik.dirty]);
  return (
    <div>
      <TabTitle title="Pricing" desc="" />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="PricePerNight" className="col-span-1 col-start-1 flex items-center">Price Per Night</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">$</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="PricePerNight" className="col-span-1 col-start-1 flex items-center">Weekend Price (fri/sat)</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">$</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <TabTitle title="Discounts" desc="" />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="WeeklyDiscount" className="col-span-1 col-start-1 flex items-center">Weekly</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">%</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="MonthlyDiscount" className="col-span-1 col-start-1 flex items-center">Monthly</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">%</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <TabTitle title="Additional Fees" desc="" />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="CleaningFee" className="col-span-1 col-start-1 flex items-center">Cleaning Fee</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">$</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="PetFee" className="col-span-1 col-start-1 flex items-center">Pet Fee</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">$</span>
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="ExtraGuestFee" className="col-span-1 col-start-1 flex items-center">Extra Guest Fee</Label>
        <div className="col-span-1 col-start-4 flex items-center">
          <span className="mr-2">After</span>
          <Input type="number" className="w-full" />
          <span className="ml-2">Guest(s)</span>
        </div>
        <div className="col-span-1 col-start-5 flex items-center">
          <span className="mr-2">$</span>
          <Input type="number" className="w-full" />
          <span className="ml-2">Per Guest</span>
        </div>
      </div>
      <hr />
      <TabTitle title="Trip Length" desc="" />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="MinimumStay" className="col-span-1 col-start-1 flex items-center">Minimum Stay</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="MaximumStay" className="col-span-1 col-start-1 flex items-center">Maximum Stay</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <TabTitle title="Availability" desc="" />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="AdvancedNotice" className="col-span-1 col-start-1 flex items-center">Advanced Notice</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="SameDayAdvancedNotice" className="col-span-1 col-start-1 flex items-center">Same Day Advanced Notice</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="PreperationTime" className="col-span-1 col-start-1 flex items-center">Preperation Time</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="AvailabilityWindow" className="col-span-1 col-start-1 flex items-center">Availability Window</Label>
        <div className="col-span-1 col-start-5 flex items-center">
          <Input type="number" className="w-full" />
        </div>
      </div>
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="AdvancedNotice" className="col-span-1 col-start-1 flex items-center">Restricted Check-In</Label>
        <div className="col-span-2 col-start-3 flex items-center w-full">
          <Toggle>Monday</Toggle>
          <Toggle>Tuesday</Toggle>
          <Toggle>Wednesday</Toggle>
          <Toggle>Thursday</Toggle>
          <Toggle>Friday</Toggle>
          <Toggle>Saturday</Toggle>
          <Toggle>Sunday</Toggle>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="AdvancedNotice" className="col-span-1 col-start-1 flex items-center">Restricted Check-Out</Label>
        <div className="col-span-2 col-start-3 flex items-center">
          <Toggle>Monday</Toggle>
          <Toggle>Tuesday</Toggle>
          <Toggle>Wednesday</Toggle>
          <Toggle>Thursday</Toggle>
          <Toggle>Friday</Toggle>
          <Toggle>Saturday</Toggle>
          <Toggle>Sunday</Toggle>
        </div>
      </div>
      <hr />
      <TabTitle title="Calendar Sync" desc="" />
      <CalendarImportForm />
      <CalendarModal data={data} />
      <hr />
      <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
        <Label htmlFor="AdvancedNotice" className="col-span-1 col-start-1 flex items-center">Calendar Export</Label>
        <div className="col-span-3 col-start-3 flex items-center relative">
          <Input type="text" className="w-full pr-10" />
          <button
            type="button"
            className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={() => {
              // Implement copy functionality here
              const input = document.querySelector('input[type="text"]');
              if (input) {
                input.select();
                document.execCommand("copy");
              }
            }}
          >
            Copy
          </button>
        </div>
      </div>
      <hr className="mb-5" />
      <div className="flex-auto flex flex-row-reverse">
        <button
          type="submit"
          className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </div>
  );
}
