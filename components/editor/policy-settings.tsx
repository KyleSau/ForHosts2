import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import $ from 'jquery';
import { Switch } from "@/components/ui/switch"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function PolicySettings({ data }) {

    const id = data["id"];
    const desc = data["description"];
    const $boxes = $('#my-details-modal .modal-dialog .modal-content .modal-body form label input[type="checkbox"]');

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
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        },
    });

    $boxes.each(function (this: HTMLInputElement) {
        if ($(this).attr('checked')) {
            $(this).prop('checked', true);
            $(this).parent().addClass('checked-checkbox-parent');
        }
    });

    $boxes.on('click', function (this: HTMLInputElement, e) {
        const $box = $(this);
        if ($box.is(':checked')) {
            $boxes.prop('checked', false);
            $boxes.parent().removeClass('checked-checkbox-parent');
            $box.prop('checked', true);
            $box.parent().addClass('checked-checkbox-parent');
        }
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
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Check-in Window
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Checkout Time
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
                    type="submit" // Specify the button type as "submit" to trigger form submission
                    className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>
            </div>
        </div >
    )
}