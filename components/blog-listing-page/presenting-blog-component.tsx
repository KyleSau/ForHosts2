"use client";
import React, { useState, useEffect } from "react";
import HomeLayout from "@/components/home/home-layout";
import MainBlogCard from "@/components/blog-listing-page/main-blog-cards";
import RecentBlogCard from "@/components/blog-listing-page/recent-blog-card";
import { Blog } from "@prisma/client";

const MainBlogComponent = ({ blogs }: any) => {
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const heroBlogs: Blog[] = blogs
    .filter((blog: Blog) => blog.order !== null)
    .sort((a: any, b: any) => a.order - b.order);

  const recentBlogs: Blog[] = blogs.filter((blog: Blog) => blog.order === null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleCards < heroBlogs.length) {
        setVisibleCards(visibleCards + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [visibleCards, heroBlogs.length]);

  return (
    <HomeLayout>
      <div className="flex h-full w-auto items-center justify-center">
        <div className="flex">
          <div className="flex flex-col justify-center gap-8">
            {heroBlogs.map((heroBlog: Blog, index: number) => (
              <MainBlogCard
                key={heroBlog.order}
                blog={heroBlog}
                isVisible={index < visibleCards}
              />
            ))}
          </div>
          <div className="my-8 ml-12 hidden flex-col md:flex">
            <h1 className="mb-6 text-start text-2xl font-bold">
              Recent Articles
            </h1>
            {recentBlogs.map((recentBlog: Blog) => (
              <RecentBlogCard key={recentBlog.id} blog={recentBlog} />
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default MainBlogComponent;
