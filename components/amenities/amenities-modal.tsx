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
    <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex justify-center">
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
              <button onClick={() => setModalOpen(true)} className="p-2 m-2 mx-auto rounded-sm justify-center w-[25%] text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 hover:bg-gradient-to-brfont-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Show More
              </button>
            </div>
          }

          {isModalOpen &&
            <Modal showModal={isModalOpen} setShowModal={setModalOpen}>
              <ModalContent />
            </Modal>
          }
        </div>
      </div>
    </div>
  );
}

export default AmenitiesModal;
