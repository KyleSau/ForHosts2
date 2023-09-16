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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TextareaAutosize } from '@mui/material';
import { Input } from '../ui/input';


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
        instantBook: Yup.boolean().required(''),
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
            quietHoursStart: '10:00 PM',
            quietHoursEnd: '08:00 AM',
            instantBook: false,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        },
    });

    return (
        <div>
            <TabTitle title="Policies" desc="" />
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium leading-6 text-gray-900">Cancellation Policy</AccordionTrigger>
                    <AccordionContent className="p-2">
                        <div id="my-details-modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <TabTitle title="Standard cancellation policy" desc="Choose the policy that will apply to stays under 28 nights." />
                                        <br />
                                        <RadioGroup
                                            name="StandardCancelPolicy"
                                            defaultValue={formik.values.StandardCancelPolicy}
                                            onChange={(value) => formik.setFieldValue("StandardCancelPolicy", value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Flexible" id="Flexible" />
                                                <Label htmlFor="Flexible">Flexible - Full refund 1 day prior to arrival</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="flexibleNR" id="flexibleNR" />
                                                <Label htmlFor="flexibleNR">Flexible or Non-refundable - In addition to Flexible, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Moderate" id="Moderate" />
                                                <Label htmlFor="Moderate">Moderate - Full refund 5 days prior to arrival</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ModerateNR" id="ModerateNR" />
                                                <Label htmlFor="ModerateNR">Moderate or Non-refundable - In addition to Moderate, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Firm" id="Firm" />
                                                <Label htmlFor="Firm">Firm - Full refund for cancellations up to 30 days before check-in. If booked fewer than 30 days before check-in, full refund for cancellations made within 48 hours of booking and at least 14 days before check-in. After that, 50% refund up to 7 days before check-in. No refund after that.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FirmNR" id="FirmNR" />
                                                <Label htmlFor="FirmNR">Firm or Non-refundable - In addition to Firm, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Strict" id="Strict" />
                                                <Label htmlFor="Strict">Strict - Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in. No refunds for cancellations made within 7 days of check-in.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="StrictNR" id="StrictNR" />
                                                <Label htmlFor="StrictNR">Strict or Non-refundable - In addition to Strict, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.</Label>
                                            </div>
                                        </RadioGroup>
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
                                        <br />
                                        <RadioGroup
                                            name="LTCancelPolicy"
                                            defaultValue={formik.values.LTCancelPolicy}
                                            onChange={(value) => formik.setFieldValue("LTCancelPolicy", value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FirmLT" id="FirmLT" />
                                                <Label htmlFor="FirmLT">Firm - Full refund up to 30 days before check-in. After that, the first 30 days of the stay are non-refundable.</Label>
                                            </div>
                                            <br />
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="StrictLT" id="StrictLT" />
                                                <Label htmlFor="StrictLT">Strict - Full refund if canceled within 48 hours of booking and at least 28 days before check-in. After that, the first 30 days of the stay are non-refundable.</Label>
                                            </div>
                                        </RadioGroup>
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
                    onChange={() => {
                        formik.setFieldValue("instantBook", !formik.values.instantBook);
                    }}
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
            <div className="text-sm font-medium text-gray-900 mt-5 mb-5 grid grid-cols-5 gap-4">
                <span className="col-span-1 col-start-1 flex items-center">Quiet Hours</span>
                <Select>
                    <SelectTrigger className="col-span-1 col-start-4 flex items-center">
                        <SelectValue
                            placeholder={formik.values.quietHoursStart}
                            onChange={formik.handleChange}
                        ></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                        {hours.map((hour) => (
                            <SelectItem
                                value="quietHoursStart"
                                key={hour}
                                value={hour}
                            >
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
                            <SelectItem
                                value="quietHoursStart"
                                key={hour}
                                value={hour}
                            >
                                {hour}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <hr />
            <div className="text-sm font-medium text-gray-900 mt-5 mb-5 grid grid-cols-5 gap-4">
                <span className="col-span-1 col-start-1 flex items-center">Check-in Window</span>
                <Select>
                    <SelectTrigger className="col-span-1 col-start-4 flex items-center">
                        <SelectValue
                            placeholder={formik.values.checkinWindowStart}
                            onChange={formik.handleChange}
                        ></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                        {hours.map((hour) => (
                            <SelectItem
                                value="checkinWindowStart"
                                key={hour}
                                value={hour}
                            >
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
                            <SelectItem
                                value="CheckinWindowEnd"
                                key={hour}
                                value={hour}
                            >
                                {hour}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <hr />
            <div className="text-sm font-medium text-gray-900 mt-5 mb-5 grid grid-cols-5 gap-4">
                <span className="col-span-1 col-start-1 flex items-center">Checkout Time</span>
                <Select>
                    <SelectTrigger className="col-span-1 col-start-5 flex items-center">
                        <SelectValue
                            placeholder={formik.values.checkoutTime}
                            onChange={formik.handleChange}
                        ></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                        {hours.map((hour) => (
                            <SelectItem
                                value="checkoutTime"
                                key={hour}
                                value={hour}
                            >
                                {hour}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <hr />
            <div className="text-sm font-medium leading-6 text-gray-900 mt-5 mb-5">
                Additional Rules
                <TextareaAutosize />
            </div>
            <hr />
            <TabTitle title="Taxes" desc="" />
            <div className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                <Label htmlFor="TaxRate" className="col-span-1 col-start-1 flex items-center">Tax Rate</Label>
                <div className="col-span-1 col-start-5 flex items-center">
                    <span className="mr-2">%</span>
                    <Input type="number" className="w-full" />
                </div>
            </div>
            <hr className="mt-5 mb-5" />
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