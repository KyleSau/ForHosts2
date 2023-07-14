"use client";
import React from "react";
import { useParams } from "next/navigation";
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/home-layout";
import Meta from "@/components/meta";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/home/Section";

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const BlogDetail: React.FC = () => {
  const params = useParams();
  const { slug } = params;
  const [randomBlogs, setRandomBlogs] = useState<Blog[]>([]);

  const blog: Blog | undefined = blogs.find((blog) => blog.slug === slug);

  useEffect(() => {
    const shuffledBlogs = shuffleArray(blogs);
    setRandomBlogs(shuffledBlogs.slice(0, 4));
  }, []);

  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Section title={blog.title} description={blog.description} >
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {randomBlogs.map((blog, index) => (
          <div key={index} className="flex flex-col items-center justify-center space-y-4 p-4">
            <Image src={blog.image.path} alt={blog.image.altText} width={52} height={52} />
            <h2 className="text-2xl font-semibold text-center">{blog.title}</h2>
            <p className="text-lg text-center text-gray-700">{blog.description}</p>
            <Link legacyBehavior href={`/blogs/${blog.slug}`}>
              <a className="text-blue-600 hover:text-blue-800">Read More &#8599;</a>
            </Link>
          </div>
        ))}
      </div>
      </Section>
    </HomeLayout>
    
  );
};

export default BlogDetail;
