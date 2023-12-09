import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AddBlogPostForm } from "./add-blog-post-form";
import CreateBlogPostButton from "./create-blog-post-button";

export default async function AdminPage() {

    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const userId = session?.user.id;

    if (!userId) {
        redirect("/login");
    }

    const user = await prisma?.user.findUnique({ where: { id: userId } });

    if (user?.role !== Role.USER) {
        redirect("/dashboard");
    }

    const blog = await prisma?.blog.findMany();

    return (
        <main>
            <h1>Admin Dashboard</h1>
            {/* <AddBlogPostForm /> */}
            <CreateBlogPostButton />
            <ul>
                {blog?.map((blogPost) => (
                    <li key={blogPost.id}>
                        <Link href={`admin/blog/${blogPost.id}`}>
                            {blogPost.title}
                            {/* <DeleteForm id={blogPost.id} blogPost={blogPost} /> */}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}