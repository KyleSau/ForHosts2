import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePropertyPriceInfo } from "@/lib/actions";
import TabTitle from "./tab-title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Toggle } from "@/components/ui/toggle";
import CalendarImportForm from "./calendar-import";
import { CalendarModal } from "./calendar-editor-modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import EditorSaveButton from "./editor-save-button";

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
    minimumStay: Yup.number()
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

export default function Availability({ data }) {
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
            minimumStay: "",
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
        onSubmit: async (values) => {
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

    const handleBeforeUnload = (e) => {
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
                <TabTitle title="Trip Length" desc="" />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label htmlFor="minimumStay" className="col-span-1 col-start-1 flex items-center">
                        Minimum Stay
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <Input
                            type="number"
                            className="w-full"
                            id="minimumStay"
                            name="minimumStay"
                            value={formik.values.minimumStay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            min="0"
                            onWheel={event => event.currentTarget.blur()}
                        />
                    </div>
                </div>
                {formik.touched.minimumStay && formik.errors.minimumStay ? (
                    <div className="text-red-600">{formik.errors.minimumStay}</div>
                ) : null}
                <hr />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label htmlFor="maximumStay" className="col-span-1 col-start-1 flex items-center">
                        Maximum Stay
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <Input
                            type="number"
                            className="w-full"
                            id="maximumStay"
                            name="maximumStay"
                            // value={formik.values.maximumStay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            min="0"
                            onWheel={event => event.currentTarget.blur()}
                        />
                    </div>
                </div>
                {formik.touched.maximumStay && formik.errors.maximumStay ? (
                    <div className="text-red-600">{formik.errors.maximumStay}</div>
                ) : null}
                <hr />
                <TabTitle title="Availability" desc="" />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label htmlFor="advancedNotice" className="col-span-1 col-start-1 flex items-center">
                        Advanced Notice
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <select
                            id="advancedNotice"
                            name="advancedNotice"
                            // value={formik.values.advancedNotice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="" disabled>
                                Select Advanced Notice
                            </option>
                            <option value="SameDay">Same Day</option>
                            <option value="1Day">At Least 1 Day</option>
                            <option value="2Day">At Least 2 Days</option>
                            <option value="3Day">At Least 3 Days</option>
                            <option value="7Day">At Least 7 Days</option>
                        </select>
                    </div>
                </div>
                {formik.touched.advancedNotice && formik.errors.advancedNotice ? (
                    <div className="text-red-600">{formik.errors.advancedNotice}</div>
                ) : null}
                <hr />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label
                        htmlFor="sameDayAdvancedNotice"
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Same Day Advanced Notice
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <select
                            id="sameDayAdvancedNotice"
                            name="sameDayAdvancedNotice"
                            // value={formik.values.sameDayAdvancedNotice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-2 border rounded-md"
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
                {formik.touched.sameDayAdvancedNotice && formik.errors.sameDayAdvancedNotice ? (
                    <div className="text-red-600">{formik.errors.sameDayAdvancedNotice}</div>
                ) : null}
                <hr />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label htmlFor="preparationTime" className="col-span-1 col-start-1 flex items-center">
                        Preparation Time
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <select
                            id="preparationTime"
                            name="preparationTime"
                            // value={formik.values.preparationTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-2 border rounded-md"
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
                <hr />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label
                        htmlFor="availabilityWindow"
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Availability Window
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <select
                            id="availabilityWindow"
                            name="availabilityWindow"
                            // value={formik.values.availabilityWindow}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-2 border rounded-md"
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
                <hr />
                <div>
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                        <Label
                            htmlFor="restrictedCheckIn"
                            className="col-span-1 col-start-1 flex items-center"
                        >
                            Restricted Check-In
                        </Label>
                        <div className="col-span-4 col-start-2 flex items-center flex-wrap">
                            {/* Create custom Toggle component or use your own implementation */}
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
                        <Label
                            htmlFor="restrictedCheckOut"
                            className="col-span-1 col-start-1 flex items-center"
                        >
                            Restricted Check-Out
                        </Label>
                        <div className="col-span-4 col-start-2 flex items-center flex-wrap">
                            {/* Create custom Toggle component or use your own implementation */}
                            <Toggle>Monday</Toggle>
                            <Toggle>Tuesday</Toggle>
                            <Toggle>Wednesday</Toggle>
                            <Toggle>Thursday</Toggle>
                            <Toggle>Friday</Toggle>
                            <Toggle>Saturday</Toggle>
                            <Toggle>Sunday</Toggle>
                        </div>
                    </div>

                </div>
                <hr />
                <TabTitle title="Calendar Sync" desc="" />
                <CalendarImportForm />
                <br />
                <br />
                {/* <CalendarModal data={data} /> */}
                <hr />
                <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label
                        htmlFor="calendarExport"
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Calendar Export
                    </Label>
                    <div className="col-span-3 col-start-3 flex items-center relative">
                        <Input
                            type="text"
                            className="w-full pr-10"
                            id="calendarExport"
                            name="calendarExport"
                            value={formik.values.calendarExport}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer"
                            onClick={() => {
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
                <EditorSaveButton submitted={submitted} isLoading={isLoading} />
            </div>
        </form>
    );
}