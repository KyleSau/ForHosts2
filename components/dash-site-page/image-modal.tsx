import Image from "next/image";
import React, { useEffect } from "react";
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
}
const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  selectedImageIndex,
  setSelectedImageIndex,
}) => {
  const handlePrev = () => {
    const newIndex = (selectedImageIndex - 1 + images.length) % images.length;
    setSelectedImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImageIndex(newIndex);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Specify the event type here
      const target = event.target as HTMLElement;
      if (isOpen && target && !target.closest(".relative")) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return isOpen ? (
    <div className="relative inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-container">
        <div className="modal-content mx-auto max-h-screen w-full max-w-screen-lg overflow-hidden rounded-lg bg-white shadow-lg">
          <button
            className="absolute right-2 top-2 text-gray-800 hover:text-black"
            onClick={onClose}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div className="flex justify-center">
          <Image
              src={images[selectedImageIndex]}
              alt={`Property Image ${selectedImageIndex}`}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }} // optional
            />
          </div>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-800 hover:text-black"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-800 hover:text-black"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ImageModal;
