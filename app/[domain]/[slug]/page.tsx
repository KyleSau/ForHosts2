import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import ReservationForm from "@/components/booking/reservation-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShowMore from 'react-show-more-button';
import React, { useState } from "react";
import {
  faWifi,
  faUtensils,
  faTemperatureHigh,
  faTv,
  faTshirt,
  faParking,
  faSwimmingPool,
  faDumbbell,
  faHotTub,
  faTree,
  faUtensilSpoon,
  faElevator,
  faPaw,
  faChild,
  faSmoking,
  faWheelchair,
  faKey,
  faClock,
  faLaptop,
  faCoffee,
  faBicycle,
  faFire,
  faShieldAlt,
  faConciergeBell
} from "@fortawesome/free-solid-svg-icons";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getPostData(domain, slug);
  if (!data) {
    return null;
  }
  const { id, title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@ForHosts",
    },
  };
}
// TODO: move amenity details to a separate file
const amenitiesList: any = [
  "Wifi",
  "Kitchen Facilities",
  "Heating and Air Conditioning",
  "TV and Entertainment",
  "Washer and Dryer",
  "Free Parking",
  "Pool",
  "Gym/Fitness Center",
  "Hot Tub/Jacuzzi",
  "Outdoor Space",
  "Barbecue/Grill",
  "Elevator",
  "Pets Allowed",
  "Family/Kid-Friendly",
  "Smoking Policy",
  "Wheelchair Accessible",
  "Self Check-in",
  "24/7 Check-in",
  "Workspace",
  "Breakfast",
  "Bikes",
  "Fireplace",
  "Security Features",
  "Concierge Services"
];

const amenityDetails: { [key: string]: { icon: any; description: string } } = {
  "Wifi": {
    icon: faWifi,
    description: "Wifi available throughout the listing."
  },
  "Kitchen Facilities": {
    icon: faUtensils,
    description: "Fully equipped kitchen with stove, oven, refrigerator, and cooking utensils."
  },
  "Heating and Air Conditioning": {
    icon: faTemperatureHigh,
    description: "Climate control with heating and air conditioning."
  },
  "TV and Entertainment": {
    icon: faTv,
    description: "Television with cable/satellite, streaming services, or DVD player."
  },
  "Washer and Dryer": {
    icon: faTshirt,
    description: "Laundry facilities with washer and dryer."
  },
  "Free Parking": {
    icon: faParking,
    description: "Free parking space available."
  },
  "Pool": {
    icon: faSwimmingPool,
    description: "Access to a swimming pool (private or shared)."
  },
  "Gym/Fitness Center": {
    icon: faDumbbell,
    description: "On-site gym or fitness center."
  },
  "Hot Tub/Jacuzzi": {
    icon: faHotTub,
    description: "Private or shared hot tub for relaxation."
  },
  "Outdoor Space": {
    icon: faTree,
    description: "Outdoor space, such as a patio, balcony, garden, or terrace."
  },
  "Barbecue/Grill": {
    icon: faUtensilSpoon,
    description: "Barbecue or grill for outdoor cooking."
  },
  "Elevator": {
    icon: faElevator,
    description: "Elevator access (if applicable)."
  },
  "Pets Allowed": {
    icon: faPaw,
    description: "Pets are allowed in the listing."
  },
  "Family/Kid-Friendly": {
    icon: faChild,
    description: "Amenities suitable for families with children."
  },
  "Smoking Policy": {
    icon: faSmoking,
    description: "Smoking policy for the listing."
  },
  "Wheelchair Accessible": {
    icon: faWheelchair,
    description: "Facilities for guests with mobility challenges."
  },
  "Self Check-in": {
    icon: faKey,
    description: "Self check-in with keyless entry or lockbox."
  },
  "24/7 Check-in": {
    icon: faClock,
    description: "Flexible check-in times, available 24/7."
  },
  "Workspace": {
    icon: faLaptop,
    description: "Designated workspace with a desk and chair."
  },
  "Breakfast": {
    icon: faCoffee,
    description: "Complimentary breakfast items or vouchers provided."
  },
  "Bikes": {
    icon: faBicycle,
    description: "Bicycles available for guest use."
  },
  "Fireplace": {
    icon: faFire,
    description: "Working fireplace (gas or wood-burning)."
  },
  "Security Features": {
    icon: faShieldAlt,
    description: "Security features like smoke detectors and first aid kits."
  },
  "Concierge Services": {
    icon: faConciergeBell,
    description: "Concierge services for local recommendations and activities."
  }
};

const amenitiesMap: { [key: string]: { icon: any; description: string } } = amenitiesList.reduce(
  (map: any, amenity: string) => {
    map[amenity] = amenityDetails[amenity as keyof typeof amenityDetails] || { icon: "default-icon", description: "" };
    return map;
  },
  {}
);

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getPostData(domain, slug);

  const amenities = [
    data?.amenities
  ];

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-5 md:text-2xl">
          <div>
            <h1 className="font-bold text-stone-800 dark:text-white md:text-1xl">
              {data.title}
            </h1>
          </div>
          <div>
            <h1 className="text-stone-600 dark:text-white md:text-1xl">
              {data.location}
            </h1>
          </div>
          <div>
            <h1 className="text-stone-800 dark:text-white md:text-1xl">
              ${data.price} Per Night
            </h1>
          </div>
        </div>


        {/* Make this Photo Gallery? */}
        {/* md:w-7/12 */}
        <div className="m-auto w-full text-center">
          <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
            <BlurImage
              alt={data.title ?? "Property Image"}
              width={1200}
              height={630}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
              src={data.image ?? "/placeholder.png"}
            />
          </div>
          {/* Prop for postId */}
          <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
            {data.description}
          </p>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 w-100" />
          <div className="grid grid-cols-2 gap-1 w-full">
            {/* <ShowMore maxHeight={10}> */}
            <div className="w-full">
              <h2 className={"text-lg"}>Amenities</h2>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 w-100" />
              <ul className="grid grid-cols-5 gap-1 w-full">
                {amenitiesList.map((amenity: any) => (
                  <li className="text-sm grid items-center m-5 p-5 flex items-center space-x-3 rounded-lg px-2 py-1.5 dark:text-white grid w-full" key={amenity}>
                    <div className={`justify-center`}>
                      {<FontAwesomeIcon icon={amenitiesMap[amenity]?.icon} />} <br />
                      <span className="text-sm font-medium m-5">{amenity} <br /> </span>{amenitiesMap[amenity]?.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* </ShowMore> */}
            <div className="flex-row">
              <ReservationForm postId={data.id} />
            </div>
          </div>
        </div>
      </div>
      <MDX source={data.mdxSource} />
      {
        data.adjacentPosts.length > 0 && (
          <div className="relative mb-20 mt-10 sm:mt-20">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-stone-300 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-stone-500  dark:text-stone-400">
                Other Rentals
              </span>
            </div>
          </div>
        )
      }
      {
        data.adjacentPosts && (
          <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
            {data.adjacentPosts.map((data, index) => (
              <BlogCard key={index} data={data} />
            ))}
          </div>
        )
      }
    </>
  );
}