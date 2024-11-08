import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Pricing from "@/components/editor/pricing/editor-pricing";
export default async function PricingPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const pricingData = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      pricing: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!pricingData || pricingData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <Pricing data={pricingData} />
    </div>
  );
}
