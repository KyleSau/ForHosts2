import { getAllBlogs } from "@/lib/actions";
import MainBlogComponent from "../../../components/blog-listing-page/presenting-blog-component";
import prisma from "@/lib/prisma";

export default async function BlogPage() {
  // const blogs = await getAllBlogs();

  const blogs = await prisma?.blog.findMany();

  return (
    <div className="bg-gray-50">
      <MainBlogComponent blogs={blogs} />
    </div>
  );
}
