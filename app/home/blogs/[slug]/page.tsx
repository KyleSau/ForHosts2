
import React from "react";
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Image from "next/image";
import BlogItem from "@/components/blogs/blog-item";
import { Section } from "@/components/home/Section";
import { Metadata } from "next";

interface BlogDetailProps {
  params: {
    slug: string;
  };
  randomBlogs: Blog[];
}
export const generateMetadata = (params, blog) => {
  return {
    title: "test",
  };
};

// This is your random blog selection function.
function getRandomBlogs(n: number, currentBlogSlug: string) {
  const tempBlogs = blogs.filter((blog) => blog.slug !== currentBlogSlug);

  for (let i = tempBlogs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempBlogs[i], tempBlogs[j]] = [tempBlogs[j], tempBlogs[i]];
  }

  return tempBlogs.slice(0, n);
}

// This is your BlogDetail component.
const BlogDetail: React.FC<BlogDetailProps> = ({ params }) => { 
  const { slug } = params;

  const blog = blogs.find((blog: Blog) => blog.slug === slug);


  
  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  // Call the getRandomBlogs function with the number of blogs you want to display
  // and the slug of the current blog to exclude it from the random blogs.
  const randomBlogs = getRandomBlogs(4, slug);

  // Create the BlogItem components for the random blogs
  const randomBlogItems = randomBlogs.map((blog) => <BlogItem key={blog.slug} blog={blog} />);

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
            <p className="text-lg text-center text-gray-700">{blog.content}</p>
          </div>
        </div>
        <hr className="border-t-2 border-black my-8" />
        <h1 className="flex justify-center text-lg font-bold">Read more...</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {randomBlogItems}
        </div>
      </Section>
    </HomeLayout>
  );
};


export default BlogDetail;

