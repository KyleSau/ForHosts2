"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Bedroom } from './types';

interface SleepingSectionProps {
    bedrooms: Bedroom[];
}

const SleepingSection: React.FC<SleepingSectionProps> = ({ bedrooms }) => {
    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="py-8">
                <h2 className="text-2xl font-semibold mb-4 flex justify-center">Where Youll Sleep</h2>
                <Carousel showThumbs={true} showStatus={true} showArrows={true} emulateTouch={true}>
                    {bedrooms.map((bedroom, bedroomIndex) => (
                        <div key={bedroomIndex}>
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-xl font-semibold mb-2">{bedroom.name}</h3>
                                <p className="mb-2">{bedroom.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {bedroom.beds.map((bed, bedIndex) => (
                                        <div key={bedIndex} className="bg-white rounded-lg shadow-md p-4">
                                            <FontAwesomeIcon icon={bed.icon} />
                                            <p className="mt-2 text-lg font-semibold">{bed.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default SleepingSection;
