import React from "react";
import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import ReservationForm from "@/components/booking/reservation-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faConciergeBell,
  // Add other icons here...
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

const amenitiesList: string[] = [
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
  "Concierge Services",
];

const amenityDetails = {
  Wifi: {
    icon: faWifi,
    description: "Wifi available throughout the listing."
  },
  Kitchen_Facilities: {
    icon: faUtensils,
    description: "Fully equipped kitchen with stove, oven, refrigerator, and cooking utensils."
  },
  Heating_and_Air_Conditioning: {
    icon: faTemperatureHigh,
    description: "Climate control with heating and air conditioning."
  },
  TV_and_Entertainment: {
    icon: faTv,
    description: "Television with cable/satellite, streaming services, or DVD player."
  },
  Washer_and_Dryer: {
    icon: faTshirt,
    description: "Laundry facilities with washer and dryer."
  },
  Free_Parking: {
    icon: faParking,
    description: "Free parking space available."
  },
  Pool: {
    icon: faSwimmingPool,
    description: "Access to a swimming pool (private or shared)."
  },
  Gym_Fitness_Center: {
    icon: faDumbbell,
    description: "On-site gym or fitness center."
  },
  Hot_Tub_Jacuzzi: {
    icon: faHotTub,
    description: "Private or shared hot tub for relaxation."
  },
  Outdoor_Space: {
    icon: faTree,
    description: "Outdoor space, such as a patio, balcony, garden, or terrace."
  },
  Barbecue_Grill: {
    icon: faUtensilSpoon,
    description: "Barbecue or grill for outdoor cooking."
  },
  Elevator: {
    icon: faElevator,
    description: "Elevator access (if applicable)."
  },
  Pets_Allowed: {
    icon: faPaw,
    description: "Pets are allowed in the listing."
  },
  Family_Kid_Friendly: {
    icon: faChild,
    description: "Amenities suitable for families with children."
  },
  Smoking_Policy: {
    icon: faSmoking,
    description: "Smoking policy for the listing."
  },
  Wheelchair_Accessible: {
    icon: faWheelchair,
    description: "Facilities for guests with mobility challenges."
  },
  Self_Check_in: {
    icon: faKey,
    description: "Self check-in with keyless entry or lockbox."
  },
  Check_in_24_7: {
    icon: faClock,
    description: "Flexible check-in times, available 24/7."
  },
  Workspace: {
    icon: faLaptop,
    description: "Designated workspace with a desk and chair."
  },
  Breakfast: {
    icon: faCoffee,
    description: "Complimentary breakfast items or vouchers provided."
  },
  Bikes: {
    icon: faBicycle,
    description: "Bicycles available for guest use."
  },
  Fireplace: {
    icon: faFire,
    description: "Working fireplace (gas or wood-burning)."
  },
  Security_Features: {
    icon: faShieldAlt,
    description: "Security features like smoke detectors and first aid kits."
  },
  Concierge_Services: {
    icon: faConciergeBell,
    description: "Concierge services for local recommendations and activities."
  }
};

const amenitiesMap: { [key: string]: { icon: any; description: string } } = amenitiesList.reduce(
  (map, amenity: any) => {
    type ObjectKey = keyof typeof amenityDetails;
    const fieldName: any = amenity as ObjectKey;
    map[fieldName] = amenityDetails[fieldName] || { icon: "default-icon", description: "" };
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
    'Towels',
    'Wifi',
    'Bathroom',
    'Breakfast',
  ];

  if (!data) {
    notFound();
  }

  return (
    <>
      {/* Rest of the JSX code remains the same */}
    </>
  );
}
