import React from 'react';
import { PlusCircle, MinusCircle, XCircle } from "lucide-react";

interface IncrementDecrementButtonProps {
  value: number;
  setValue: (newValue: number) => void; // Function to update the value
}

const IncrementDecrementButton: React.FC<IncrementDecrementButtonProps> = ({ value, setValue }) => {
  const decrement = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  const increment = () => {
    setValue(value + 1);
  };

  return (
    <div className="col-span-2 flex items-center justify-end">
      <div className="flex items-center space-x-2 ml-auto">
        <button
          type="button"
          onClick={decrement}
          className={`focus:outline-none ${!value && "text-gray-400"}`}
        >
          <MinusCircle strokeWidth={1} size={34} />
        </button>
        <span className="pl-4 pr-4 text-gray-700 w-12 text-center"> {/* Add fixed width */}
          {value || 0}
        </span>
        <button
          type="button"
          onClick={increment}
          className="ml-5 text-gray-700 focus:outline-none"
        >
          <PlusCircle strokeWidth={1} size={34} />
        </button>
      </div>
    </div>
  );
};

export default IncrementDecrementButton;
