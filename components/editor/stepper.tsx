import React from 'react';

function Stepper({ activeStep }) {
    const totalSteps = 11;
    const progressPercentage = ((activeStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="max-w-screen-lg mx-auto">
            <div className="relative w-full h-2 bg-gray-300 dark:bg-gray-700">
                <div
                    className="absolute top-0 left-0 h-2 bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
}

export default Stepper;
