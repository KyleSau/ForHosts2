import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabTitle from "./tab-title";
import EditorSaveButton from "./editor-save-button";
import { Switch } from "@/components/ui/switch";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TextareaAutosize } from "@mui/material";
import { Input } from "../ui/input";


const hours = [
    "None",
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
];

export default function PolicySettings({ data }) {
    const id = data["id"];

    const validationSchema = Yup.object().shape({
        StandardCancelPolicy: Yup.string().required(
            "Cancellation policy is required",
        ),
        LTCancelPolicy: Yup.string().required(
            "Long-term stay cancellation policy is required",
        ),
        instantBook: Yup.boolean(),
        petsAllowed: Yup.boolean(),
        eventsAllowed: Yup.boolean(),
        smokingAllowed: Yup.boolean(),
        commercialPhotographyAllowed: Yup.boolean(),
        quietHoursStart: Yup.string().required(
            "Start time for quiet hours is required",
        ),
        quietHoursEnd: Yup.string().required(
            "End time for quiet hours is required",
        ),
        checkinWindowStart: Yup.string().required(
            "Start time for check-in window is required",
        ),
        checkinWindowEnd: Yup.string().required(
            "End time for check-in window is required",
        ),
        checkoutTime: Yup.string().required("Checkout time is required"),
        additionalRules: Yup.string(), // Assuming it's a string
        taxRate: Yup.number(), // Assuming it's a number
    });

    const formik = useFormik({
        initialValues: {
            id: id,
            site: data.site,
            siteId: data.siteId,

            checkinWindowStart: "03:00 PM",
            checkinWindowEnd: "09:00 PM",
            checkoutTime: "11:00 AM",
            quietHoursStart: "10:00 PM",
            quietHoursEnd: "08:00 AM",
            StandardCancelPolicy: false, // Add this field
            LTCancelPolicy: false, // Add this field
            instantBook: false,
            petsAllowed: false, // Add this field
            eventsAllowed: false, // Add this field
            smokingAllowed: false, // Add this field
            commercialPhotographyAllowed: false, // Add this field
            additionalRules: "", // Add this field
            taxRate: "", // Add this field
        },
        validationSchema: validationSchema,
        onSubmit: async (values: any) => {
            console.log("test");
            console.log(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <TabTitle title="Policies" desc="" />
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm font-medium leading-6 text-gray-900">
                            Cancellation Policy
                        </AccordionTrigger>
                        <AccordionContent className="p-2">
                            <div id="my-details-modal">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <TabTitle
                                                title="Standard cancellation policy"
                                                desc="Choose the policy that will apply to stays under 28 nights."
                                            />
                                            <br />
                                            <RadioGroup
                                                name="StandardCancelPolicy"
                                                defaultValue={formik.values.StandardCancelPolicy}
                                                onChange={(value) =>
                                                    formik.setFieldValue("StandardCancelPolicy", value)
                                                }
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Flexible" id="Flexible" />
                                                    <Label htmlFor="Flexible">
                                                        Flexible - Full refund 1 day prior to arrival
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="flexibleNR" id="flexibleNR" />
                                                    <Label htmlFor="flexibleNR">
                                                        Flexible or Non-refundable - In addition to
                                                        Flexible, offer a non-refundable option—guests pay
                                                        10% less, but you keep your payout no matter when
                                                        they cancel.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Moderate" id="Moderate" />
                                                    <Label htmlFor="Moderate">
                                                        Moderate - Full refund 5 days prior to arrival
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="ModerateNR" id="ModerateNR" />
                                                    <Label htmlFor="ModerateNR">
                                                        Moderate or Non-refundable - In addition to
                                                        Moderate, offer a non-refundable option—guests pay
                                                        10% less, but you keep your payout no matter when
                                                        they cancel.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Firm" id="Firm" />
                                                    <Label htmlFor="Firm">
                                                        Firm - Full refund for cancellations up to 30 days
                                                        before check-in. If booked fewer than 30 days before
                                                        check-in, full refund for cancellations made within
                                                        48 hours of booking and at least 14 days before
                                                        check-in. After that, 50% refund up to 7 days before
                                                        check-in. No refund after that.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="FirmNR" id="FirmNR" />
                                                    <Label htmlFor="FirmNR">
                                                        Firm or Non-refundable - In addition to Firm, offer
                                                        a non-refundable option—guests pay 10% less, but you
                                                        keep your payout no matter when they cancel.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Strict" id="Strict" />
                                                    <Label htmlFor="Strict">
                                                        Strict - Full refund for cancellations made within
                                                        48 hours of booking, if the check-in date is at
                                                        least 14 days away. 50% refund for cancellations
                                                        made at least 7 days before check-in. No refunds for
                                                        cancellations made within 7 days of check-in.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="StrictNR" id="StrictNR" />
                                                    <Label htmlFor="StrictNR">
                                                        Strict or Non-refundable - In addition to Strict,
                                                        offer a non-refundable option—guests pay 10% less,
                                                        but you keep your payout no matter when they cancel.
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="mb-5 mt-5" />
                            <div id="my-details-modal">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <TabTitle
                                                title="Long-term stay cancellation policy"
                                                desc="Choose the policy that will apply to stays 28 nights or longer."
                                            />
                                            <br />
                                            <RadioGroup
                                                name="LTCancelPolicy"
                                                defaultValue={formik.values.LTCancelPolicy}
                                                onChange={(value) =>
                                                    formik.setFieldValue("LTCancelPolicy", value)
                                                }
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="FirmLT" id="FirmLT" />
                                                    <Label htmlFor="FirmLT">
                                                        Firm - Full refund up to 30 days before check-in.
                                                        After that, the first 30 days of the stay are
                                                        non-refundable.
                                                    </Label>
                                                </div>
                                                <br />
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="StrictLT" id="StrictLT" />
                                                    <Label htmlFor="StrictLT">
                                                        Strict - Full refund if canceled within 48 hours of
                                                        booking and at least 28 days before check-in. After
                                                        that, the first 30 days of the stay are
                                                        non-refundable.
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
                    <span className="text-gray-900">Instant Book</span>
                    <label className="relative inline-flex cursor-pointer items-center space-x-2">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formik.values.instantBook}
                            onChange={() =>
                                formik.setFieldValue("instantBook", !formik.values.instantBook)
                            }
                        />
                        <div
                            className={`h-6 w-12 bg-${formik.values.instantBook ? "black" : "gray-300"
                                } rounded-full p-1 transition-transform duration-300`}
                        >
                            <div
                                className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.instantBook ? "translate-x-6" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>
                </div>
                <hr />
                <TabTitle title="House Rules" desc="" />
                <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
                    <span>Pets Allowed</span>
                    <label className="relative inline-flex cursor-pointer items-center space-x-2">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formik.values.petsAllowed}
                            onChange={() =>
                                formik.setFieldValue("petsAllowed", !formik.values.petsAllowed)
                            }
                        />
                        <div
                            className={`h-6 w-12 bg-${formik.values.petsAllowed ? "black" : "gray-300"
                                } rounded-full p-1 transition-transform duration-300`}
                        >
                            <div
                                className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.petsAllowed ? "translate-x-6" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>
                </div>
                <hr />
                <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
                    <span>Events Allowed</span>
                    <label className="relative inline-flex cursor-pointer items-center space-x-2">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formik.values.eventsAllowed}
                            onChange={() =>
                                formik.setFieldValue("eventsAllowed", !formik.values.eventsAllowed)
                            }
                        />
                        <div
                            className={`h-6 w-12 bg-${formik.values.eventsAllowed ? "black" : "gray-300"
                                } rounded-full p-1 transition-transform duration-300`}
                        >
                            <div
                                className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.eventsAllowed ? "translate-x-6" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>
                </div>
                <hr />
                <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
                    <span>Smoking, vaping, e‑cigarettes allowed</span>
                    <label className="relative inline-flex cursor-pointer items-center space-x-2">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formik.values.smokingAllowed}
                            onChange={() =>
                                formik.setFieldValue("smokingAllowed", !formik.values.smokingAllowed)
                            }
                        />
                        <div
                            className={`h-6 w-12 bg-${formik.values.smokingAllowed ? "black" : "gray-300"
                                } rounded-full p-1 transition-transform duration-300`}
                        >
                            <div
                                className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.smokingAllowed ? "translate-x-6" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>
                </div>
                <hr />
                <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
                    <span>Commercial photography and filming allowed</span>
                    <label className="relative inline-flex cursor-pointer items-center space-x-2">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formik.values.smokingAllowed}
                            onChange={() =>
                                formik.setFieldValue("commercialPhotographyAllowed", !formik.values.commercialPhotographyAllowed)
                            }
                        />
                        <div
                            className={`h-6 w-12 bg-${formik.values.commercialPhotographyAllowed ? "black" : "gray-300"
                                } rounded-full p-1 transition-transform duration-300`}
                        >
                            <div
                                className={`h-4 w-4 transform rounded-full bg-white shadow-md ${formik.values.commercialPhotographyAllowed ? "translate-x-6" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>
                </div>
                <hr />
                <div className="mb-5 mt-5 grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                    <span className="col-span-1 col-start-1 flex items-center">
                        Quiet Hours
                    </span>
                    <Select>
                        <SelectTrigger className="col-span-1 col-start-4 flex items-center">
                            <SelectValue
                                placeholder={formik.values.quietHoursStart}
                                onChange={formik.handleChange}
                            ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                            {hours.map((hour) => (
                                <SelectItem value="quietHoursStart" key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="col-span-1 col-start-5 flex items-center">
                            <SelectValue
                                placeholder={formik.values.quietHoursEnd}
                                onChange={formik.handleChange}
                            ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                            {hours.map((hour) => (
                                <SelectItem value="quietHoursStart" key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <hr />
                <div className="mb-5 mt-5 grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                    <span className="col-span-1 col-start-1 flex items-center">
                        Check-in Window
                    </span>
                    <Select>
                        <SelectTrigger className="col-span-1 col-start-4 flex items-center">
                            <SelectValue
                                placeholder={formik.values.checkinWindowStart}
                                onChange={formik.handleChange}
                            ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                            {hours.map((hour) => (
                                <SelectItem value="checkinWindowStart" key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="col-span-1 col-start-5 flex items-center">
                            <SelectValue
                                placeholder={formik.values.checkinWindowEnd}
                                onChange={formik.handleChange}
                            ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                            {hours.map((hour) => (
                                <SelectItem value="CheckinWindowEnd" key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <hr />
                <div className="mb-5 mt-5 grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                    <span className="col-span-1 col-start-1 flex items-center">
                        Checkout Time
                    </span>
                    <Select>
                        <SelectTrigger className="col-span-1 col-start-5 flex items-center">
                            <SelectValue
                                placeholder={formik.values.checkoutTime}
                                onChange={formik.handleChange}
                            ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                            {hours.map((hour) => (
                                <SelectItem value="checkoutTime" key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <hr />
                <div className="mb-5 mt-5 text-sm font-medium leading-6 text-gray-900">
                    Additional Rules
                    <TextareaAutosize />
                </div>
                <hr />
                <TabTitle title="Taxes" desc="" />
                <div className="mb-5 mt-5 grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                    <Label
                        htmlFor="TaxRate"
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Tax Rate
                    </Label>
                    <div className="col-span-1 col-start-5 flex items-center">
                        <span className="mr-2">%</span>
                        <Input type="number" className="w-full" />
                    </div>
                </div>
                <hr className="mb-5 mt-5" />
                <div className="flex flex-auto flex-row-reverse">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 ease-in-out hover:scale-110 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}
