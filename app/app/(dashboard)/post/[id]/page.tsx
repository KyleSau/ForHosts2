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

<<<<<<< HEAD
  return <div></div>;
=======
  console.log("data: ", data);

  return <div>
    <PhotoManager images={data.images} postId={data.id} siteId={data.siteId!} />
    {/* <asdfasdfa images={data.images} postId={data.id} siteId={data.siteId!} /> */}
    {/* <PhotoManager postData={data} /> */}
    {/* <PhotoGrid images={data.images} postId={data.id} siteId={data.siteId!} /> */}
  </div>

  // return <Editor post={data} />;
>>>>>>> 749a427a6424dde29818a25ab8c93de12aab7c61
}
