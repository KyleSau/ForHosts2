import React from "react";
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Image from "next/image";
import BlogItem from "@/components/blogs/blog-item";
import { Section } from "@/components/home/Section";
import { GetStaticPaths, GetStaticProps } from "next";
import { GetServerSideProps } from "next";
import { Metadata } from "next";
import Link from "next/link";
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
  const data = blogs;
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

// randomizing the blogs below the main blog component
// function getRandomBlogs(n: number, currentBlogSlug: string) {
//   const tempBlogs = blogs.filter((blog) => blog.slug !== currentBlogSlug);

//   for (let i = tempBlogs.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [tempBlogs[i], tempBlogs[j]] = [tempBlogs[j], tempBlogs[i]];
//   }

//   return tempBlogs.slice(0, n);
// }

// main component that renders most of the pages contents
const BlogDetail: React.FC<Props> = ({ params }) => {
  const { slug } = params;
  console.log(slug);
  const blog = blogs.find((blog: Blog) => blog.slug === slug);

  if (!blog) {
    console.log("blog not found");
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  // const randomBlogs = getRandomBlogs(4, blog.slug);

  // // Create the BlogItem components for the random blogs
  // const randomBlogItems = randomBlogs.map((blog) => (
  //   <BlogItem key={blog.slug} blog={blog} />
  // ));

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
