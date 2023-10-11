import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '@/components/Modal';

type Amenity = {
  id: string;
  category: string;
  description: string | null;
  icon: IconDefinition | null;
};

type AmenitiesModalProps = {
  amenityDetails: Amenity[];
};

function AmenitiesModal({ amenityDetails }: AmenitiesModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const ModalContent = () => (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
      <button className="absolute top-4 right-4 text-2xl" onClick={() => setModalOpen(false)}>
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-4">Amenities</h2>
      <div className="grid grid-cols-2 gap-4">
        {amenityDetails.map((amenity, index) => (
          <div key={index} className="text-2xl text-gray-600 flex items-center mb-4">
            {amenity.icon && <FontAwesomeIcon icon={amenity.icon} className="mr-2" />}
            <span className="text-base font-semibold ml-2">{amenity.id}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-8 lg:p-12">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenityDetails.slice(0, 10).map((amenity, index) => (
            <div className="text-lg text-gray-600 flex items-center mb-4" key={index}>
              {amenity.icon && <FontAwesomeIcon icon={amenity.icon} className="mr-2" />}
              <span className="text-base font-semibold ml-2">{amenity.id}</span>
            </div>
          ))}
        </div>
      </div>

      {amenityDetails.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md p-2 hover:bg-gray-100 border border-black"
          >
            Show all ({amenityDetails.length}) amenities
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
