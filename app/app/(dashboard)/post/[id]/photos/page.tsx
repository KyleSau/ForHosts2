import React from 'react'
import prisma from '@/lib/prisma';
import PhotoGrid from '@/components/editor/photo-manager/photo-grid';
import ListingImages from '@/components/editor/listing-images';
import { FileClickDragDrop } from '@/components/editor/file-drag-drop';
import { getBlobMetadata } from '@/lib/blob_actions';
import { notFound } from 'next/navigation';

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

    if (!data) {
        notFound();
    }

    const siteId = data.site?.id;

    const currentBlobMetadataForPost = await getBlobMetadata(siteId!, data.id);

    const currentFileDataObjects = currentBlobMetadataForPost.map(
        (blobMetadata: any & { post: any | null }) => {
            const fileDataObject: any = {
                inBlobStore: true,
                isUploading: false,
                ...blobMetadata
            }
            return fileDataObject;
        }
    );


    return (
        <div>
            <PhotoGrid currentFileDataObjects={currentFileDataObjects} siteId={siteId} images={data?.images} postId={data.id} />
            {/* <FileClickDragDrop currentFileDataObjects={currentFileDataObjects} data={data} /> */}
        </div>
    )
}
