import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import AddEditBlog from "@/components/blog-manager/AddEditBlog";


export default async function AddEditBlogPage() {

    // query params


    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    const user = await prisma?.user.findUnique({ where: { id: session.user.id } });

    if (user?.role !== Role.USER) {
        notFound();
    }

    return (<div>
        Create Blog Post
        <AddEditBlog />
    </div>);

}