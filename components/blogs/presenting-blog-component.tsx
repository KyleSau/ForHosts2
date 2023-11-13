import React, { useState } from "react";
import HomeLayout from "@/components/home/home-layout";
import MainBlogCard from "@/components/blogs/main-blog-cards";
import RecentBlogCard from "@/components/blogs/recent-blog-card";

const MainBlogComponent = ({ blogs, heroBlog }: any) => {
  return (
    <HomeLayout>
      <div className="flex h-full w-auto items-center justify-center">
        <div className="flex">
          <div className="flex flex-col justify-center gap-8">
            {heroBlog.map((heroBlog: any) => (
              <MainBlogCard
                key={heroBlog.order}
                blog={blogs.find((blog: any) => blog.id === heroBlog.blogId)}
              />
            ))}
          </div>
          <div className="my-8 ml-12 hidden flex-col md:flex">
            <h1 className="mb-6 text-start text-2xl font-bold">
              Recent Articles
            </h1>
            {blogs.map((blog: any) => (
              <RecentBlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default MainBlogComponent;
