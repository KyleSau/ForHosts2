import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import BlogManager from "@/components/blog-manager/BlogManager";
import { getAllBlogs } from "@/lib/actions";
import BlogForm from "@/components/blog-manager/BlogForm";


export default async function AdminBlogPage() {

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    const user = await prisma?.user.findUnique({ where: { id: session.user.id } });

    if (user?.role !== Role.USER) {
        notFound();
    }

    const blogs = await getAllBlogs();

    return (<div>
        <div>Admin Dashboard</div>
        {/* <BlogForm onSubmit={handleFormSubmit} initialValues={editingBlog} /> */}
        <BlogManager blogs={blogs} />

    </div>);

}