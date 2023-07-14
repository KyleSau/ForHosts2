"use client";
import React, { useState, FC } from "react";
import CustomSlider from "./CustomSlider";
interface PriceCardProps {
  title: string;
  subtitle: string;
  price: number;
  benefits: string[];
  footnote: string;
  isFeatured?: boolean;
  isHotOffer?: boolean;
}

interface SliderCardProps {
  title: string;
  subtitle: string;
  basePrice: number;
  extraPricePerProperty: number;
  benefits: string[];
  footnote: string;
  isFeatured?: boolean;
  isHotOffer?: boolean;
  propertyCount: number;
}

const Badge: FC = () => (
  <div className="absolute top-0 transform -translate-y-1/2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
    Recommended
  </div>
);

const PriceCard: FC<PriceCardProps> = ({
  title,
  subtitle,
  price,
  benefits,
  footnote,
  isFeatured = false,
  isHotOffer = false,
}) => (
  <div
    className={`relative flex flex-col items-center p-8 mt-6 bg-white rounded-md shadow-lg transition-all duration-500 ease-in-out transform ${
      isFeatured ? "scale-110 mt-4" : ""
    }`}
  >
    {isHotOffer && <Badge />}
    <h2 className="mb-1 text-2xl font-semibold">{title}</h2>
    <h3 className="mb-2 text-sm text-gray-500">{subtitle}</h3>
    <div className="mb-6 text-4xl font-bold">${price}</div>
    <ul>
      {benefits.map((benefit, index) => (
        <li key={index} className="mb-2 text-center text-sm text-gray-700">
          {benefit}
        </li>
      ))}
    </ul>
    <div className="flex-grow"></div>
    <button className="mt-6 px-8 py-2 text-white bg-sitecolor rounded-md hover:bg-red-600 active:bg-red-700 transition duration-200 font-bold border border-sitecolor">
      Choose plan
    </button>
    <small className="text-gray-500">{footnote}</small>
  </div>
);

const SliderCard: FC<SliderCardProps> = ({
  title,
  subtitle,
  basePrice,
  extraPricePerProperty,
  benefits,
  footnote,
  isFeatured = false,
  isHotOffer = false,
  propertyCount,
}) => {
  const totalPrice =
    basePrice +
    (propertyCount > 5 ? (propertyCount - 5) * extraPricePerProperty : 0);

  return (
    <PriceCard
      title={title}
      subtitle={subtitle}
      price={totalPrice}
      benefits={benefits}
      footnote={footnote}
      isFeatured={isFeatured}
      isHotOffer={isHotOffer}
    />
  );
};

const Pricing: FC = () => {
  const [propertyCount, setPropertyCount] = useState(1);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      if (value > 10) {
        value = 10;
      }
      setPropertyCount(value);
    }
  };

  const formatPropertyCount = (count: number) => {
    return count === 10 ? "10+" : count.toString();
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-10 bg-gray-100">
      <div className="max-w-3xl w-full bg-white p-4 rounded shadow-md">
        <div className="flex items-center">
          <div className="flex-grow">
            <p className="text-2xl mb-2">
              {formatPropertyCount(propertyCount)} properties
            </p>
            <CustomSlider value={propertyCount} onChange={setPropertyCount} />
          </div>
          <div className="ml-4">
            <input
              type="number"
              min="1"
              max="10"
              value={propertyCount}
              onChange={handleInputChange}
              className="w-12 py-1 px-2 border border-gray-300 rounded"
              style={{ marginTop: "2rem" }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-10 justify-center w-full">
        <SliderCard
          title="Basic"
          subtitle="For individuals"
          basePrice={10}
          extraPricePerProperty={2}
          benefits={[
            "Website for property",
            "Up to 5 property listings",
            "Feature 3",
          ]}
          footnote="Billed monthly"
          propertyCount={propertyCount}
        />
        <SliderCard
          title="Pro"
          subtitle="For professionals"
          basePrice={59}
          extraPricePerProperty={2}
          benefits={["Feature 1", "Feature 2", "Feature 3", "Feature 4"]}
          footnote="Billed monthly"
          isFeatured
          isHotOffer
          propertyCount={propertyCount}
        />
        <SliderCard
          title="Premium"
          subtitle="For businesses"
          basePrice={89}
          extraPricePerProperty={2}
          benefits={[
            "Feature 1",
            "Feature 2",
            "Feature 3",
            "Feature 4",
            "Feature 5",
          ]}
          footnote="Billed monthly"
          propertyCount={propertyCount}
        />
      </div>
    </div>
  );
};

export default Pricing;
