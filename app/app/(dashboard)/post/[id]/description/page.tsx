import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import TitleDescriptionEditor from "@/components/editor/description/title-description-editor";

export default async function ListingDescriptionPage({ params }: { params: { id: string } }) {

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    const post = await prisma.post.findUnique({
        where: {
            id: params.id,
        },
        include: {
            site: {
                select: {
                    subdomain: true,
                },
            },
        },
    });
    if (!post || post.userId !== session.user.id) {
        notFound();
    }

    return (
        <TitleDescriptionEditor post={post} />
    );


}