import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type AmenityDetails = {
    icon: any; // Replace 'any' with the type of your icons
    description: string;
};

type HighlightsProps = {
    highlightsData: { [key: string]: AmenityDetails };
};

function Highlights({ highlightsData }: HighlightsProps) {
    const amenities = Object.keys(highlightsData);

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {amenities.map((highlight, index) => (
                    <li
                        className="text-sm text-black align-middle flex flex-col items-center"
                        key={index}
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <div className="m-2">
                            <FontAwesomeIcon icon={highlightsData[highlight].icon} />
                        </div>
                        <span className="font-bold">{highlight}</span>
                        <span className="font-normal">
                            {highlightsData[highlight].description}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Highlights;
