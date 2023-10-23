import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, XCircle } from "lucide-react";
import { getBedrooms, updateBedroom } from "@/lib/actions";
import LoadingDots from "@/components/icons/loading-dots";
import { Bedroom as PrismaBedroom } from "@prisma/client";
import IncrementDecrementButton from "../increment-decrement-button";

const bedTypes = [
  "double",
  "queen",
  "single",
  "sofaBed",
  "king",
  "smallDouble",
  "couch",
  "bunkBed",
  "floorMattress",
  "airMattress",
  "crib",
  "toddlerBed",
  "hammock",
  "waterBed",
];

interface BedroomListProps {
  totalBedrooms: number;
  postId: string;
  bedrooms: Bedroom[];
}
interface Bedroom {
  id: number;
  // Add an index signature to allow dynamic property access
  [key: string]: number;
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
        const data: any | null = await getBedrooms(postId);
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
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [editIndex]);

  const saveBedroomData = async (index: number) => {
    setIsLoading(true);

    const updatedBedroomData = { ...bedroomData[index] };
    const updatedBedroom = await updateBedroom(updatedBedroomData as any);

    if (updatedBedroom) {
      try {
        const data: any | null = await getBedrooms(postId);
        if (data !== null) {
          setBedroomData(data);
        }
      } catch (error) {
        console.error("Error fetching updated bedrooms:", error);
      }
    }

    setIsLoading(false);
  };
  const handleSave = async () => {
    if (editIndex !== null) {
      await saveBedroomData(editIndex);
    }
    setEditIndex(null);
  };
  const handleModalClose = async () => {
    setEditIndex(null);
  };

  //   const handleBedChange = (index: number, bedType: string, change: number) => {
  //     setBedroomData((prevData) => {
  //       const newData = [...prevData];
  //       newData[index][bedType] = Math.max(0, prevData[index][bedType] + change);
  //       return newData;
  //     });
  //   };

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
    if (!beds || typeof beds !== "object") {
      return "";
    }

    const bedStrings = bedTypes
      .filter((bedType) => beds[bedType] > 0)
      .map(
        (bedType) =>
          `${beds[bedType]} ${bedType.toLowerCase()}${
            beds[bedType] > 1 ? "s" : ""
          }`,
      );
    return bedStrings.join(", ");
  };

  return (
    <div className="space-y-4">
      Bedroom Manager
      <hr />
      {bedroomData.map((bedroom, index) => (
        <div key={index} className="rounded border p-4 shadow-sm">
          <Label className="text-xl text-slate-800">Bedroom {index + 1}</Label>
          <div>{bedroom.id}</div>
          <div className="mt-2">
            {bedTypes.some((bedType) => bedroom[bedType] > 0) ? (
              <>
                <p className="text-lg text-slate-600">Sleeping arrangements</p>
                <p className="text-base text-slate-500">
                  {displayBedCount(bedroom)}
                </p>
                <button
                  onClick={() => handleEdit(index)}
                  className="text-black-700 underline"
                >
                  Edit
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  editIndex === index
                    ? handleModalClose()
                    : handleAddArrangement(index)
                }
                className="text-black-700 underline"
              >
                Add sleeping arrangement
              </button>
            )}
          </div>
          {editIndex === index && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-96 rounded-lg bg-white p-6 shadow-md">
                <button
                  className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200 focus:outline-none"
                  type="button"
                  onClick={handleModalClose}
                >
                  <XCircle size={36} color="gray" />
                </button>

                <div className="mb-2 text-2xl font-bold text-gray-800">
                  Bedroom {index + 1}
                </div>
                <div className="text-md mb-6 text-gray-600">
                  The number of beds for this bedroom
                </div>

                <div className="h-96 space-y-4 overflow-scroll">
                  {bedTypes.map((bedType) => (
                    <div
                      key={bedType}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-800">{bedType}</span>
                      <div className="mr-5 flex items-center space-x-2">
                        <IncrementDecrementButton
                          value={bedroomData[index][bedType]}
                          setValue={(newValue) => {
                            // Create a copy of the bedroomData array
                            const newData = [...bedroomData];

                            // Update the value of the specific bedroom type at the given index
                            newData[index][bedType] = newValue;

                            // Set the updated data back to the state
                            setBedroomData(newData);
                          }}
                        />

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

                <div className="mt-4 flex justify-end">
                  <button
                    className={`relative rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none ${
                      isLoading ? "flex items-center" : ""
                    }`}
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="ml-2">Saving</span>
                        <LoadingDots />
                      </>
                    ) : (
                      "Save"
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
