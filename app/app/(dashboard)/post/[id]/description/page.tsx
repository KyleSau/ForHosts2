import TitleDescriptionEditor from "@/components/editor/description/description";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export default async function DescriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const descriptionData = await prisma.post.findUnique({
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
  if (!descriptionData || descriptionData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <TitleDescriptionEditor post={descriptionData} />
    </div>
  );
}
