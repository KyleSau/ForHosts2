'use client';
import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePropertyDescript } from '@/lib/actions';
import { Post } from "@prisma/client";
import { off } from 'process';
import { useState } from 'react';
const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
});

export default function PropertyDetails({ data }) {
  const id = data['id'];
  const [siteData, setSiteData] = useState(id);
  

    const formik = useFormik({
        initialValues: {

          title: '',
          description: '',
          // Initialize other form fields here
        },
        validationSchema: validationSchema,
        onSubmit: async (values: any) => {
            // Call the updatePost function with the data from Formik
            const result = await updatePropertyDescript(values);
           
            if (result?.error) {
            // Handle the error, e.g., display an error message
            console.error(result.error);
          } else {
            // Handle success, e.g., navigate to a success page or show a success message
            console.log('Post updated successfully:', result);
          }
        },
      });
      return (
        <div className="mt-8 p-4">
        
          <div>
            <div className="font-bold text-gray-600 text-xs leading-8 uppercase h-6 mx-2 mt-3 ">
              Property Settings
            </div>
            <form onSubmit={formik.handleSubmit}> {/* Add onSubmit to the form */}
              <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input
                      placeholder="Title of Property"
                      className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                      {...formik.getFieldProps('title')} // Connect to formik
                    />
                  </div>
                  {formik.touched.title && formik.errors.title && (
                    <div className="text-red-600 text-sm">{formik.errors.title}</div>
                  )}
                </div>
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input
                      placeholder="Description of property"
                      className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                      {...formik.getFieldProps('description')} // Connect to formik
                    />
                  </div>
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-600 text-sm">{formik.errors.description}</div>
                  )}
                </div>
              </div>
    
              <div className="flex p-2 mt-4">
                <button
                  type="submit" // Specify the button type as "submit" to trigger form submission
                  className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                  hover:bg-gray-200  
                  bg-gray-100 
                  text-gray-700 
                  border duration-200 ease-in-out 
                  border-gray-600 transition"
                >
                  Previous
                </button>
                <div className="flex-auto flex flex-row-reverse">
                  <button
                    type="submit" // Specify the button type as "submit" to trigger form submission
                    className="text-base ml-2 hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                    hover:bg-teal-600  
                    bg-teal-600 
                    text-teal-100 
                    border duration-200 ease-in-out 
                    border-teal-600 transition"
                  >
                    Next
                  </button>
                  <button
                    type="button" // Specify the button type as "button" for skipping
                    className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                    hover:bg-teal-200  
                    bg-teal-100 
                    text-teal-700 
                    border duration-200 ease-in-out 
                    border-teal-600 transition"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }