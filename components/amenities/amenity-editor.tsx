// AmenityEditor.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // If using FontAwesome with React
import { amenityDetails } from './amenities-data';

const AmenityEditor = () => {
    const [amenityStatus, setAmenityStatus] = useState({});

    const toggleAmenity = (amenityName) => {
        setAmenityStatus((prevState) => ({
            ...prevState,
            [amenityName]: !prevState[amenityName] || false,
        }));
    };

    return (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {Object.keys(amenityDetails).map((amenityName) => (
                <div key={amenityName}>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={() => toggleAmenity(amenityName)}
                            checked={amenityStatus[amenityName]}
                        />
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={amenityDetails[amenityName].icon} className="text-lg" />
                            <span className="ml-2">{amenityName}</span>
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default AmenityEditor;
