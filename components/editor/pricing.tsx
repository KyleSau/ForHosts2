import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePropertyPriceInfo } from "@/lib/actions";
import TabTitle from "./tab-title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import EditorSaveButton from "./editor-save-button";
import AmenityEditor from "../amenities/amenity-editor";
import AmenityDataTable from "../amenities/amenity-data-table";

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
  price: Yup.number()
    .required("Price per night is required")
    .positive("Price per night must be a positive number"),
  securityDeposit: Yup.number()
    .required("Security Deposit is required")
    .positive("Security Deposit must be a positive number"),
  minStay: Yup.number()
    .required("Minimum stay required is required")
    .positive("Minimum stay must be a positive number"),
  cleaningFee: Yup.number()
    .required("Cleaning Fee is required")
    .positive("Cleaning Fee must be a positive number"),
  // weekendPrice: Yup.number().positive("Weekend Price must be a positive number"),
  // weeklyDiscount: Yup.number().positive("Weekly Discount must be a positive number"),
  // monthlyDiscount: Yup.number().positive("Monthly Discount must be a positive number"),
  // petFee: Yup.number().positive("Pet Fee must be a positive number"),
  // extraGuestFee: Yup.object({
  //   guests: Yup.number()

  //     .positive("Guest count must be a positive number"),
  //   fee: Yup.number()

  //     .positive("Fee amount must be a positive number"),
  // }),
  // maximumStay: Yup.number()
  //   .required("Maximum stay is required")
  //   .positive("Maximum stay must be a positive number"),
  // advancedNotice: Yup.string().required("Advanced Notice is required"),
  // sameDayAdvancedNotice: Yup.string().required("Same Day Advanced Notice is required"),
  // preparationTime: Yup.string().required("Preparation Time is required"),
  // availabilityWindow: Yup.string().required("Availability Window is required"),
});

export default function Pricing({ data }: any) {
  const id = data["id"];
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: id,
      site: data.site,
      siteId: data.siteId,
      price: "",
      securityDeposit: "",
      minStay: "",
      cleaningFee: "",
      // weekendPrice: "",
      // weeklyDiscount: "",
      // monthlyDiscount: "",
      // petFee: "",
      // extraGuestFee: {
      //   guests: "",
      //   fee: "",
      // },
      // maximumStay: "",
      // advancedNotice: "",
      // sameDayAdvancedNotice: "",
      // preparationTime: "",
      // availabilityWindow: "",
      // Add initial values for other form fields here
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setSubmitted(false);
      setIsLoading(true);
      const result = await updatePropertyPriceInfo(values);
      if (result) {
        console.log("Post updated successfully:", result);
        setSubmitted(true);
        setIsLoading(false);
      }
      if (result?.error) {
        console.error(result.error);
      } else {
        console.log(values)
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
    <form onSubmit={formik.handleSubmit}>
      <div>
        <TabTitle title="Pricing" desc="" />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="price" className="col-span-1 col-start-1 flex items-center">
            Price Per Night
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">$</span>
            <Input
              type="number"
              className="w-full"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        {formik.touched.price && formik.errors.price ? (
          <div className="text-red-600">{formik.errors.price}</div>
        ) : null}
        <hr />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="weekendPrice" className="col-span-1 col-start-1 flex items-center">
            Weekend Price (fri/sat)
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">$</span>
            <Input
              type="number"
              className="w-full"
              id="weekendPrice"
              name="weekendPrice"
              // value={formik.values.weekendPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        {formik.touched.weekendPrice && formik.errors.weekendPrice ? (
          <div className="text-red-600">{formik.errors.weekendPrice}</div>
        ) : null}
        <hr />
        <TabTitle title="Discounts" desc="" />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="weeklyDiscount" className="col-span-1 col-start-1 flex items-center">
            Weekly
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">%</span>
            <Input
              type="number"
              className="w-full"
              id="weeklyDiscount"
              name="weeklyDiscount"
              // value={formik.values.weeklyDiscount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>

        <hr />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="monthlyDiscount" className="col-span-1 col-start-1 flex items-center">
            Monthly
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">%</span>
            <Input
              type="number"
              className="w-full"
              id="monthlyDiscount"
              name="monthlyDiscount"
              // value={formik.values.monthlyDiscount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        <hr />
        <TabTitle title="Additional Fees" desc="" />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="cleaningFee" className="col-span-1 col-start-1 flex items-center">
            Cleaning Fee
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">$</span>
            <Input
              type="number"
              className="w-full"
              id="cleaningFee"
              name="cleaningFee"
              value={formik.values.cleaningFee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        {formik.touched.cleaningFee && formik.errors.cleaningFee ? (
          <div className="text-red-600">{formik.errors.cleaningFee}</div>
        ) : null}
        <hr />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="petFee" className="col-span-1 col-start-1 flex items-center">
            Pet Fee
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">$</span>
            <Input
              type="number"
              className="w-full"
              id="petFee"
              name="petFee"
              // value={formik.values.petFee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        {formik.touched.petFee && formik.errors.petFee ? (
          <div className="text-red-600">{formik.errors.petFee}</div>
        ) : null}
        <hr />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
          <Label htmlFor="securityDeposit" className="col-span-1 col-start-1 flex items-center">
            Security Deposit
          </Label>
          <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
            <span className="mr-2">$</span>
            <Input
              type="number"
              className="w-full"
              id="securityDeposit"
              name="securityDeposit"
              value={formik.values.securityDeposit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
          </div>
        </div>
        {formik.touched.securityDeposit && formik.errors.securityDeposit ? (
          <div className="text-red-600">{formik.errors.securityDeposit}</div>
        ) : null}
        <hr />
        <div className="text-sm font-medium text-gray-900 grid grid-cols-6 md:grid-cols-7 sm:grid-cols-8 gap-4 mb-5 mt-5">
          <Label htmlFor="extraGuestFee" className="col-span-1 col-start-1 flex items-center">
            Extra Guest Fee
          </Label>
          <div className="col-span-2 md:col-span-2 sm:col-span-6 col-start-5 md:col-start-6 sm:col-start-2 flex items-center">
            <span className="m-2">After</span>
            <Input
              type="number"
              className="flex items-center min-w-[50px] max-w-[50px]"
              id="extraGuestFee.guests"
              name="extraGuestFee.guests"
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
            <span className="m-2">Guest(s)</span>
            <span className="m-2">$</span>
            <Input
              type="number"
              className="flex items-center min-w-[50px] max-w-[50px]"
              id="extraGuestFee.fee"
              name="extraGuestFee.fee"
              min="0"
              onWheel={event => event.currentTarget.blur()}
            />
            <span className="m-2">Per Guest</span>
          </div>
        </div>
        {/* <AmenityEditor /> */}
        <AmenityDataTable />
        <hr className="mb-5" />
        <EditorSaveButton submitted={submitted} isLoading={isLoading} />
      </div>
    </form>
  );
}