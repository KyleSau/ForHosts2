"use client";
// ImageGallery.js
import React, { useState } from 'react';
import BlurImage from '@/components/blur-image';
import ImageModal from './image-modal'; // Update the path accordingly

const placeholderBlurhash = '...';
const placeholderImage = '/placeholder.png';

interface ImageGalleryProps {
  imageBlurhash: string | undefined | null;
  image: string | undefined | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageBlurhash, image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = Array(4).fill(image ?? placeholderImage);

  const openModal = (index: number) => { 
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (

    <div className="flex h-150 items-start justify-center">
    {!isModalOpen && (
      <>
        <div className="relative w-full h-full max-w-screen-lg overflow-hidden md:mb-5 md:h-full md:w-5/6 md:rounded-2xl lg:w-2/3">
          <BlurImage
            alt="Property Image"
            width={800}
            height={630}
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={imageBlurhash ?? placeholderBlurhash}
            src={image ?? placeholderImage}
          />
        </div>
        <div className="relative ml-4 grid h-full w-2/3 grid-cols-2 gap-2">
          {/* Render the grid of smaller images */}
          {images.map((imgSrc, index) => (
            <div
              key={index}
              onClick={() => openModal(index)} // Open modal on image click
              className="relative h-full w-full overflow-hidden rounded-2xl border-gray-600 hover:border-2 hover:opacity-90 hover:shadow-lg"
            >
              <BlurImage
                alt={`Additional Property Image ${index + 1}`}
                width={300}
                height={400}
                className="h-full w-full object-cover"
                placeholder="blur"
                blurDataURL={imageBlurhash ?? placeholderBlurhash}
                src={imgSrc}
              />
            </div>
          ))}
        </div>
      </>
    )}
      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex} // Pass the function here
      />
    </div>
  );
};

export default ImageGallery;
