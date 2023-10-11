import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function CalendarImportForm() {
    const [importUrls, setImportUrls] = useState([
        {
            title: '',
            url: '',
        },
    ]); // Initial state with one input

    const handleAddInput = () => {
        setImportUrls([...importUrls, { title: '', url: '' }]); // Add an empty input
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedUrls = [...importUrls];
        updatedUrls[index][field] = value;
        setImportUrls(updatedUrls);
    };

    const handleRemoveInput = (index: number) => {
        const updatedUrls = [...importUrls];
        updatedUrls.splice(index, 1); // Remove the input at the specified index
        setImportUrls(updatedUrls);
    };

    const handleSave = (index: number) => {
        // Handle the save logic for the calendar at the specified index
        const calendarToSave = importUrls[index];
        // You can send this data to your backend or handle it as needed.
        // For this example, we'll just log it to the console.
        console.log('Saving Calendar:', calendarToSave);
    };

    return (
        <div>
            {importUrls.map((calendar, index) => (
                <div
                    key={index}
                    className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5"
                >
                    <Label
                        htmlFor={`title${index}`}
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Calendar Title
                    </Label>
                    <div className="col-span-3 col-start-3 flex items-center">
                        <Input
                            type="text"
                            id={`title${index}`}
                            value={calendar.title}
                            onChange={(e) =>
                                handleInputChange(index, 'title', e.target.value)
                            }
                            className="w-full"
                        />
                    </div>
                    <Label
                        htmlFor={`importUrl${index}`}
                        className="col-span-1 col-start-1 flex items-center"
                    >
                        Calendar Import
                    </Label>
                    <div className="col-span-3 col-start-3 flex items-center">
                        <Input
                            type="url"
                            id={`importUrl${index}`}
                            value={calendar.url}
                            onChange={(e) =>
                                handleInputChange(index, 'url', e.target.value)
                            }
                            className="w-full"
                        />
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveInput(index)}
                                className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Remove
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => handleSave(index)}
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ))
            }
            <button
                type="button"
                onClick={handleAddInput}
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 float-right"
            >
                +
            </button>
        </div >
    );
}

export default CalendarImportForm;
