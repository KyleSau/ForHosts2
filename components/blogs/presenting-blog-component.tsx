import React, { useState } from "react";
import HomeLayout from "@/components/home/home-layout";
import MainBlogCard from "@/components/blogs/main-blog-cards";
import RecentBlogCard from "@/components/blogs/recent-blog-card";

const MainBlogComponent = ({ blogs }: any) => {
  return (
    <HomeLayout>
      <div className="vh-full flex items-center justify-center bg-gray-50">
        <div className="flex">
          <div className="flex flex-col justify-center gap-8">
            {blogs.map((blog: any) => (
              <MainBlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className="my-8 ml-12 flex flex-col">
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
