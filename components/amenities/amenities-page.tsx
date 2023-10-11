// pages/amenities.js
import React from 'react';
import AmenityEditor from './amenity-editor';

const AmenitiesPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Edit Amenities</h1>
            <AmenityEditor />
        </div>
    );
};

export default AmenitiesPage;
