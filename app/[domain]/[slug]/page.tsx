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
    description: "Wifi available throughout the listing.",
  },
  "Kitchen Facilities": { // Updated property name
    icon: faUtensils,
    description: "Fully equipped kitchen with stove, oven, refrigerator, and cooking utensils.",
  },
  "Heating and Air Conditioning": { // Updated property name
    icon: faTemperatureHigh,
    description: "Climate control with heating and air conditioning.",
  },
  "TV and Entertainment": { // Updated property name
    icon: faTv,
    description: "Television with cable/satellite, streaming services, or DVD player.",
  },
  "Washer and Dryer": { // Updated property name
    icon: faTshirt,
    description: "Laundry facilities with washer and dryer.",
  },
  "Free Parking": { // Updated property name
    icon: faParking,
    description: "Free parking space available.",
  },
  Pool: {
    icon: faSwimmingPool,
    description: "Access to a swimming pool (private or shared).",
  },
  "Gym/Fitness Center": { // Updated property name
    icon: faDumbbell,
    description: "On-site gym or fitness center.",
  },
  "Hot Tub/Jacuzzi": { // Updated property name
    icon: faHotTub,
    description: "Private or shared hot tub for relaxation.",
  },
  "Outdoor Space": { // Updated property name
    icon: faTree,
    description: "Outdoor space, such as a patio, balcony, garden, or terrace.",
  },
  "Barbecue/Grill": { // Updated property name
    icon: faUtensilSpoon,
    description: "Barbecue or grill for outdoor cooking.",
  },
  Elevator: {
    icon: faElevator,
    description: "Elevator access (if applicable).",
  },
  "Pets Allowed": { // Updated property name
    icon: faPaw,
    description: "Pets are allowed in the listing.",
  },
  "Family/Kid-Friendly": { // Updated property name
    icon: faChild,
    description: "Amenities suitable for families with children.",
  },
  "Smoking Policy": { // Updated property name
    icon: faSmoking,
    description: "Smoking policy for the listing.",
  },
  "Wheelchair Accessible": { // Updated property name
    icon: faWheelchair,
    description: "Facilities for guests with mobility challenges.",
  },
  "Self Check-in": { // Updated property name
    icon: faKey,
    description: "Self check-in with keyless entry or lockbox.",
  },
  "24/7 Check-in": { // Updated property name
    icon: faClock,
    description: "Flexible check-in times, available 24/7.",
  },
  Workspace: {
    icon: faLaptop,
    description: "Designated workspace with a desk and chair.",
  },
  Breakfast: {
    icon: faCoffee,
    description: "Complimentary breakfast items or vouchers provided.",
  },
  Bikes: {
    icon: faBicycle,
    description: "Bicycles available for guest use.",
  },
  Fireplace: {
    icon: faFire,
    description: "Working fireplace (gas or wood-burning).",
  },
  "Security Features": { // Updated property name
    icon: faShieldAlt,
    description: "Security features like smoke detectors and first aid kits.",
  },
  "Concierge Services": { // Updated property name
    icon: faConciergeBell,
    description: "Concierge services for local recommendations and activities.",
  },
};


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
