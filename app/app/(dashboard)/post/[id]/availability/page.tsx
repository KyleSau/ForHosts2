import Availability from "@/components/editor/availability/availability";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export default async function AvailabilityPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      availability: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });

  if (!data || data.userId !== session.user.id || !data.availability) {
    notFound();
  }

  const availability = {
    id: data.availability.id,
    instantBooking: data.availability.instantBooking,
    minStay: data.availability.minStay,
    maxStay: data.availability.maxStay,
    advanceNotice: data.availability.advanceNotice,
    sameDayAdvanceNotice: data.availability.sameDayAdvanceNotice,
    preparationTime: data.availability.preparationTime,
    availabilityWindow: data.availability.availabilityWindow,
    restrictedCheckIn: data.availability.restrictedCheckIn,
    restrictedCheckOut: data.availability.restrictedCheckOut,
    checkInWindowStart: data.availability.checkInWindowStart,
    checkInWindowEnd: data.availability.checkInWindowEnd,
    checkInTime: data.availability.checkInTime,
    checkOutTime: data.availability.checkOutTime,
  };

  return (
    <div>
      <Availability availability={availability} />
    </div>
  );
}
