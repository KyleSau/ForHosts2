import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/components/blogs/types";

interface BlogItemProps {
  blog: Blog;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog }) => (
  <div className="flex flex-col items-center justify-center space-y-4 p-4">
    <Image src={blog.image.path} alt={blog.image.altText} width={52} height={52} />
    <h2 className="text-2xl font-semibold text-center">{blog.title}</h2>
    <p className="text-lg text-center text-gray-700">{blog.description}</p>
    <Link legacyBehavior href={`/blogs/${blog.slug}`}>
      <a className="text-blue-600 hover:text-blue-800">Read More &#8599;</a>
    </Link>
  </div>
);

export default BlogItem;
