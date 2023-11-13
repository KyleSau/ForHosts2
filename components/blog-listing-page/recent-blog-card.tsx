import React from "react";
import { BlogCardProps } from "./types";
import Image from "next/image";

const RecentBlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="mx-2 my-2 w-full cursor-pointer text-start">
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        <li className="flex items-start space-x-4 py-4">
          <Image
            alt="Blog 3 image"
            className="rounded-md"
            height="50"
            src="/forhoststestlogo.png"
            style={{
              aspectRatio: "50/50",
              objectFit: "cover",
            }}
            width="50"
          />
          <div>
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Posted on November 9, 2023
            </p>
          </div>
        </li>
      </ul>
      <hr />
    </div>
  );
};
export default RecentBlogCard;
