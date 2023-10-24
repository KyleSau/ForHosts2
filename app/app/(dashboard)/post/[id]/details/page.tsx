import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ListingDetails from "@/components/editor/listing-details/listing-details-form";

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
  if (!post || post.userId !== session.user.id || !post.propertyDetails) {
    notFound();
  }

  const propertyDetails = {
    id: post.propertyDetails.id,
    listingType: post.propertyDetails.listingType,
    placeType: post.propertyDetails.placeType,
    propertyType: post.propertyDetails.propertyType,
    maxGuests: post.propertyDetails.maxGuests,
    maxPets: post.propertyDetails.maxPets,
    totalBedrooms: post.propertyDetails.totalBedrooms,
    bathrooms: post.propertyDetails.bathrooms
  };

  return (
    <div>
      <ListingDetails propertyDetails={propertyDetails} />
    </div>
  );
}
