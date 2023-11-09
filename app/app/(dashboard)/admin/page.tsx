import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import BlogManager from "@/components/blog-manager/BlogManager";


export default async function AdminPage() {

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    const user = await prisma?.user.findUnique({ where: { id: session.user.id } });

    if (user?.role !== Role.ADMIN) {
        notFound();
    }

    return (<div>
        <h3>Admin Dashboard</h3>
        <BlogManager />
        <div>Add Blog Button</div>
        <div>List of blogs with Edit/Delete/View</div>
    </div>);

}