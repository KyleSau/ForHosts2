"use client"
import React, { useState } from 'react';
import { Label } from './ui/label';
import { PlusCircle, MinusCircle, XCircle } from 'lucide-react';

const bedTypes = [
    'Double',
    'Queen',
    'Single',
    'Sofa bed',
    'King',
    'Small double',
    'Couch',
    'Bunk bed',
    'Floor mattress',
    'Air mattress',
    'Crib',
    'Toddler bed',
    'Hammock',
    'Water bed',
];

function BedroomList({ totalBedrooms }) {
    const initialBedroomData = Array.from({ length: totalBedrooms }, () => ({ beds: {} }));
    const [bedroomData, setBedroomData] = useState(initialBedroomData);
    const [editIndex, setEditIndex] = useState(null);

    const handleEdit = (index) => {
        setEditIndex(index);
    };

    const handleModalClose = () => {
        setEditIndex(null);
    };

    const handleBedChange = (index, bedType, change) => {
        setBedroomData((prevData) => {
            const newData = [...prevData];
            newData[index].beds[bedType] = Math.max(0, prevData[index].beds[bedType] + change);
            return newData;
        });
    };

    const handleAddArrangement = (index) => {
        setBedroomData((prevData) => {
            const newData = [...prevData];
            newData[index].beds = {
                ...newData[index].beds,
                ...bedTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {}),
            };
            return newData;
        });
        setEditIndex(index);
    };

    const displayBedCount = (beds) => {
        const bedStrings = Object.entries(beds)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => `${count} ${type.toLowerCase()} ${count > 1 ? 'beds' : 'bed'}`);
        return bedStrings.join(', ');
    };

    return (
        <div className="space-y-4">
            {bedroomData.map((bedroom, index) => (
                <div key={index} className="border p-4 rounded shadow-sm">
                    <Label className='text-slate-800 text-xl'>Bedroom {index + 1}</Label>
                    <div className="mt-2">
                        {Object.entries(bedroom.beds).some(([bedType, count]) => count > 0) ? (
                            <>
                                <p className='text-slate-600 text-lg'>Sleeping arrangements</p>
                                <p className='text-slate-500 text-base'>{displayBedCount(bedroom.beds)}</p>
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="text-black-700 underline"
                                >
                                    Edit
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => editIndex === index ? handleModalClose() : handleAddArrangement(index)}
                                className="text-black-700 underline"
                            // className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Add sleeping arrangement
                            </button>
                        )}
                    </div>
                    {editIndex === index && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 ">
                            <div className="bg-white p-6 w-96 rounded-lg shadow-md relative">
                                <button
                                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full focus:outline-none"
                                    onClick={handleModalClose}
                                >
                                    <XCircle size={24} color="gray" />
                                </button>

                                <div className="text-2xl font-bold text-gray-800 mb-2">Bedroom {index + 1}</div>
                                <div className="text-md text-gray-600 mb-6">The number of beds for this bedroom</div>

                                <div className="space-y-4">
                                    {bedTypes.map((bedType) => (
                                        <div key={bedType} className="flex justify-between items-center">
                                            <span className="text-gray-800">{bedType}</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    disabled={!bedroomData[index].beds[bedType]}
                                                    onClick={() => handleBedChange(index, bedType, -1)}
                                                    className={`focus:outline-none ${!bedroomData[index].beds[bedType] && 'text-gray-400'}`}
                                                >
                                                    <MinusCircle size={24} />
                                                </button>
                                                <span className="text-gray-700">{bedroomData[index].beds[bedType] || 0}</span>
                                                <button
                                                    onClick={() => handleBedChange(index, bedType, 1)}
                                                    className="focus:outline-none text-gray-700"
                                                >
                                                    <PlusCircle size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none"
                                        onClick={handleModalClose}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );

    // return (
    //     <div>
    //         {bedroomData.map((bedroom, index) => (
    //             <div key={index} className="border p-4 my-4">
    //                 <Label className='text-slate-800 text-xl'>Bedroom {index + 1}</Label>
    //                 <div>
    //                     {Object.entries(bedroom.beds).some(([bedType, count]) => count > 0) ? (
    //                         <>
    //                             <p className='text-slate-600 text-lg'>Sleeping arrangements</p>
    //                             <p className='text-slate-500 text-base'>{displayBedCount(bedroom.beds)}</p>
    //                             <button
    //                                 onClick={() => handleEdit(index)}
    //                                 className="text-blue-700 underline"
    //                             >
    //                                 Edit
    //                             </button>
    //                         </>
    //                     ) : (
    //                         <button
    //                             onClick={() => editIndex === index ? handleModalClose() : handleAddArrangement(index)}
    //                         >
    //                             Add sleeping arrangement
    //                         </button>
    //                     )}
    //                 </div>
    //                 {editIndex === index && (
    //                     <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50">
    //                         <div className="bg-white p-4 w-96 rounded-lg shadow-md">
    //                             <div className="flex justify-end mb-2">
    //                                 <XCircle size={24} color="gray" className="hover:darken cursor-pointer" onClick={handleModalClose} />
    //                             </div>
    //                             <div className="text-2xl font-bold text-slate-700 mb-2">Bedroom</div>
    //                             <div className="text-md text-slate-600 mb-6">The number of beds for this bedroom</div>
    //                             <div style={{ marginRight: "40px", overflowY: "auto", maxHeight: "300px" }}>
    //                                 {bedTypes.map((bedType) => (
    //                                     <div key={bedType} className="flex justify-between items-center mb-4">
    //                                         <span>{bedType}</span>
    //                                         <div className="flex items-center">
    //                                             <button
    //                                                 disabled={!bedroomData[index].beds[bedType]}
    //                                                 onClick={() => handleBedChange(index, bedType, -1)}
    //                                                 className={`mr-2 ${!bedroomData[index].beds[bedType] && 'text-gray-400'}`}
    //                                             >
    //                                                 <MinusCircle size={24} />
    //                                             </button>
    //                                             <span>{bedroomData[index].beds[bedType] || 0}</span>
    //                                             <button onClick={() => handleBedChange(index, bedType, 1)} className="ml-2">
    //                                                 <PlusCircle size={24} />
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                             <div className="flex justify-end mt-4">
    //                                 <button
    //                                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //                                     onClick={handleModalClose}
    //                                 >
    //                                     Save
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    //         ))}
    //     </div>
    // );
}

export default BedroomList;
