import PreviewSite from "@/components/preview/preview-site";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

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

  const local = `localhost:3000`
  const url = `http://${data.site?.subdomain}.${local}/${data.slug}`

  return (
    <div>
      <PreviewSite url={url} />
    </div>
  );
}
