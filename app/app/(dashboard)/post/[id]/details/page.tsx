import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ListingDetails from "@/components/editor/listing-details";
import BedroomList from "@/components/bedroom-list";
export default async function listingDetailsPage({ params }: { params: { id: string } }) {
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

    <div>
      <ListingDetails data={post} />
    </div>
    //
  )
}
