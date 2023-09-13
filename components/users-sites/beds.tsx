import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

type SleepingOption = {
    name: string;
    icon: string;
};

type SleepingSectionProps = {
    sleepingOptions: SleepingOption[];
};

const SleepingSection: React.FC<SleepingSectionProps> = ({ sleepingOptions }) => {
    const isCarousel = sleepingOptions.length > 3;

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="py-8">
                <h2 className="text-2xl font-semibold mb-4">Where youll sleep</h2>
                {isCarousel ? (
                    <Carousel showThumbs={false}>
                        {sleepingOptions.map((option, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4">
                                {/* Add your icon here */}
                                <p className="mt-2 text-lg font-semibold">{option.name}</p>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sleepingOptions.map((option, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4">
                                {/* Add your icon here */}
                                <p className="mt-2 text-lg font-semibold">{option.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SleepingSection;
