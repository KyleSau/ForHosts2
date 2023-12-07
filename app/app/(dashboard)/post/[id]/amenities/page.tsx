import AmenitySelection from "@/components/editor/amenity/amenity-editor-selection";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { amenityDetails } from "@/components/amenities/amenities-data";
export default async function AvailabilityPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const staticData = Object.keys(amenityDetails);
  if (!session) {
    redirect("/login");
  }
  const amenityData = await prisma.post.findUnique({
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
  if (!amenityData || amenityData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <AmenitySelection staticAmenities={staticData} />
    </div>
  );
}
