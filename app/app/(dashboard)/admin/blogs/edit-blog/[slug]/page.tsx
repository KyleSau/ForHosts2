import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import AddEditBlog from "@/components/blog-manager/AddEditBlog";
import { getBlogById } from "@/lib/actions";

export default async function AddEditBlogPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { slug } = params;
  console.log(slug);

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const user = await prisma?.user.findUnique({
    where: { id: session.user.id },
  });

  // if (user?.role !== Role.USER) {
  //     notFound();
  // }

  const blog = await getBlogById(slug);

  return (
    <div>
      Create Blog Post
      <AddEditBlog blog={blog} />
    </div>
  );
}
