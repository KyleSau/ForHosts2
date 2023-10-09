import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { FileClickDragDrop } from "@/components/editor/file-drag-drop";
import PreviewComponent from "./preview";
import SitePostPage from "@/app/[domain]/[slug]/page";
import Iframe from 'react-iframe'

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
  const local = `localhost:3000`
  const url = `http://${data.site?.subdomain}.${local}/${data.slug}`
  const domainAndSlug = { params: { domain: '', slug: '' } };

  return <div className="w-full h-full">
    <div className="flex md:justify-start justify-center">
      <div className="md:w-screen md:h-screen border border-black w-[300px] h-[500px]">
        <div className="bg-gray-200 top-4 border border-black w-full absolute">LOL.com</div>
        <Iframe url={url}
          id=""
          className=""
          display="block"
          position="relative"
          styles={{ width: "100%", transform: 'scale(1)', height: "100%", }} />
        {/* <PreviewComponent>
      <SitePostPage params={domainAndSlug} />
    </PreviewComponent> */}
      </div>
    </div>
  </div>

  // return <Editor post={data} />;
}
