import { getAllBlogs } from "@/lib/actions";
import MainBlogComponent from "../../../components/blogs/presenting-blog-component";
export default async function BlogPage() {
  const blogs = await getAllBlogs();
  return (
    <div className="bg-gray-50">
      <MainBlogComponent blogs={blogs} />
    </div>
  );
}
