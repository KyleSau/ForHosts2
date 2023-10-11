import ListingImages from '@/components/editor/listing-images'
import React from 'react'
import prisma from '@/lib/prisma';

export default async function ListingImagePage({ params }: { params: { id: string } }) {

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

    return (
        <ListingImages data={data} />
    )
}
