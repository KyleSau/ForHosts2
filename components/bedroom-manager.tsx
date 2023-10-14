import React, { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { PlusCircle, MinusCircle, XCircle } from 'lucide-react';
import { getBedrooms, updateBedroom } from '@/lib/actions';
import LoadingDots from './icons/loading-dots';
import { Bedroom } from '@prisma/client';
import IncrementDecrementButton from './increment-decrement-buttons';

const bedTypes = [
    'double',
    'queen',
    'single',
    'sofaBed',
    'king',
    'smallDouble',
    'couch',
    'bunkBed',
    'floorMattress',
    'airMattress',
    'crib',
    'toddlerBed',
    'hammock',
    'waterBed',
];

interface BedroomListProps {
    totalBedrooms: number;
    postId: string;
    bedrooms: Bedroom[];
}

function BedroomManager({ totalBedrooms, postId, bedrooms }: BedroomListProps) {
    const [bedroomData, setBedroomData] = useState<Bedroom[]>(bedrooms);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleEdit = (index: number) => {
        setEditIndex(index);
    };

    useEffect(() => {
        async function fetchBedrooms() {
            try {
                const data: Bedroom[] | null = await getBedrooms(postId);
                if (data !== null) {
                    setBedroomData(data);
                }
            } catch (error) {
                console.error("Error fetching bedrooms:", error);
            }
        }
        fetchBedrooms();
    }, [bedrooms, postId]);

    useEffect(() => {
        if (editIndex !== null) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }
    }, [editIndex]);

    const saveBedroomData = async (index: number) => {
        setIsLoading(true);

        const updatedBedroomData = { ...bedroomData[index] };
        const updatedBedroom = await updateBedroom(updatedBedroomData);

        if (updatedBedroom) {
            try {
                const data: Bedroom[] | null = await getBedrooms(postId);
                if (data !== null) {
                    setBedroomData(data);
                }
            } catch (error) {
                console.error("Error fetching updated bedrooms:", error);
            }
        }

        setIsLoading(false);
    };

    const handleModalClose = async () => {
        if (editIndex !== null) {
            await saveBedroomData(editIndex);
        }
        setEditIndex(null);
    };

    const handleBedChange = (index: number, bedType: string, change: number) => {
        setBedroomData((prevData) => {
            const newData = [...prevData];
            newData[index][bedType] = Math.max(0, prevData[index][bedType] + change);
            return newData;
        });
    };

    const handleAddArrangement = (index: number) => {
        setBedroomData((prevData) => {
            const newData = [...prevData];
            bedTypes.forEach((bedType) => {
                newData[index][bedType] = 0;
            });
            return newData;
        });
        setEditIndex(index);
    };

    const displayBedCount = (beds: Record<string, number> | null) => {
        if (!beds || typeof beds !== 'object') {
            return '';
        }

        const bedStrings = bedTypes
            .filter((bedType) => beds[bedType] > 0)
            .map((bedType) => `${beds[bedType]} ${bedType.toLowerCase()}${beds[bedType] > 1 ? 's' : ''}`);
        return bedStrings.join(', ');
    };

    return (
        <div className="space-y-4">
            Bedroom Manager
            <hr />
            {bedroomData.map((bedroom, index) => (
                <div key={index} className="border p-4 rounded shadow-sm">
                    <Label className='text-slate-800 text-xl'>Bedroom {index + 1}</Label>
                    <div>{bedroom.id}</div>
                    <div className="mt-2">
                        {bedTypes.some((bedType) => bedroom[bedType] > 0) ? (
                            <>
                                <p className='text-slate-600 text-lg'>Sleeping arrangements</p>
                                <p className='text-slate-500 text-base'>{displayBedCount(bedroom)}</p>
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="text-black-700 underline"
                                >
                                    Edit
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => (editIndex === index ? handleModalClose() : handleAddArrangement(index))}
                                className="text-black-700 underline"
                            >
                                Add sleeping arrangement
                            </button>
                        )}
                    </div>
                    {editIndex === index && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <div className="bg-white p-6 w-96 rounded-lg shadow-md relative">
                                <button
                                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full focus:outline-none"
                                    onClick={handleModalClose}
                                >
                                    <XCircle size={36} color="gray" />
                                </button>

                                <div className="text-2xl font-bold text-gray-800 mb-2">Bedroom {index + 1}</div>
                                <div className="text-md text-gray-600 mb-6">The number of beds for this bedroom</div>

                                <div className="space-y-4 h-96 overflow-scroll">
                                    {bedTypes.map((bedType) => (
                                        <div key={bedType} className="flex justify-between items-center">
                                            {/* <span className="text-gray-800">{bedType}</span> */}
                                            <div className="flex items-center space-x-2 mr-5">
                                                {/* <IncrementDecrementButton
  value={bedroomData[index][bedType]}
  setValue={(newValue) => handleBedChange(index, bedType, newValue)}
/> */}

                                                {/* The rest of your code for Increment/Decrement buttons is now within the IncrementDecrementButton component */}
                                                {/* <button
                                                    disabled={!bedroomData[index][bedType]}
                                                    onClick={() => handleBedChange(index, bedType, -1)}
                                                    className={`focus:outline-none ${!bedroomData[index][bedType] && 'text-gray-400'
                                                        }`}
                                                >
                                                    <MinusCircle strokeWidth={1} size={34} />
                                                </button>
                                                <span className="text-gray-700 pl-4 pr-4">
                                                    {bedroomData[index][bedType] || 0}
                                                </span>
                                                <button
                                                    onClick={() => handleBedChange(index, bedType, 1)}
                                                    className="ml-5 focus:outline-none text-gray-700"
                                                >
                                                    <PlusCircle strokeWidth={1} size={34} />
                                                </button> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none relative ${isLoading ? 'flex items-center' : ''
                                            }`}
                                        onClick={handleModalClose}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="ml-2">Saving</span>
                                                <LoadingDots />
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default BedroomManager;
