import React, { FC } from "react";

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CustomSlider: FC<CustomSliderProps> = ({ value, onChange }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const newValue = Math.round(
      ((event.clientX - rect.left) / rect.width) * 10 + 0.5
    );
    if (newValue >= 1 && newValue <= 10) {
      onChange(newValue);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const container = event.currentTarget.parentElement;
    if (container === null) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const newValue = Math.round(
      ((event.touches[0].clientX - rect.left) / rect.width) * 10 + 0.5
    );
    if (newValue >= 1 && newValue <= 10) {
      onChange(newValue);
    }
  };

  return (
    <div
      className="relative w-full h-8 bg-gray-300 rounded-full cursor-pointer"
      onClick={handleClick}
    >
      <div
        style={{ width: `${value * 10}%` }}
        className={`absolute top-0 bottom-0 h-full bg-blue-500 transition-width duration-200 ${value === 10 ? "rounded-r-full" : ""
          }`}
      ></div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 h-full w-px bg-black"
          style={{ left: `${i * 10}%` }}
        ></div>
      ))}
      <div
        className="absolute h-6 w-6 rounded-full bg-white border-2 border-blue-500 mt-1 transition-all duration-200"
        style={{ left: `calc(${(value - 1) * 10}% + 5% - 12px)` }}
        onMouseDown={(event) => {
          event.preventDefault();
          const container = event.currentTarget.parentElement;
          if (container === null) {
            return;
          }
          const rect = container.getBoundingClientRect();
          const onMouseMove = (event: MouseEvent) => {
            const newValue = Math.round(
              ((event.clientX - rect.left) / rect.width) * 10 + 0.5
            );
            if (newValue >= 1 && newValue <= 10) {
              onChange(newValue);
            }
          };
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
        onTouchMove={handleTouchMove}
      ></div>
    </div>
  );
};

export default CustomSlider;
