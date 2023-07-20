import React from "react";
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Image from "next/image";
import BlogItem from "@/components/blogs/blog-item";
import { Section } from "@/components/home/Section";
import { GetStaticPaths, GetStaticProps } from "next";

type Params = {
  slug: string;
};

type Props = {
  blog: Blog | null;
};

// Generate all possible paths (slugs) for the blogs at build time.
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = blogs.map((blog) => ({
    params: { slug: blog.slug },
    
  }));

  return { paths, fallback: false };
};

// Fetch blog data and generate metadata for each blog at build time.
export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const { slug } = params || {};

  const blog = blogs.find((blog) => blog.slug === slug);

  if (!blog) {
    
    return {
      props: { blog: null },
    };
  }

  return { props: { blog } };
};

// randomizing the blogs below the main blog component
function getRandomBlogs(n: number, currentBlogSlug: string) {
  const tempBlogs = blogs.filter((blog) => blog.slug !== currentBlogSlug);

  for (let i = tempBlogs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempBlogs[i], tempBlogs[j]] = [tempBlogs[j], tempBlogs[i]];
  }

  return tempBlogs.slice(0, n);
}

// main component that renders most of the pages contents
const BlogDetail: React.FC<Props> = ({ blog }) => {
  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  // Call the getRandomBlogs function with the number of blogs you want to display.
  const randomBlogs = getRandomBlogs(4, blog.slug);

  // Create the BlogItem components for the random blogs
  const randomBlogItems = randomBlogs.map((blog) => (
    <BlogItem key={blog.slug} blog={blog} />
  ));

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
        <h1 className="flex justify-center text-lg font-bold">Read more...</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {randomBlogItems}
        </div>
      </Section>
    </HomeLayout>
  );
};

export default BlogDetail;
