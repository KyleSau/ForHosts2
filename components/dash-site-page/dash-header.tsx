import React from 'react';

interface TitleSubtextProps {
  title: string;
  guests: number | null;
  subtext: string | null;
  bedrooms: number | null;
  totalbeds: number | null;
  bathrooms: number | null;
}


const DashHeader: React.FC<TitleSubtextProps> = ({ title, guests, subtext, bedrooms, totalbeds, bathrooms }) => {
  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600">{guests} guests &#8226; {bedrooms} bedrooms &#8226; {totalbeds} beds &#8226; {bathrooms} bath {subtext}</p>
    </div>
  );
};

export default DashHeader;
