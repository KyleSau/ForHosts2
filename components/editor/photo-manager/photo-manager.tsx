"use client"
import React, { useState } from 'react'
import { ReactSortable, Sortable } from 'react-sortablejs';
import PhotoUploader from './photo-uploader';
import { Image } from '@prisma/client';

import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT } from "@/lib/constants";
import PhotoCard from './photo-card';
import { put } from '@vercel/blob';
import { shiftBlobMetadata, uploadBlobMetadata } from '@/lib/blob_actions';
import LocalPhotoCard from './local-photo-card';
import { LocalPhoto } from './local-photo';
const PERMITTED_TYPES = [FILE_CONSTS.FILE, FILE_CONSTS.JPEG, FILE_CONSTS.PNG];

const IMAGE_SIZE_LIMIT_MB = 30;
const IMAGE_SIZE_LIMIT_BYTES = IMAGE_SIZE_LIMIT_MB * 1024 * 1024;

interface PhotoMangerProps {
    images: Image[];
    postId: string;
    siteId: string;
}

export default function PhotoManager({ images, postId, siteId }: PhotoMangerProps) {

    const [photos, setPhotos] = useState<Image[]>(images);
    const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);

    const onPhotoDragEnd = async (event: Sortable.SortableEvent) => {
        const { oldIndex, newIndex } = event;
        if (oldIndex === undefined || newIndex === undefined)
            return;
        shiftBlobMetadata(postId, oldIndex, newIndex);
    }

    const onPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const localFiles = Array.from(files ?? []).filter(file => PERMITTED_TYPES.includes(file.type));

        if (photos.length > IMAGE_UPLOAD_QUANTITY_LIMIT || photos.length + localFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT) {
            alert(`Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`);
            return;
        }

        setLocalPhotos(prevLocalPhotos => [
            ...prevLocalPhotos,
            ...localFiles.map(file => ({ url: URL.createObjectURL(file), name: file.name }))
        ]);

        uploadPhotos(localFiles);
    }

    const uploadPhotos = async (localFiles: File[]) => {
        let oversizedFileNames: string[] = [];

        for (const file of localFiles) {
            if (file.size > IMAGE_SIZE_LIMIT_BYTES) {
                oversizedFileNames.push(file.name);
                continue;
            }

            try {
                const blobResult = await put(file.name, file, {
                    access: 'public',
                    handleBlobUploadUrl: '/api/upload'
                });

                const image = await uploadBlobMetadata(blobResult, postId, siteId);

                if (image) {
                    setPhotos(prevPhotos => [...prevPhotos, image]);

                    // Remove the corresponding localPhoto
                    setLocalPhotos(prevLocalPhotos =>
                        prevLocalPhotos.filter(localPhoto => localPhoto.name !== file.name)
                    );
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        // Remove all oversized files from localPhotos at once
        if (oversizedFileNames.length > 0) {
            alert(`${JSON.stringify(oversizedFileNames)} ${oversizedFileNames.length > 1 ? 'were' : 'was'} not uploaded because it exceeds the file size limit of ${IMAGE_SIZE_LIMIT_MB} MB.`);
            setLocalPhotos(prevLocalPhotos =>
                prevLocalPhotos.filter(localPhoto => !oversizedFileNames.includes(localPhoto.name))
            );
        }
    };


    return (
        <div>
            <ReactSortable
                className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3 grid-rows-[300px] md:grid-rows-[300px] 2xl:grid-rows-[300px]"
                list={photos}
                setList={setPhotos}
                onEnd={onPhotoDragEnd}
                filter=".non-draggable"
                preventOnFilter={false}
            >
                {photos.map((photo: Image, index: number) => (
                    <PhotoCard postId={postId} key={photo.orderIndex} index={index} photo={photo} />
                ))}
                {localPhotos.map((photo: LocalPhoto) => (
                    <LocalPhotoCard key="non-draggable" photo={photo} className="relative non-draggable" />
                ))}
                <PhotoUploader onFileUpload={onPhotoUpload} />
            </ReactSortable>
        </div>
    )
}