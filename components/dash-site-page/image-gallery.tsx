"use client"
import React, { useState } from 'react';
import BlurImage from '@/components/blur-image';
import ImageModal from './image-modal';

const placeholderBlurhash = '...';
const placeholderImage = '/placeholder.png';

interface ImageGalleryProps {
  imageBlurhash: string[];
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageBlurhash, images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(true);

  const placeholderImages = Array(4).fill(placeholderImage);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setShowGallery(false); // Hide the ImageGallery when the modal opens
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowGallery(true); // Show the ImageGallery when the modal closes
  };

  const displayedImages = images.slice(0, 4); // Display the first 4 images

  return (
    <div className="col-span-1 md:col-span-full justify-center m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex h-150 items-start justify-center bg-none">
        {showGallery && (
          <>
            <div className="relative w-full h-full max-w-screen-lg overflow-hidden md:h-full md:w-5/6 md:rounded-xl lg:w-2/3">
              {/* Code for the main image */}
              <BlurImage
                alt="Main Property Image"
                width={800}
                height={630}
                className="h-full w-full object-cover cursor-pointer"
                placeholder="blur"
                blurDataURL={imageBlurhash[0] ?? placeholderBlurhash}
                src={images[0] ?? placeholderImage}
                onClick={() => openModal(0)} // Make the main image clickable
              />
            </div>
            <div className="relative ml-4 grid h-full w-2/3 grid-cols-2 gap-2">
              {displayedImages.map((imgSrc: string, index: number) => (
                <div
                  key={index}
                  onClick={() => openModal(index)} // Make the smaller images clickable
                  className="relative h-full w-full overflow-hidden rounded-xl border-gray-600 hover:border-2 hover:opacity-90 hover:shadow-lg cursor-pointer"
                >
                  <BlurImage
                    alt={`Additional Property Image ${index + 1}`}
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                    placeholder="blur"
                    blurDataURL={imageBlurhash[index] ?? placeholderBlurhash}
                    src={imgSrc}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={images[selectedImageIndex]}
          blurHash={imageBlurhash[selectedImageIndex]}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          images={images}
        />
      )}
    </div>
  );
};

export default ImageGallery;

