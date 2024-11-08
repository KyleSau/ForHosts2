"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "@/components/modal";

type AmenityDetails = {
  icon: any;  // replace 'any' with the type of your icons
  description: string;
};

type AmenitiesModalProps = {
  amenityDetails: { [key: string]: AmenityDetails };
};

function AmenitiesModal({ amenityDetails }: AmenitiesModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const amenities = Object.keys(amenityDetails);  // get amenity names

  const ModalContent = () => (
    <div className="border border-gray-400 bg-white p-6 z-[210]">
      <button
        className="top-1 right-4 text-2xl"
        onClick={() => setModalOpen(false)}
      >
        &#10005;
      </button>
      <ul className="grid grid-cols-2 w-full">
        {amenities.slice(10).map((amenity, index) => (
          <li
            className="text-sm grid items-center dark:text-black h-full w-full"
            key={index}
          >
            <div className={`justify-center`}>
              <FontAwesomeIcon icon={amenityDetails[amenity].icon} />
              <br />
              <span className="text-sm font-medium m-5">{amenity}<br /></span>
              {amenityDetails[amenity].description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );


  return (
    <div className="w-full">
      <ul className="grid grid-cols-2 w-full">
        {amenities.slice(0, 10).map((amenity, index) => (
          <li
            className="text-sm text-black align-middle"
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div className="m-2">
              <FontAwesomeIcon icon={amenityDetails[amenity].icon} />
            </div>
            <span className="text-sm font-medium">
              {amenity}
            </span>
            <span className="font-normal">
              {amenityDetails[amenity].description}
            </span>
          </li>
        ))}
      </ul>


      {amenities.length > 10 &&  // Show the modal button if there are more than 10 amenities
        <div className="flex justify-center">
          <br />
          <button onClick={() => setModalOpen(true)} className="bg-gray-400 rounded-md p-2 hover:bg-gray-200 mx-auto">
            Show all ({amenities.length}) amenities
          </button>
        </div>
      }

      {isModalOpen &&
        <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
          <ModalContent />
        </Modal>
      }
    </div>
  );
}

export default AmenitiesModal;
