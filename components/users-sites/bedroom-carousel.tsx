import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const bedrooms = [
    { name: 'Bedroom 1', beds: ['1 king bed'] },
    { name: 'Bedroom 2', beds: ['2 queen beds'] },
    { name: 'Bedroom 3', beds: ['2 single beds', '1 sofa bed'] },
    { name: 'Bedroom 4', beds: ['1 queen bed'] },
    { name: 'Bedroom 5', beds: ['1 king bed', '1 single bed'] },
];

const bedTypeIcons = {
    'king bed': faBed,
    'queen bed': faBed,
    'single bed': faBed,
    'sofa bed': faBed,
};

function BedroomCarousel() {
    const [currentBedroomIndex, setCurrentBedroomIndex] = useState(0);
    const bedroomsPerPage = 3;
    const cardHeight = '225px';
    const cardWidth = '225px';

    const canShowNext = currentBedroomIndex + bedroomsPerPage < bedrooms.length;
    const canShowPrevious = currentBedroomIndex > 0;

    const handleNextClick = () => {
        if (canShowNext) {
            setCurrentBedroomIndex(currentBedroomIndex + bedroomsPerPage);
        }
    };

    const handlePreviousClick = () => {
        if (canShowPrevious) {
            setCurrentBedroomIndex(currentBedroomIndex - bedroomsPerPage);
        }
    };

    return (
        <div className="w-full pl-8 relative">
            <div className="text-3xl font-semibold text-gray-800">Where You&apos;ll Sleep</div>
            <div className="flex items-center">
                {canShowPrevious && (
                    <button
                        onClick={handlePreviousClick}
                        className="bg-white p-2 rounded-md hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-gray-600" />
                    </button>
                )}
                <div className={`absolute transition-transform duration-300 ease-in-out ${canShowPrevious ? 'left-0' : 'left-1/3'}`}>
                    {bedrooms
                        .slice(currentBedroomIndex, currentBedroomIndex + bedroomsPerPage)
                        .concat(new Array(3 - bedroomsPerPage).fill(null))
                        .map((bedroom, index) => (
                            <div
                                key={index}
                                className="w-full md:w-1/3 p-4 float-left"
                                style={{ height: cardHeight, width: cardWidth }}
                            >
                                {bedroom && (
                                    <div className="bg-white rounded-lg p-4 border" style={{ height: '100%' }}>
                                        <div className="text-center mb-2">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full m-auto flex items-center justify-center">
                                                {bedTypeIcons[bedroom.beds[0]] ? (
                                                    <FontAwesomeIcon icon={bedTypeIcons[bedroom.beds[0]]} className="text-2xl text-gray-600" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faBed} className="text-2xl text-gray-600" />
                                                )}
                                            </div>
                                            <div className="text-lg font-semibold text-gray-800 mb-1">{bedroom.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {bedroom.beds.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
                {canShowNext && (
                    <button
                        onClick={handleNextClick}
                        className="bg-white p-2 rounded-md hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faArrowRight} className="text-xl text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default BedroomCarousel;
