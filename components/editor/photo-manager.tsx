"use client"
import React, { useState } from 'react';
import NextImage from 'next/image';
import { Image } from 'prisma/prisma-client'
import BlurImage from '../blur-image';

interface EnrichedImage extends Image {
    blurDataURL: string;
}

interface PhotoManagerProps {
    postId: string;
    images: EnrichedImage[];
}

const PhotoManager: React.FC<PhotoManagerProps> = ({ postId, images }) => {
    const [currentImages, setCurrentImages] = useState<EnrichedImage[]>(images);
    const placeholderBlurhash = "your_blurhash_string_here"; // Add your blurhash string here

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file changes and uploads here
    };

    const uploadVercelBlob = () => {

    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {currentImages.map((image, idx) => (
                <BlurImage
                    key={idx}
                    alt={image.fileName}
                    width={500}
                    height={400}
                    className="h-full object-cover"
                    src={image.url}
                    blurDataURL={image.blurDataURL}
                    placeholder="blur"
                />
            ))}
            <input type="file" multiple onChange={handleFileChange} className="mt-4" />
        </div>
    );
};

export default PhotoManager;
