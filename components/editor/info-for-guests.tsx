import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TabTitle from './tab-title';
import EditorSaveButton from './editor-save-button';

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
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Your form submission logic
        },
    });


    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <TabTitle title="Propery Description" desc="Title and Description for your property listing" />
                <div className="mt-10">
                    <label htmlFor="title" className="block text-sm font-medium leading-6  text-gray-900">
                        Listing Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className={`block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                            }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <div className="text-red-600 text-sm mt-2">{formik.errors.title}</div>
                    )}
                </div>
                <div className="flex-auto flex flex-row-reverse">
                    <button
                        type="submit" // Specify the button type as "submit" to trigger form submission
                        className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Save
                    </button>

                </div>
            </form>
        </div>
    )
}