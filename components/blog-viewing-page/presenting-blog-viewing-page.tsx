import React from "react";
import Image from "next/image";
import RecentBlogCard from "../blog-listing-page/recent-blog-card";
import { getMdxSource } from "@/lib/fetchers";
import MDX from "../mdx";
const MainBlogViewingComponent = async ({ blog }: any) => {

  const mdx = await getMdxSource(blog.content);
  return (
    <div className="px-4 py-6 md:px-6 md:py-12 lg:py-16">
      <article className="prose prose-zinc dark:prose-invert mx-auto">
        <div className="not-prose space-y-2">
          <h1 className="text-center text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">
            {blog.title}
          </h1>
          <div className="flex justify-center  text-zinc-500 dark:text-zinc-400">
            <p>
              Posted on {new Date(blog.updatedAt).toLocaleString("en-US")} by
            </p>
            <Image
              alt="Author's Profile Picture"
              className="ml-2 h-6 w-6 rounded-full"
              height="24"
              title={blog.author}
              src={blog.avatar}
              style={{
                aspectRatio: "24/24",
                objectFit: "cover",
              }}
              width="24"
            />
            <p className="ml-2">{blog.author}</p>
          </div>
        </div>
        <figure className="mt-8 flex justify-center">
          <Image
            alt="Main blog image"
            className="aspect-video object-cover"
            height="340"
            src={blog.image}
            width="1250"
          />
        </figure>
        <figcaption className="text-center">Image caption</figcaption>
        {/* <p className="mt-8 text-center">{blog.content}</p> */}
        <MDX source={mdx} />

      </article>
    </div>
  );
};
export default MainBlogViewingComponent;
