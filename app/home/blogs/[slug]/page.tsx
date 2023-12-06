import React from "react";
import { Blog } from "@prisma/client";
import HomeLayout from "@/components/home/home-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogs } from "@/lib/actions";
import Image from "next/image";
import BlogNotFound from "@/components/blog-viewing-page/blog-missing-page";
import MainBlogViewingComponent from "@/components/blog-viewing-page/presenting-blog-viewing-page";

type Params = {
  slug: string;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params) {
    throw new Error("Params is undefined");
  }
  const { slug } = params;
  const data = await getAllBlogs();
  if (!data) {
    notFound();
  }
  const blog = data.find((blog) => blog.slug === slug);
  if (!blog) {
    throw new Error("Blog not found");
  }

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.keywords,
  };
}
export default async function BlogViewingPage({ params }: Props) {
  const { slug } = params;
  const data = await getAllBlogs();
  const blog = data.find((blog) => blog.slug === slug);
  if (!blog) {
    return <BlogNotFound />;
  }

  return (
    <HomeLayout>
      <MainBlogViewingComponent blog={blog} />
    </HomeLayout>
  );
}
