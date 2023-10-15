import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { PhotoManager } from "@/components/editor/photo-manager/photo-manager";
// import Editor from "@/components/editor";

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

  return <div>
    <PhotoManager postData={data} />
  </div>

  // return <Editor post={data} />;
}
