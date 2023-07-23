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
    <div className=" relative border border-gray-400 bg-white p-6">
        <button  
      className="absolute top-1 right-4 text-2xl" 
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
      <h2 className={"text-lg"}>Amenities</h2>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 w-100" />
      <ul className="grid grid-cols-2 w-full">
        {amenities.slice(0, 10).map((amenity, index) => (  // Display up to 10 amenities initially
          <li
            className="text-sm grid items-center text-black h-full w-full"
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
     
      {amenities.length > 10 &&  // Show the modal button if there are more than 10 amenities
        <button onClick={() => setModalOpen(true)} className="bg-gray-400 rounded-md p-2 hover:bg-gray-200">
          Show all ({amenities.length}) amenities
        </button>
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
