"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createBlog, updateBlog, getBlogById } from '@/lib/actions';
import { toast } from "sonner";

// Validation Schema using Yup
const blogValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Blog is required'),
    content: Yup.string().required('Content is required'),
    slug: Yup.string().required('Slug is required'),
    image: Yup.string().url('Invalid URL').required('Image URL is required'),
    keywords: Yup.string().required('Keywords are required'),
});

interface AddEditBlogProps {
    blogId?: string;
}

export default function AddEditBlog({ blogId }: AddEditBlogProps) {
    const router = useRouter();
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        content: '',
        slug: '',
        image: '',
        keywords: '',
    });

    useEffect(() => {
        if (blogId) {
            getBlogById(blogId).then(blogData => {
                setInitialValues({
                    title: blogData.title,
                    description: blogData.description,
                    content: blogData.content,
                    slug: blogData.slug,
                    image: blogData.image,
                    keywords: blogData.keywords,
                });
            });
        }
    }, [blogId]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true, // Add this line
        validationSchema: blogValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (blogId) {
                    await updateBlog(blogId, values);
                } else {
                    await createBlog(values);
                }
                toast.success('Blog post saved successfully');
                resetForm();
                router.push('/admin/blogs');
            } catch (error) {
                toast.error('An error occurred while saving the blog post');
            }
        },
    });
    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded">
            <h1 className="text-xl font-semibold mb-4">{blogId ? 'Edit' : 'Create'} Blog Post</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Title Field */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" type="text" {...formik.getFieldProps('title')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.title && formik.errors.title && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
                    )}
                </div>
                {/* Description Field */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" {...formik.getFieldProps('description')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.description && formik.errors.description && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                    )}
                </div>
                {/* Content Field */}
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea id="content" {...formik.getFieldProps('content')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.content && formik.errors.content && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.content}</p>
                    )}
                </div>
                {/* Slug Field */}
                <div className="mb-4">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                    <input id="slug" type="text" {...formik.getFieldProps('slug')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.slug && formik.errors.slug && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.slug}</p>
                    )}
                </div>
                {/* Image URL Field */}
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input id="image" type="text" {...formik.getFieldProps('image')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.image && formik.errors.image && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.image}</p>
                    )}
                </div>
                {/* Keywords Field */}
                <div className="mb-4">
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
                    <input id="keywords" type="text" {...formik.getFieldProps('keywords')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.keywords && formik.errors.keywords && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.keywords}</p>
                    )}
                </div>
                {/* Submit Button */}
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {blogId ? 'Update' : 'Submit'} Post
                </button>
            </form>
        </div>
    );
}