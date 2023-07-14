"use client";
import React, { useEffect, useState } from "react";
import { blogs } from "@/components/blogs/blogData";
import { Blog } from "@/components/blogs/types";
import Image from "next/image";
import Link from "next/link";

const RandomBlogs: React.FC = () => {
  const [randomBlogs, setRandomBlogs] = useState<Blog[]>([]);

  const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const shuffledBlogs = shuffleArray(blogs);
    setRandomBlogs(shuffledBlogs.slice(0, 4));
  }, []);

  return (
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
  );
};

export default RandomBlogs;
