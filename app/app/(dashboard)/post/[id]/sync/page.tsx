
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import React from 'react'
import prisma from '@/lib/prisma';
import CalendarManager from '@/components/editor/calendar-manager';

export default async function CalendarSyncPage({ params }: { params: { id: string } }) {

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
                    id: true,
                    subdomain: true,
                },
            },
        },
    });

    if (!data || data.userId !== session.user.id) {
        notFound();
    }

    return (
        <CalendarManager postId={data.id} />
    )
}
