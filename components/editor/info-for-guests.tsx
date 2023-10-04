"use client"
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import EditorWrapper from './editor-container-wrapper';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import WYSIWYGEditor from './wysiwyg-editor';


export default function InfoForGuests({ data }) {




    const validationSchema = Yup.object().shape({
        maxGuests: Yup.number().required('Maximum guests is required').min(1, 'Must be at least 1'),
        postalCode: Yup.string().required('ZIP / Postal code is required'),
    });

    const formik = useFormik({
        initialValues: {
            // id: id,
            // site: data.site,
            // siteId: data.siteId,
            // id: data.id,
            // site: data.site,
            // siteId: data.siteId,
            title: '',
            description: '',
            maxGuests: '',
            checkinWindowStart: '03:00 PM',
            checkinWindowEnd: '09:00 PM',
            checkoutTime: '11:00 AM',
            quietHoursStart: '10:00 PM',
            quietHoursEnd: '08:00 AM',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Your form submission logic
        },
    });

    const hours = [
        'None',
        '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM',
        '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM',
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
    ];

    return (
        <div>
            <EditorWrapper>
                <form onSubmit={formik.handleSubmit}>
                    <span className="text-2xl font-semibold text-gray-800 mb-5">Before Booking</span>
                    <div className="bg-white p-5 rounded-md grid grid-cols-3 gap-5 items-center">
                        <span className="col-span-1">Check-in Window</span>
                        <div className="col-start-3 flex justify-end">
                            <Select>
                                <SelectTrigger className="mr-4 max-w-[205px] justify-center border p-2 rounded">
                                    <SelectValue
                                        placeholder={formik.values.checkinWindowStart}
                                        onChange={formik.handleChange}
                                    ></SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-w-[205px] mt-2 border rounded shadow-lg h-[200px]">
                                    {hours.map((hour) => (
                                        <SelectItem value="checkinWindowStart" key={hour}>
                                            {hour}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="max-w-[205px] justify-center border p-2 rounded">
                                    <SelectValue
                                        placeholder={formik.values.checkinWindowEnd}
                                        onChange={formik.handleChange}
                                    ></SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-w-[205px] mt-2 border rounded shadow-lg h-[200px]">
                                    {hours.map((hour) => (
                                        <SelectItem value="CheckinWindowEnd" key={hour}>
                                            {hour}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-md grid grid-cols-3 gap-5 items-center">
                        <span className="col-span-1">Checkout Time</span>
                        <div className="flex justify-end col-start-3 col-span-1">
                            <Select>
                                <SelectTrigger className="justify-center max-w-[133px] border p-2 rounded">
                                    <SelectValue
                                        placeholder={formik.values.checkoutTime}
                                        onChange={formik.handleChange}
                                    ></SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-w-[133px] mt-2 border rounded h-[200px]">
                                    {hours.map((hour) => (
                                        <SelectItem
                                            value="checkoutTime"
                                            key={hour}
                                        >
                                            {hour}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-10 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Label htmlFor="checkInMethod" className="flex items-center">
                            Interaction Options
                        </Label>
                        <div className="p-6 col-span-full flex flex-col">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="appCommunication"
                                        name="interactionPreferences"
                                        value="appCommunication"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.interactionPreferences === "appCommunication"}
                                        onChange={() => formik.setFieldValue("interactionPreferences", "appCommunication")}
                                    />
                                    <label htmlFor="appCommunication" className="text-lg text-gray-700">
                                        Remote
                                    </label>
                                    <p className="text-gray-500">
                                        I won&apos;t be available in person and prefer communicating through email or text message/phone
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="sayHello"
                                        name="interactionPreferences"
                                        value="sayHello"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.interactionPreferences === "sayHello"}
                                        onChange={() => formik.setFieldValue("interactionPreferences", "sayHello")}
                                    />
                                    <label htmlFor="sayHello" className="text-lg text-gray-700">
                                        Say Hello In Person
                                    </label>
                                    <p className="text-gray-500">
                                        I like to say hello in person but keep to myself otherwise.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="socializeWithGuests"
                                        name="interactionPreferences"
                                        value="socializeWithGuests"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.interactionPreferences === "socializeWithGuests"}
                                        onChange={() => formik.setFieldValue("interactionPreferences", "socializeWithGuests")}
                                    />
                                    <label htmlFor="socializeWithGuests" className="text-lg text-gray-700">
                                        Socialize With Guests
                                    </label>
                                    <p className="text-gray-500">
                                        I like socializing and spending time with guests.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="noPreference"
                                        name="interactionPreferences"
                                        value="noPreference"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.interactionPreferences === "noPreference"}
                                        onChange={() => formik.setFieldValue("interactionPreferences", "noPreference")}
                                    />
                                    <label htmlFor="noPreference" className="text-lg text-gray-700">
                                        No Preference
                                    </label>
                                    <p className="text-gray-500">
                                        I&apos;ll follow my guests lead.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className="text-2xl font-semibold text-gray-800 mb-5">After Booking</span>
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <Label htmlFor="Directions" className="col-span-1 col-start-1 flex">
                            Directions
                        </Label>
                        <div className="col-span-3 md:col-span-4 sm:col-span-5 col-start-1 md:col-start-1 sm:col-start-1 flex items-center">
                            <WYSIWYGEditor formik={formik} field={"directions"} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <Label htmlFor="Wifi" className="flex items-center">
                            Wifi Details
                        </Label>
                        <div className="col-span-1 md:col-span-1 sm:col-span-1 col-start-1 md:col-start-1 sm:col-start-1 flex items-center">
                            <p className="p-2">Name</p>
                        </div>
                        <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                            <Input type="text" className="w-full" />
                        </div>
                        <div className="col-span-1 md:col-span-1 sm:col-span-1 col-start-1 md:col-start-1 sm:col-start-1 flex items-center">
                            <p className="p-2">Password</p>
                        </div>
                        <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                            <Input type="text" className="w-full" />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Label htmlFor="HouseManual" className="col-span-1 col-start-1 flex items-center">
                                        House Manual
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Give guests essential information of the property, such as how to turn on hot water.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="col-span-3 md:col-span-4 sm:col-span-5 col-start-1 md:col-start-1 sm:col-start-1 flex items-center">
                            <WYSIWYGEditor formik={formik} field={"houseManual"} />
                        </div>
                    </div>
                    <div className="mt-10 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-5 col-span-full">Check-In Method</h2>
                        <Label htmlFor="checkInMethod" className="flex items-center">
                            Check-In Options
                        </Label>
                        <div className="p-6 rounded-md col-span-full flex flex-col">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="smartLock"
                                        name="checkInMethod"
                                        value="smartLock"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.checkInMethod === "smartLock"}
                                        onChange={() => formik.setFieldValue("checkInMethod", "smartLock")}
                                    />
                                    <label htmlFor="smartLock" className="text-lg text-gray-700">
                                        Smart Lock
                                    </label>
                                    <p className="text-gray-500">
                                        A lock guests can open with a mobile app or keypad.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="keypad"
                                        name="checkInMethod"
                                        value="keypad"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.checkInMethod === "keypad"}
                                        onChange={() => formik.setFieldValue("checkInMethod", "keypad")}
                                    />
                                    <label htmlFor="keypad" className="text-lg text-gray-700">
                                        Keypad
                                    </label>
                                    <p className="text-gray-500">
                                        Guests can open the door with a code.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="lockbox"
                                        name="checkInMethod"
                                        value="lockbox"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.checkInMethod === "lockbox"}
                                        onChange={() => formik.setFieldValue("checkInMethod", "lockbox")}
                                    />
                                    <label htmlFor="lockbox" className="text-lg text-gray-700">
                                        Lockbox
                                    </label>
                                    <p className="text-gray-500">
                                        The key is stored in a small safe, which guests can open with a code.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="buildingStaff"
                                        name="checkInMethod"
                                        value="buildingStaff"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.checkInMethod === "buildingStaff"}
                                        onChange={() => formik.setFieldValue("checkInMethod", "buildingStaff")}
                                    />
                                    <label htmlFor="buildingStaff" className="text-lg text-gray-700">
                                        Building Staff
                                    </label>
                                    <p className="text-gray-500">
                                        Someone will be available 24 hours a day to let guests in.
                                    </p>
                                </div>
                                <hr />
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="greet"
                                        name="checkInMethod"
                                        value="greet"
                                        className="mt-1 form-radio text-indigo-600"
                                        checked={formik.values.checkInMethod === "greet"}
                                        onChange={() => formik.setFieldValue("checkInMethod", "greet")}
                                    />
                                    <label htmlFor="greet" className="text-lg text-gray-700">
                                        Host Greets You
                                    </label>
                                    <p className="text-gray-500">
                                        The host or co-host will meet guests to exchange the key.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Label htmlFor="checkoutInstructions" className="col-span-1 col-start-1 flex items-center">Checkout Instructions</Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Explain whats essential for guests to do in the few minutes before they leave. Anyone can read these before they book.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="col-span-3 md:col-span-4 sm:col-span-5 col-start-1 md:col-start-1 sm:col-start-1 flex items-center">
                            <WYSIWYGEditor formik={formik} field={"checkoutInstructions"} />
                        </div>
                    </div>
                    <br />
                    <div className="flex-auto flex flex-row-reverse">
                        <button
                            type="submit"
                            className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Save
                        </button>

                    </div>
                </form >
            </EditorWrapper>
        </div >
    )
}