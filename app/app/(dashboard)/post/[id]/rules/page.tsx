import PolicySettings from '@/components/editor/policy-settings'
import React from 'react'

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export default async function RulesPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const post = await prisma.post.findUnique({
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

  if (!post || post.userId !== session.user.id) {
    notFound();
  }

    return (
        <PolicySettings data={post} />
    )
}
