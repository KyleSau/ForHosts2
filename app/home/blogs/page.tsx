import { getAllBlogs, getHeroBlogs } from "@/lib/actions";
import MainBlogComponent from "../../../components/blogs/presenting-blog-component";
export default async function BlogPage() {
  const blogs = await getAllBlogs();
  const heroBlog = await getHeroBlogs();
  return (
    <div className="bg-gray-50">
      <MainBlogComponent blogs={blogs} heroBlog={heroBlog} />
    </div>
  );
}
