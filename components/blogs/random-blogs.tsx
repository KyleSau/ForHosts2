"use client";
import { useState, useEffect } from 'react';
import { blogs } from "@/components/blogs/blog-data";
import { Blog } from "@/components/blogs/types";

export const useRandomBlogs = (count: number): Blog[] => {
  const [randomBlogs, setRandomBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const shuffledBlogs = [...blogs].sort(() => Math.random() - 0.5);
    setRandomBlogs(shuffledBlogs.slice(0, count));
  }, [count]);

  return randomBlogs;
};
