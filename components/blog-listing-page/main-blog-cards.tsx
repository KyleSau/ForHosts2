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
        <article className="rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-start space-x-4 ">
            <Image
              alt="Blog 1 image"
              className="rounded-md"
              height="100"
              src={blog.image}
              style={{
                aspectRatio: "100/100",
                objectFit: "cover",
              }}
              width="100"
            />

            <div className="truncate">
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
          <div className="mt-4">
            <Link href={`/blogs/${blog.slug}`}>
              <Button
                variant="outline"
                className="border border-gray-300 hover:scale-105 hover:font-bold"
              >
                Read More
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
export default MainBlogCard;
