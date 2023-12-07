import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import { getBedrooms } from "@/lib/actions";
import Location from "@/components/editor/location/location";
export default async function LocationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const locationData = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      location: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!locationData || locationData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <Location data={locationData} />
    </div>
  );
}
