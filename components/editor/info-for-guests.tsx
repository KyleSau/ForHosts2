"use client"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function InfoForGuests({ data }) {

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
            <form onSubmit={formik.handleSubmit}>
                <TabTitle title="Before Booking" desc="" />
                <div className="mt-10">
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <span className="col-span-1 col-start-1 flex items-center">Check-in Window</span>
                        <Select>
                            <SelectTrigger className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
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
                            <SelectTrigger className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
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
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <span className="col-span-1 col-start-1 flex items-center">Checkout Time</span>
                        <Select>
                            <SelectTrigger className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center max-w-[200px]">
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
                                        maximum-scale="1"
                                    >
                                        {hour}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <hr />
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <span className="col-span-1 col-start-1 flex items-center">Interaction Preferences</span>
                        <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center">
                            <RadioGroup
                                name="interactionPreferences"
                                defaultValue={formik.values.interactionPreferences}
                                onChange={(value) => formik.setFieldValue("interactionPreferences", value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="appCommunication" id="appCommunication" />
                                    <Label htmlFor="appCommunication">
                                        I won’t be available in person, and prefer communicating through the app.
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sayHello" id="sayHello" />
                                    <Label htmlFor="sayHello">
                                        I like to say hello in person, but keep to myself otherwise.
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="socializeWithGuests" id="socializeWithGuests" />
                                    <Label htmlFor="socializeWithGuests">
                                        I like socializing and spending time with guests.
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="noPreference" id="noPreference" />
                                    <Label htmlFor="noPreference">
                                        No preference. I’ll follow my guests’ lead.
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <TabTitle title="After Booking" desc="" />
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
                    <TabTitle title="Check-In" desc="" />
                    <br />
                    <div className="text-sm font-medium text-gray-900 grid grid-cols-3 md:grid-cols-4 sm:grid-cols-5 gap-4 mb-5 mt-5">
                        <span className="col-span-1 col-start-1 flex items-center">
                            Check-In Method
                        </span>
                        <div className="col-span-1 md:col-span-2 sm:col-span-3 col-start-3 md:col-start-4 sm:col-start-5 flex items-center">
                            <RadioGroup
                                name="checkInMethod"
                                defaultValue={formik.values.checkInMethod}
                                onChange={(value) => formik.setFieldValue("checkInMethod", value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="smartLock" id="smartLock" />
                                    <Label htmlFor="smartLock">
                                        Smart lock - A lock guests open with a mobile app or keypad
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="keypad" id="keypad" />
                                    <Label htmlFor="keypad">Keypad - Guests can open the door with a code</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lockbox" id="lockbox" />
                                    <Label htmlFor="lockbox">
                                        Lockbox - The key is stored in a small safe, which guests can open with a code
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="buildingStaff" id="buildingStaff" />
                                    <Label htmlFor="buildingStaff">
                                        Building staff - Someone will be available 24 hours a day to let guests in.
                                    </Label>
                                </div>
                                {/* Other RadioGroupItems */}
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
        </div >
    )
}