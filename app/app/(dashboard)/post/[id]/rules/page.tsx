import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PolicySettings from "@/components/editor/policy-rules/policy-settings";
export default async function RulesPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const rulesData = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      propertyRules: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  if (!rulesData || rulesData.userId !== session.user.id) {
    notFound();
  }

  return (
    <div>
      <PolicySettings data={rulesData} />
    </div>
  );
}
