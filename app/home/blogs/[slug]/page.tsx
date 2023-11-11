import React from "react";
import { blogs } from "@/components/blogs/blog-data";
// import { Blog } from "@/components/blogs/types";
import { Blog } from "@prisma/client";
import HomeLayout from "@/components/home/home-layout";
import Image from "next/image";
import BlogItem from "@/components/blogs/blog-item";
import { Section } from "@/components/home/Section";
import { GetStaticPaths, GetStaticProps } from "next";
import { GetServerSideProps } from "next";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { getAllBlogs } from "@/lib/actions";

=======
>>>>>>> fa80ad39d215a2a029c5fc0ab397ebfc7d44bc2c

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
    keywords: blog.keywords
  };
}

const BlogDetail: React.FC<Props> = async ({ params }) => {
  const { slug } = params;
  console.log(slug);

  const data = await getAllBlogs();
  if (!data) {
    notFound();
  }
  const blog = data.find((blog: Blog) => blog.slug === slug);

  if (!blog) {
    console.log("blog not found");
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">
          <p className="text-center">Blog not found</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
<<<<<<< HEAD
  <Section title={blog.title} description={blog.description}>
    <div className="container mx-auto px-8 py-4">

      <Image
        src={blog.image}
        alt={blog.image.altText}
        width={52}
        height={52}
        className="mx-auto h-auto w-full max-w-lg"
      />
      <div className="mx-auto mt-8 max-w-3xl">
        <p className="text-center text-lg text-gray-700">{blog.content}</p>
      </div>
=======
      <div className="px-6 py-6 lg:py-16">
        <div className="flex justify-center">
          <article className="prose prose-zinc dark:prose-invert mx-auto text-center">
            <div className="not-prose space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">
                {blog.title}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                By Author Name | Posted on November 9, 2023
              </p>
            </div>
            <p>
              This is the blog post content. It can be as long or as short as
              needed, and can include any type of content that's necessary for
              the blog post.
            </p>
            <figure>
              <img
                alt="Blog cover image"
                className="aspect-video object-cover"
                height="340"
                src="/placeholder.svg"
                width="1250"
              />
              <figcaption>Blog cover image caption</figcaption>
            </figure>
            <p>
              More blog post content goes here. This could be additional
              paragraphs, images, videos, etc.
            </p>
          </article>
>>>>>>> fa80ad39d215a2a029c5fc0ab397ebfc7d44bc2c
        </div>
      </div>
    </HomeLayout>
    );
};

    export default BlogDetail;
