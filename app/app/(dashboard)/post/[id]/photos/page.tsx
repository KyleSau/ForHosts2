import React from 'react'
import prisma from '@/lib/prisma';
import PhotoGrid from '@/components/editor/photo-manager/photo-grid';
import ListingImages from '@/components/editor/listing-images';

export default async function ListingImagePage({ params }: { params: { id: string } }) {

    const data = await prisma.post.findUnique({
        where: {
            id: params.id,
        },
        include: {
            images: true,
            site: {
                select: {
                    id: true,
                    subdomain: true,
                },
            },
        },
    });


    return (
        <div>
            <ListingImages data={data} />
            <PhotoGrid images={data?.images} />
        </div>
    )
}
