"use client";
// ImageGallery.js
import React, { useState } from 'react';
import BlurImage from '@/components/blur-image';
import ImageModal from './image-modal'; // Update the path accordingly

const placeholderBlurhash = '...';
const placeholderImage = '/placeholder.png';

interface ImageGalleryProps {
  imageBlurhash: string[];
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageBlurhash: imageBlurhashes, images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // const images = Array(4).fill(image ?? placeholderImage);

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
          <div className="relative w-full h-full max-w-screen-lg overflow-hidden md:h-full md:w-5/6 md:rounded-s-xl lg:w-2/3">
            <BlurImage
              alt="Property Image"
              width={800}
              height={630}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={imageBlurhashes[0] ?? placeholderBlurhash}
              src={images[0].url ?? placeholderImage}
            />
          </div>
          <div className="relative ml-4 grid h-full w-2/3 grid-cols-2 gap-2">
            {/* Render the grid of smaller images */}


            {/* do bounds checks here */}
            {images.splice(1, 4).map((imgSrc: any, index: any) => (
              <div
                key={index}
                onClick={() => openModal(index)} // Open modal on image click
                className="relative h-full w-full overflow-hidden border-gray-600 hover:border-2 hover:opacity-90 hover:shadow-lg"
              >
                <BlurImage
                  alt={`Additional Property Image ${index + 1}`}
                  width={300}
                  height={400}
                  className="h-full w-full object-cover"
                  placeholder="blur"
                  blurDataURL={imageBlurhashes[index] ?? placeholderBlurhash}
                  src={imgSrc.url}
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
        // images={images}
        image={images[selectedImageIndex]}
        blurHash={imageBlurhashes[selectedImageIndex]}
      // selectedImageIndex={selectedImageIndex}
      // setSelectedImageIndex={setSelectedImageIndex} // Pass the function here
      />
    </div>
  );
};

export default ImageGallery;
