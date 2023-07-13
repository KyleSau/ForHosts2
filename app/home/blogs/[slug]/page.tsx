"use client";
import { useParams } from "next/navigation";
import { blogs } from "@/components/blogs/blogData";
import { Blog } from "@/components/blogs/types";
import HomeLayout from "@/components/home/HomeLayout";
import Meta from "@/components/meta";
import { Metadata } from "next";
const BlogDetail: React.FC = () => {
  const params = useParams();
  const { slug } = params;

  const blog: Blog | undefined = blogs.find((blog) => blog.slug === slug);


  if (!blog) {
    return (
      <HomeLayout>
        <div className="flex justify-center pt-8">Blog not found</div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Meta title=" test" description="test" keywords="test" />
      <div className="flex flex-col items-center space-y-4 p-4">
        <h1 className="mb-4 text-center text-4xl font-bold">{blog.title}</h1>
        <img src={blog.image.path} alt={blog.image.altText} className="mb-4" />
        <p className="text-center">{blog.content}</p>
      </div>
    </HomeLayout>
  );
};

export default BlogDetail;
