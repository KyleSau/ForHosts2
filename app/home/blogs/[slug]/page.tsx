import React from "react";
// import { blogs } from "@/components/blogs/blog-data";
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
  const blog = data.find((blog) => blog.slug === slug);
  if (!blog) {
    throw new Error("Blog not found");
  }

  return {
    title: blog.title,
    description: blog.description,
  };
}


const BlogDetail: React.FC<Props> = async ({ params }) => {
  const { slug } = params;
  console.log(slug);

  const data = await prisma?.blog.findMany();
  if (!data) {
    notFound();
  }
  const blog = data.find((blog: Blog) => blog.slug === slug);

  if (!blog) {
    console.log("blog not found");
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
            className="mx-auto h-auto w-full max-w-lg"
          />
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-center text-lg text-gray-700">{blog.content}</p>
          </div>
        </div>
        <hr className="my-8 border-t-2 border-black" />
        <Link href="/blogs">
          <div className="flex justify-center bg-white hover:text-slate-500 p-2 rounded-md ">
            &#8592; Go back to blogs
          </div>
        </Link>
        {/* <h1 className="flex justify-center text-lg font-bold">Read more...</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {randomBlogItems}
        </div> */}
      </Section>
    </HomeLayout>
  );
};

export default BlogDetail;
