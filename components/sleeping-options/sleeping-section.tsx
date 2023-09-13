"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface SleepingOption {
    name: string;
    icon: any; // Adjust the type of 'icon' as needed
    description: string;
}

interface SleepingSectionProps {
    sleepingOptions: SleepingOption[];
}

const SleepingSection: React.FC<SleepingSectionProps> = ({ sleepingOptions }) => {
    const chunkSize = 3; // Number of sleeping options to display per slide
    const chunkedSleepingOptions: SleepingOption[][] = [];

    for (let i = 0; i < sleepingOptions.length; i += chunkSize) {
        const chunk = sleepingOptions.slice(i, i + chunkSize);
        chunkedSleepingOptions.push(chunk);
    }

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="py-8">
                <h2 className="text-2xl font-semibold mb-4">Where Youll Sleep</h2>
                <Carousel showThumbs={true} showStatus={true} showArrows={true} emulateTouch={true}>
                    {chunkedSleepingOptions.map((chunk, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chunk.map((option, optionIndex) => (
                                    <div key={optionIndex} className="bg-white rounded-lg shadow-md p-4">
                                        <FontAwesomeIcon icon={option.icon} />
                                        <p className="mt-2 text-lg font-semibold">{option.name}</p>
                                        <p>{option.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default SleepingSection;
