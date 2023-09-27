"use client"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import EditorWrapper from './editor-container-wrapper';

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
                    {/* <TabTitle title="Before Booking" desc="" /> */}
                    <span className="text-xl font-semibold text-gray-800 block mb-5">Before Booking</span>
                    <hr />
                    <div className="mt-10">
                        <div className="mt-10 mb-10">

                            <div className="bg-white p-5 rounded-md grid grid-cols-3 gap-5 items-center">
                                {/* Label */}
                                <span className="col-span-1">Check-in Window</span>

                                {/* Start Time Select */}
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
                                                <SelectItem
                                                    value="checkinWindowStart"
                                                    key={hour}
                                                >
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* End Time Select */}
                                    <Select>
                                        <SelectTrigger className="max-w-[205px] justify-center border p-2 rounded">
                                            <SelectValue
                                                placeholder={formik.values.checkinWindowEnd}
                                                onChange={formik.handleChange}
                                            ></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="max-w-[205px] mt-2 border rounded shadow-lg h-[200px]">
                                            {hours.map((hour) => (
                                                <SelectItem
                                                    value="CheckinWindowEnd"
                                                    key={hour}
                                                >
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 mb-10">
                            <div className="bg-white p-5 rounded-md grid grid-cols-2 gap-5 items-center">
                                {/* Label */}
                                <span className="col-span-1">Checkout Time</span>

                                {/* Checkout Time Select */}
                                <div className="flex justify-end">
                                    <Select>
                                        <SelectTrigger className="justify-center col-start-2 max-w-[205px] border p-2 rounded">
                                            <SelectValue
                                                placeholder={formik.values.checkoutTime}
                                                onChange={formik.handleChange}
                                            ></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="max-w-[205px] mt-2 border rounded h-[200px]">
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
                        </div>

                        <div className="mt-10 mb-10">
                            <span className="text-xl font-semibold text-gray-800 block mb-5">Interaction Preferences</span>
                            <hr />
                            <div className="bg-white p-5 rounded-md">
                                <RadioGroup
                                    name="interactionPreferences"
                                    defaultValue={formik.values.interactionPreferences}
                                    onChange={(value) => formik.setFieldValue("interactionPreferences", value)}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="appCommunication" id="appCommunication" className="mt-1" />
                                        <Label htmlFor="appCommunication" className="text-md text-gray-700">
                                            I won’t be available in person, and prefer communicating through the app.
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="sayHello" id="sayHello" className="mt-1" />
                                        <Label htmlFor="sayHello" className="text-md text-gray-700">
                                            I like to say hello in person, but keep to myself otherwise.
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="socializeWithGuests" id="socializeWithGuests" className="mt-1" />
                                        <Label htmlFor="socializeWithGuests" className="text-md text-gray-700">
                                            I like socializing and spending time with guests.
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="noPreference" id="noPreference" className="mt-1" />
                                        <Label htmlFor="noPreference" className="text-md text-gray-700">
                                            No preference. I’ll follow my guests’ lead.
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* <TabTitle title="After Booking" desc="" /> */}
                        <span className="text-xl font-semibold text-gray-800 block mb-5">After Booking</span>
                        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                            <Label htmlFor="Directions" className="col-span-1 col-start-1 flex items-center">
                                Directions
                            </Label>
                            <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex">
                                <Input type="text" className="w-full h-[200px]" />
                            </div>
                        </div>
                        <hr />
                        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                            <Label htmlFor="Wifi" className="flex items-center">
                                Wifi Details
                            </Label>
                            <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                                <p className="p-2">Network Name</p>
                                <Input type="text" className="w-full" />
                            </div>
                            <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                                <p className="p-2">Password</p>
                                <Input type="text" className="w-full" />
                            </div>
                        </div>
                        <hr />
                        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                            <Label htmlFor="HouseManual" className="col-span-1 col-start-1 flex items-center">
                                House Manual
                            </Label>
                            <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                                <Input type="text" className="w-full h-[200px]" />
                            </div>
                        </div>
                        <hr />
                        <div className="mt-10 mb-10">
                            <span className="text-xl font-semibold text-gray-800 block mb-5">Check-In Method</span>

                            <div className="bg-white p-5 rounded-md">
                                <RadioGroup
                                    name="checkInMethod"
                                    defaultValue={formik.values.checkInMethod}
                                    onChange={(value) => formik.setFieldValue("checkInMethod", value)}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="smartLock" id="smartLock" className="mt-1" />
                                        <Label htmlFor="smartLock" className="text-md text-gray-700">
                                            Smart lock - A lock guests open with a mobile app or keypad
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="keypad" id="keypad" className="mt-1" />
                                        <Label htmlFor="keypad" className="text-md text-gray-700">
                                            Keypad - Guests can open the door with a code
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="lockbox" id="lockbox" className="mt-1" />
                                        <Label htmlFor="lockbox" className="text-md text-gray-700">
                                            Lockbox - The key is stored in a small safe, which guests can open with a code
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="buildingStaff" id="buildingStaff" className="mt-1" />
                                        <Label htmlFor="buildingStaff" className="text-md text-gray-700">
                                            Building staff - Someone will be available 24 hours a day to let guests in.
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="greet" id="greet" className="mt-1" />
                                        <Label htmlFor="greet" className="text-md text-gray-700">
                                            Host greets you - The host or co-host will meet guests to exchange the key
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <hr />
                        <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                            <Label htmlFor="Directions" className="col-span-1 col-start-1 flex items-center">Checkout Instructions</Label>
                            <div className="col-span-2 md:col-span-3 sm:col-span-4 col-start-2 md:col-start-2 sm:col-start-2 flex items-center">
                                <Input type="text" className="w-full h-[200px]" />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <br />
                    <div className="flex-auto flex flex-row-reverse">
                        <button
                            type="submit" // Specify the button type as "submit" to trigger form submission
                            className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Save
                        </button>

                    </div>
                </form >
            </EditorWrapper>
        </div >
    )
}