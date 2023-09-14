import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { Switch } from "@/components/ui/switch"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const hours = [
    'None',
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM',
    '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM',
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export default function PolicySettings({ data }) {

    const id = data["id"];
    const desc = data["description"];


    const validationSchema = Yup.object().shape({
        maxGuests: Yup.number().required('Maximum guests is required').min(1, 'Must be at least 1'),
        postalCode: Yup.string().required('ZIP / Postal code is required'),
    });

    const formik = useFormik({
        initialValues: {
            id: id,
            site: data.site,
            siteId: data.siteId,
            title: '',
            description: '',
            maxGuests: '',
            checkinWindowStart: '03:00 PM',
            checkinWindowEnd: '09:00 PM',
            checkoutTime: '11:00 AM',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        },
    });



    return (
        <div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <TabTitle title="Policies" desc="" />
                    <AccordionTrigger className="text-sm font-medium leading-6  text-gray-900">Cancellation Policy</AccordionTrigger>
                    <AccordionContent className="border p-2">
                        <div id="my-details-modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <TabTitle title="Standard cancellation policy" desc="Choose the policy that will apply to stays under 28 nights." />
                                        <form>
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="Flexible"
                                                    checked={formik.values.StandardCancelPolicy === "Flexible"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "Flexible")}
                                                />
                                                Flexible - Full refund 1 day prior to arrival
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="flexibleNR"
                                                    checked={formik.values.StandardCancelPolicy === "flexibleNR"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "flexibleNR")}
                                                />
                                                Flexible or Non-refundable - In addition to Flexible, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="Moderate"
                                                    checked={formik.values.StandardCancelPolicy === "Moderate"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "Moderate")}
                                                />
                                                Moderate - Full refund 5 days prior to arrival
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="ModerateNR"
                                                    checked={formik.values.StandardCancelPolicy === "ModerateNR"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "ModerateNR")}
                                                />
                                                Moderate or Non-refundable - In addition to Moderate, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="Firm"
                                                    checked={formik.values.StandardCancelPolicy === "Firm"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "Firm")}
                                                />
                                                Firm - Full refund for cancellations up to 30 days before check-in. If booked fewer than 30 days before check-in, full refund for cancellations made within 48 hours of booking and at least 14 days before check-in. After that, 50% refund up to 7 days before check-in. No refund after that.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="FirmNR"
                                                    checked={formik.values.StandardCancelPolicy === "FirmNR"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "FirmNR")}
                                                />
                                                Firm or Non-refundable - In addition to Firm, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="Strict"
                                                    checked={formik.values.StandardCancelPolicy === "Strict"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "Strict")}
                                                />
                                                Strict - Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in. No refunds for cancellations made within 7 days of check-in.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="StandardCancelPolicy"
                                                    value="StrictNR"
                                                    checked={formik.values.StandardCancelPolicy === "StrictNR"}
                                                    onChange={() => formik.setFieldValue("StandardCancelPolicy", "StrictNR")}
                                                />
                                                Strict or Non-refundable - In addition to Strict, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-5 mb-5" />
                        <div id="my-details-modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <TabTitle title="Long-term stay cancellation policy" desc="Choose the policy that will apply to stays 28 nights or longer." />
                                        <form>
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="LTCancelPolicy"
                                                    value="FirmLT"
                                                    checked={formik.values.LTCancelPolicy === "FirmLT"}
                                                    onChange={() => formik.setFieldValue("LTCancelPolicy", "FirmLT")}
                                                />
                                                Firm - Full refund up to 30 days before check-in. After that, the first 30 days of the stay are non-refundable.
                                            </label>
                                            <br />
                                            <label className="text-sm font-medium leading-6 text-gray-900">
                                                <input
                                                    type="radio"
                                                    name="LTCancelPolicy"
                                                    value="StrictLT"
                                                    checked={formik.values.LTCancelPolicy === "StrictLT"}
                                                    onChange={() => formik.setFieldValue("LTCancelPolicy", "StrictLT")}
                                                />
                                                Strict - Full refund if cancelled within 48 hours of booking and at least 28 days before check-in. After that, the first 30 days of the stay are non-refundable.
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="text-sm font-medium leading-6 text-gray-900 flex justify-between items-center mt-5 mb-5">
                <span>Instant Book</span>
                <Switch
                    checked={formik.values.instantBook}
                    onChange={() => formik.setFieldValue("instantBook", !formik.values.instantBook)}
                />
            </div>
            <hr />
            <TabTitle title="House Rules" desc="" />
            <div className="text-sm font-medium leading-6 text-gray-900 flex justify-between items-center mt-5 mb-5">
                <span>Pets Allowed</span>
                <Switch
                    checked={formik.values.petsAllowed}
                    onChange={() => formik.setFieldValue("petsAllowed", !formik.values.petsAllowed)}
                />
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 flex justify-between items-center mt-5 mb-5">
                <span>Events Allowed</span>
                <Switch
                    checked={formik.values.eventsAllowed}
                    onChange={() => formik.setFieldValue("eventsAllowed", !formik.values.eventsAllowed)}
                />
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 flex justify-between items-center mt-5 mb-5">
                <span>Smoking, vaping, e‑cigarettes allowed</span>
                <Switch
                    checked={formik.values.smokingAllowed}
                    onChange={() => formik.setFieldValue("smokingAllowed", !formik.values.smokingAllowed)}
                />
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 flex justify-between items-center mt-5 mb-5">
                <span>Commercial photography and filming allowed</span>
                <Switch
                    checked={formik.values.commercialPhotographyAllowed}
                    onChange={() => formik.setFieldValue("commercialPhotographyAllowed", !formik.values.commercialPhotographyAllowed)}
                />
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Quiet Hours
            </div>
            <div className="flex items-center">
                <label className="text-sm font-medium leading-6 text-gray-900">Start Time:</label>
                <select
                    name="quietHoursStart"
                    value={formik.values.quietHoursStart}
                    onChange={formik.handleChange}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                <label className="text-sm font-medium leading-6 text-gray-900 ml-4">End Time:</label>
                <select
                    name="quietHoursEnd"
                    value={formik.values.quietHoursEnd}
                    onChange={formik.handleChange}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Check-in Window
            </div>
            <div className="flex items-center">
                <label className="text-sm font-medium leading-6 text-gray-900">Start Time:</label>
                <select
                    name="checkinWindowStart"
                    value={formik.values.checkinWindowStart}
                    onChange={formik.handleChange}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                <label className="text-sm font-medium leading-6 text-gray-900 ml-4">End Time:</label>
                <select
                    name="checkinWindowEnd"
                    value={formik.values.checkinWindowEnd}
                    onChange={formik.handleChange}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Checkout Time
            </div>
            <div className="flex items-center">
                <label className="text-sm font-medium leading-6 text-gray-900">Time:</label>
                <select
                    name="checkoutTime"
                    value={formik.values.checkoutTime}
                    onChange={formik.handleChange}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Additional Rules
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Primary Use For Listing
                <br />
                Are they renting the whole place or just a room?
            </div>
            <hr />
            <div className="flex-auto flex flex-row-reverse">
                <button
                    type="submit"
                    className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>
            </div>
        </div >
    )
}