"use client"
import Stepper from '@/components/editor/stepper'
import EditorWrapper from '@/components/editor/editor-container-wrapper'
import React, { useState } from 'react';
import Map from '@/components/users-sites/open-street-map';
import Location from '@/components/editor/location';

function StepperPage({ data }) {

    const [activeStep, setActiveStep] = useState(1);

    const handleStepChange = (newStep) => {
        setActiveStep(newStep);
    };

    return (
        <div className="container mx-auto p-4">
            <EditorWrapper>
                {/* Display the stepper component */}
                <Stepper activeStep={activeStep} />

                {/* Content for each step */}
                {activeStep === 1 && (
                    <div className="">
                        <h2 className="text-xl font-semibold mb-2 mt-5">Which of these best describes your place?</h2>
                        <p>This is the content for Step 1.</p>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">What type of place will guests have?</h2>
                        <p>An entire place
                            A room
                            A shared room
                        </p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Where&apos;s your place located?</h2>
                        <p>Your address is only shared with guests after they’ve made a reservation.</p>
                        {/* <Location data={data} /> */}
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 4 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Share some basics about your place</h2>
                        <p>You&apos;ll add more details later, like bed types.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 5 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Tell guests what your place has to offer</h2>
                        <p>Amentities Selector here.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 6 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Add some photos of your (house)</h2>
                        <p>You can add more or make changes later.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 7 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Now, let&apos;s give your house a title</h2>
                        <p>Short titles work best. Have fun with it—you can always change it later.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 8 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Next, let&apos;s describe your house</h2>
                        <p>Choose up to 2 highlights. We&apos;ll use these to get your description started.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 9 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Create your description</h2>
                        <p>Share what makes your place special.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 10 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Decide how you’ll confirm reservations</h2>
                        <p>Instant book enabled?</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleStepChange(activeStep + 1)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 11 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Now, set your price</h2>
                        <p>You can change it anytime.</p>
                        <div className="absolute bottom-4 left-4">
                            <button
                                onClick={() => handleStepChange(activeStep - 1)}
                                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={null}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                )}
            </EditorWrapper>
        </div>
    );
}

export default StepperPage;

