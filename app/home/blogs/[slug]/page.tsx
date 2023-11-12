import React from "react";
import { Blog } from "@prisma/client";
import HomeLayout from "@/components/home/home-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogs } from "@/lib/actions";

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
              needed, and can include any type of content that&#39;s necessary
              for the blog post.
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
        </div>
      </div>
    </HomeLayout>
  );
};

export default BlogDetail;
