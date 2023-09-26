import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { FileClickDragDrop } from "@/components/editor/file-drag-drop";
import PreviewComponent from "./preview";
import SitePostPage from "@/app/[domain]/[slug]/page";
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

  // data.slug
  // data.site.domain
  const domainAndSlug = { params: { domain: '', slug: '' } };

  return <div>
    <h3>
      Listing Overview
    </h3>
    {/* <PreviewComponent>
      <SitePostPage params={domainAndSlug} />
    </PreviewComponent> */}
  </div>

  // return <Editor post={data} />;
}
