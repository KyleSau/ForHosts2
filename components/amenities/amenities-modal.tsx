import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "@/components/modal";

type AmenityDetails = {
  icon: any; // replace 'any' with the type of your icons
  description: string;
};

type AmenitiesModalProps = {
  amenityDetails: { [key: string]: AmenityDetails };
};

function AmenitiesModal({ amenityDetails }: AmenitiesModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const amenities = Object.keys(amenityDetails); // get amenity names

  const ModalContent = () => (
    <div className="border border-gray-400 bg-white p-10 z-[210] rounded-lg shadow-lg relative">
      <button
        className="top-2 right-2 text-2xl absolute mr-2"
        onClick={() => setModalOpen(false)}
      >
        &#10005;
      </button>
      <div className="max-h-[60vh] overflow-y-auto">
        <ul className="grid grid-cols-2 gap-4">
          {amenities.slice(10).map((amenity, index) => (
            <li
              className="bg-white border rounded-lg p-4 shadow-md"
              key={index}
            >
              <div className="mb-2">
                <FontAwesomeIcon
                  icon={amenityDetails[amenity].icon}
                  className="text-2xl text-gray-600"
                />
              </div>
              <span className="text-lg font-medium block mb-2">
                {amenity}
              </span>
              <span className="text-sm text-gray-500">
                {amenityDetails[amenity].description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );



  return (
    <div className="w-full p-8 md:p-12 bg-white rounded-md shadow-lg">
      <div className="justify-center flex">
        <div className="grid grid-cols-2 gap-4 w-full">
          {amenities.slice(0, 10).map((amenity, index) => (
            <div className="bg-gray-100 border rounded-lg p-4 shadow-md" key={index}>
              <div className="mb-2">
                <FontAwesomeIcon
                  icon={amenityDetails[amenity].icon}
                  className="text-2xl text-gray-600"
                />
              </div>
              <span className="text-lg font-medium block mb-2">
                {amenity}
              </span>
              <span className="text-sm text-gray-500">
                {amenityDetails[amenity].description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {amenities.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gray-400 rounded-md p-2 hover:bg-gray-200"
          >
            Show all ({amenities.length}) amenities
          </button>
        </div>
      )}

      {isModalOpen && (
        <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
          <ModalContent />
        </Modal>
      )}
    </div>
  );
}

export default AmenitiesModal;
