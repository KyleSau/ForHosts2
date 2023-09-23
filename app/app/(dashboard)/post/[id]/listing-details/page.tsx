import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ListingDetails from "@/components/editor/listing-details";
export default async function listingDetailsPage({ params }: { params: { id: string } }) {
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
              subdomain: true,
            },
          },
        },
      });
      if (!data || data.userId !== session.user.id) {
        notFound();
      }
  return (
      <ListingDetails data={data} />
      
  )
}
