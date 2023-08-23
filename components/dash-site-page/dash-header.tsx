import React from 'react';

interface TitleSubtextProps {
  title: string;
  guests: number | null;
  subtext: string | null;
  bedRooms: number | null;
  bedsNumber: number | null;
  bathRooms: number | null;
}


const DashHeader: React.FC<TitleSubtextProps> = ({ title, guests, subtext, bedRooms, bedsNumber, bathRooms }) => {
  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600">{guests} guests &#8226; {bedRooms} bedrooms &#8226; {bedsNumber} beds &#8226; {bathRooms} bath {subtext}</p>
    </div>
  );
};

export default DashHeader;
