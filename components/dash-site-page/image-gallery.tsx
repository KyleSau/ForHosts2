// ImageGallery.js
import React from 'react';
import BlurImage from "@/components/blur-image";
const placeholderBlurhash = '...'; // define your placeholder blurhash here
const placeholderImage = "/placeholder.png";
interface ImageGalleryProps {
    imageBlurhash: string | undefined | null;
    image: string | undefined | null;
  }
  const ImageGallery: React.FC<ImageGalleryProps> = ({ imageBlurhash, image }) => {
    return (
      <div className="flex justify-center items-start h-150">
        <div className="relative w-full max-w-screen-lg overflow-hidden md:mb-5 md:h-full md:w-5/6 md:rounded-2xl lg:w-2/3">
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
        <div className="relative grid grid-cols-2 gap-2 ml-4 w-2/3 h-full">
        {Array(4).fill(null).map((_, index) => (
            <div key={index} className="relative h-full w-full overflow-hidden rounded-2xl hover:shadow-lg hover:border-2 border-gray-600 hover:opacity-90">
              <BlurImage
                alt={`Additional Property Image ${index + 1}`}
                width={300}
                height={400}
                className="h-full w-full object-cover"
                placeholder="blur"
                blurDataURL={imageBlurhash ?? placeholderBlurhash}
                src={image ?? placeholderImage}
              />
            </div>
          ))}
          <button className="absolute bottom-2 right-2 bg-white text-xs px-4 py-2 rounded-lg hover:scale-105 font-bold">
            Show all photos
          </button>
        </div>
      </div>
    )
  }
    
  export default ImageGallery;
  