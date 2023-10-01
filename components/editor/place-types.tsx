import React from 'react';
import { PropertyTypesArray, ListingTypesArray, PlaceTypesArray } from './place-utils'; // Import the arrays
import { Label } from '../ui/label';

function PlaceTypes({ formik }) {
    return (
        <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            {/* Dropdown for Property Types */}
            <Label htmlFor="propertyType" className="col-span-1 col-start-1 flex items-center">
                Property Type
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
                <select
                    id="propertyType"
                    name="propertyType"
                    value={formik.values.propertyType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-md border p-2"
                >
                    <option value="" disabled>
                        Select Property Type
                    </option>
                    {PropertyTypesArray.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown for Listing Types */}
            <Label htmlFor="listingType" className="col-span-1 col-start-1 flex items-center">
                Listing Type
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
                <select
                    id="listingType"
                    name="listingType"
                    value={formik.values.listingType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-md border p-2"
                >
                    <option value="" disabled>
                        Select Listing Type
                    </option>
                    {ListingTypesArray.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown for Place Types */}
            <Label htmlFor="placeType" className="col-span-1 col-start-1 flex items-center">
                Place Type
            </Label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
                <select
                    id="placeType"
                    name="placeType"
                    value={formik.values.placeType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-md border p-2"
                >
                    <option value="" disabled>
                        Select Place Type
                    </option>
                    {PlaceTypesArray.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default PlaceTypes;
