import Availability from "@/components/editor/availability/availability";
import InfoForGuests from "@/components/editor/info/info-for-guests";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export default async function InfoPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const infoData = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      afterBookingInfo: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!infoData || infoData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <InfoForGuests data={infoData} />
    </div>
  );
}
