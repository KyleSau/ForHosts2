// components/BlogCard.tsx
import React from "react";
import { Blog } from "./types";
import Link from "next/link";
interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="w-64 h-64 border border-black rounded-xl overflow-hidden shadow-lg m-4 cursor-pointer hover:scale-105 hover:bg-gray-100 flex flex-col justify-center items-center">
        <div className="relative">
          <div className="rounded-full border border-black w-20 h-20 p-3 flex justify-center items-center">
            <img
              className="object-contain w-16 rounded-full"
              src={blog.image.path}
              alt={blog.image.altText}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black rounded-full w-20 h-20 pointer-events-none"></div>
        </div>
        <div className="font-bold text-xl mt-2 mb-2 text-center">
          {blog.title}
        </div>
        <p className="text-gray-700 text-base text-center overflow-y-auto">
          {blog.description}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;
