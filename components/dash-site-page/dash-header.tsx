import React from 'react';

interface TitleSubtextProps {
  title: string;
  guests: number | null;
  bedrooms: number | null;
  totalbeds: number | null;
  bathrooms: number | null;
}


const DashHeader: React.FC<TitleSubtextProps> = ({ title, guests, bedrooms, totalbeds, bathrooms }) => {
  return (
    <div className="bg-white col-span-1 md:col-span-full m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="text-center p-5">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{guests} Guests Maximum &#8226; {bedrooms} Bedrooms &#8226; {totalbeds} Beds &#8226; {bathrooms} Baths </p>
      </div>
    </div>
  );
};

export default DashHeader;
