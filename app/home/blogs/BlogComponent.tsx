"use client";
import React, { useState } from "react";
import BlogCard from "@/components/blogs/blog-card";
import HomeLayout from "@/components/home/home-layout";
import { Section } from "@/components/home/Section";
const PER_PAGE = 6; // Number of blogs per page

const BlogPage = ({ blogs }: any) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastBlog = currentPage * PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - PER_PAGE;
  const sortedBlogs = blogs.sort((a, b) => a.id - b.id);
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const renderBlogs = currentBlogs.map((blog) => (
    <BlogCard key={blog.id} blog={blog} />
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blogs.length / PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => (
    <li
      key={number}
      id={number.toString()}
      onClick={() => setCurrentPage(number)}
      className={`mx-1 px-3 py-2 bg-white text-gray-800 rounded-full border-4 cursor-pointer ${currentPage === number && "border-gray-400 border-2"
        }`}
    >
      {number}
    </li>
  ));

  return (
    <HomeLayout>
      <Section
        title="Blogs"
        description="Various blogs on the rental business"
      >
        <div className="rounded-lg border border-black p-10">
          <div className="flex flex-wrap justify-center md:grid md:grid-cols-3 gap-4">
            {renderBlogs}</div>
          <ul className="flex list-none pl-0 mb-0 justify-center">
            {renderPageNumbers}
          </ul>
        </div>
      </Section>
    </HomeLayout>
  );
};

export default BlogPage;
