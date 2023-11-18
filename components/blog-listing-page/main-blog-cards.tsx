"use client";
import React from "react";
import { Button } from "../ui/button";
import { BlogCardProps } from "./types";
import Link from "next/link";
import Image from "next/image";

const MainBlogCard: React.FC<BlogCardProps> = ({ blog, isVisible }) => {
  return (
    <div
      className={`my-6 w-full transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-2">
        <Link href={`/blogs/${blog.slug}`}>
          <article className="  rounded-lg bg-white p-4 shadow-lg ">
            <div className="flex items-start space-x-4 ">
              <Image
                alt="Blog 1 image"
                className="max-w-[150px] rounded-md md:max-w-[275px]"
                height="200"
                src={blog.image}
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="300"
              />

              <div className="md:truncate">
                <h2 className=" text-2xl font-semibold">{blog.title}</h2>
                <div className="text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <div className="mr-1 flex h-8 w-8 items-center justify-center border-0 text-gray-500">
                      <Image
                        alt={blog.author}
                        className=" rounded-full"
                        height="24"
                        title={blog.author}
                        src={blog.avatar}
                        width="24"
                      />
                    </div>
                    Posted on November 11, 2023
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {blog.description}
                </p>
              </div>
            </div>
            <div className="mt-4"></div>
          </article>
        </Link>
      </div>
    </div>
  );
};
export default MainBlogCard;
