import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';

const bedrooms = [
    { name: 'Bedroom 1', beds: ['1 king bed'] },
    { name: 'Bedroom 2', beds: ['2 queen beds'] },
    { name: 'Bedroom 3', beds: ['2 single beds', '1 sofa bed'] },
    { name: 'Bedroom 4', beds: ['1 queen bed'] },
    { name: 'Bedroom 5', beds: ['1 king bed', '1 single bed'] },
    // Add more bedrooms with arrays of bed descriptions as needed
];

const bedTypeIcons = {
    'king bed': faBed,
    'queen bed': faBed,
    'single bed': faBed,
    'sofa bed': faBed,
    // Add more bed types and corresponding icons here
};

function SleepingQuarters() {
    return (
        <div className="w-full p-8 md:p-12 bg-white rounded-md shadow-lg">
            <div className="text-3xl font-semibold text-gray-800 mb-4">Where You'll Sleep</div>
            <hr className="border-t border-gray-300" />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {bedrooms.map((bedroom, index) => (
                    <div key={index} className="p-4">
                        <div className="bg-gray-100 rounded-lg p-4 shadow-md">
                            <div className="flex items-center mb-2">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                                    {bedTypeIcons[bedroom.beds[0]] ? (
                                        <FontAwesomeIcon icon={bedTypeIcons[bedroom.beds[0]]} className="text-2xl text-gray-700" />
                                    ) : (
                                        <FontAwesomeIcon icon={faBed} className="text-2xl text-gray-700" /> // Default icon if not found
                                    )}
                                </div>
                                <div className="text-xl font-semibold text-gray-800">{bedroom.name}</div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {bedroom.beds.map((bed, bedIndex) => (
                                    <div key={bedIndex}>
                                        {bedTypeIcons[bed] ? (
                                            <FontAwesomeIcon icon={bedTypeIcons[bed]} className="text-sm text-gray-700" />
                                        ) : (
                                            <FontAwesomeIcon icon={faBed} className="text-sm text-gray-700" /> // Default icon if not found
                                        )} {bed}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SleepingQuarters;
