import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ListingDetails from "@/components/editor/details/listing-details";

import { getBedrooms } from "@/lib/actions";
export default async function listingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      propertyDetails: true,
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
  const bedrooms = await getBedrooms(post.id);
  return (
    <div>
      <ListingDetails data={post} bedrooms={bedrooms} />
    </div>
  );
}
