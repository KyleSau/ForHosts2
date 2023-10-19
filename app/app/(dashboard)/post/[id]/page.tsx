import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PhotoManager from "@/components/editor/photo-manager/photo-manager";
import { resequenceOrderIndices } from "@/lib/blob_actions";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      images: true,
      site: {
        select: {
          id: true,
          subdomain: true,
        },
      },
    },
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const sortedImages = [...data.images].sort((a, b) => a.orderIndex - b.orderIndex);

  return <div>
    <PhotoManager images={sortedImages} postId={data.id} siteId={data.siteId!} />
  </div>
}
