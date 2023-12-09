import BlogEditor from "@/components/blogs/blog-editor";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function BlogEditPage({ params }: { params: { id: string } }) {

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    const blogData = await prisma.blog.findUnique({
        where: {
            id: decodeURIComponent(params.id),
        },
    });

    if (!blogData || blogData.userId !== session.user.id) {
        notFound();
    }

    return (
        <div>
            {JSON.stringify(blogData)}
            <BlogEditor post={blogData} />
        </div>);
}