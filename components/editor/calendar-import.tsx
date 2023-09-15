import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function CalendarImportForm() {
    const [importUrls, setImportUrls] = useState(['']); // Initial state with one input

    const handleAddInput = () => {
        setImportUrls([...importUrls, '']); // Add an empty input
    };

    const handleInputChange = (index, event) => {
        const updatedUrls = [...importUrls];
        updatedUrls[index] = event.target.value;
        setImportUrls(updatedUrls);
    };

    const handleRemoveInput = (index) => {
        const updatedUrls = [...importUrls];
        updatedUrls.splice(index, 1); // Remove the input at the specified index
        setImportUrls(updatedUrls);
    };

    return (
        <div>
            {importUrls.map((url, index) => (
                <div key={index} className="text-sm font-medium text-gray-900 grid grid-cols-5 gap-4 mb-5 mt-5">
                    <Label htmlFor={`importUrl${index}`} className="col-span-1 col-start-1 flex items-center">Calendar Import</Label>
                    <div className="col-span-3 col-start-3 flex items-center">
                        <Input
                            type="url"
                            id={`importUrl${index}`}
                            value={url}
                            onChange={(e) => handleInputChange(index, e)}
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
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddInput}
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                +
            </button>
        </div>
    );
}

export default CalendarImportForm;
