"use client";
import React from "react";
import { useParams } from "next/navigation";
import { blogs } from "@/components/blogs/blogData";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Meta from "@/components/meta";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/home/Section";
import RandomBlogs from "@/components/blogs/random-blogs";

const BlogPage: React.FC = () => {
  const params = useParams();
  const { slug } = params;

  const blog: Blog | undefined = blogs.find((blog) => blog.slug === slug);

  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Section title={blog.title} description={blog.description}>
        <div className="container mx-auto px-8 py-4">
          <Image
            src={blog.image.path}
            alt={blog.image.altText}
            width={52}
            height={52}
            className="max-w-lg w-full h-auto mx-auto"
          />
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-lg text-center text-gray-700  ">{blog.content}</p>
          </div>
        </div>
        <hr className="border-t-2 border-black my-8" />
        <h1 className="flex justify-center text-lg font-bold">Read more...</h1>
        <RandomBlogs />
      </Section>
    </HomeLayout>
  );
};

export default BlogPage;