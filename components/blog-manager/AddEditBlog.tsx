"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBlog, updateBlog, getBlogById } from "@/lib/actions";
import { toast } from "sonner";
import { BlogDataTable } from "./BlogDataTable";
import { Blog } from "@prisma/client";
import IDK from "./IDK";

// Validation Schema using Yup
const blogValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Blog is required"),
  content: Yup.string().required("Content is required"),
  order: Yup.string().required("order is required"),
  slug: Yup.string().required("Slug is required"),
  image: Yup.string().url("Invalid URL").required("Image URL is required"),
  keywords: Yup.string().required("Keywords are required"),
});

interface AddEditBlogProps {
  blog?: Blog;
}

export default function AddEditBlog({ blog }: AddEditBlogProps) {
  const router = useRouter();

  const [initialValues, setInitialValues] = useState({
    title: blog?.title ?? "",
    description: blog?.description ?? "",
    content: blog?.content ?? "",
    slug: blog?.slug ?? "",
    image: blog?.image ?? "",
    order: blog?.order ?? "",
    keywords: blog?.keywords.toString() ?? "",
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Add this line
    validationSchema: blogValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (blog) {
          await updateBlog(blog.id, values);
        } else {
          await createBlog(values);
        }
        toast.success("Blog post saved successfully");
        resetForm();
        // router.push('/admin/blogs');
      } catch (error) {
        toast.error("An error occurred while saving the blog post");
      }
    },
  });

  return (
    <div className="container mx-auto rounded bg-white p-6 shadow-md">
      <h1 className="mb-4 text-xl font-semibold">
        {blog?.id ? "Edit" : "Create"} Blog Post
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...formik.getFieldProps("title")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
          )}
        </div>
        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...formik.getFieldProps("description")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.description}
            </p>
          )}
        </div>
        {/* Content Field */}
        {/* <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea id="content" {...formik.getFieldProps('content')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    {formik.touched.content && formik.errors.content && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.content}</p>
                    )}
                </div> */}
        <IDK formik={formik} field={"content"} />
        {/* Slug Field */}
        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...formik.getFieldProps("slug")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.slug && formik.errors.slug && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.slug}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700"
          >
            Order
          </label>
          <input
            id="order"
            type="number"
            {...formik.getFieldProps("order")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.order && formik.errors.order && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.order}</p>
          )}
        </div>
        {/* Image URL Field */}
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            id="image"
            type="text"
            {...formik.getFieldProps("image")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.image && formik.errors.image && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.image}</p>
          )}
        </div>
        {/* Keywords Field */}
        <div className="mb-4">
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700"
          >
            Keywords
          </label>
          <input
            id="keywords"
            type="text"
            {...formik.getFieldProps("keywords")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.keywords && formik.errors.keywords && (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.keywords}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {blog ? "Update" : "Submit"} Post
        </button>
      </form>
    </div>
  );
}
