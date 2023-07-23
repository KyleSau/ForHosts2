
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
} from "@fortawesome/free-solid-svg-icons";
  
 export const amenityDetails: { [key: string]: { icon: any; description: string } } = {
    Wifi: {
      icon: faWifi,
      description: "Wifi available throughout the listing.",
    },
    "Kitchen Facilities": {
      icon: faUtensils,
      description:
        "Fully equipped kitchen with stove, oven, refrigerator, and cooking utensils.",
    },
    "Heating and Air Conditioning": {
      icon: faTemperatureHigh,
      description: "Climate control with heating and air conditioning.",
    },
    "TV and Entertainment": {
      icon: faTv,
      description:
        "Television with cable/satellite, streaming services, or DVD player.",
    },
    "Washer and Dryer": {
      icon: faTshirt,
      description: "Laundry facilities with washer and dryer.",
    },
    "Free Parking": {
      icon: faParking,
      description: "Free parking space available.",
    },
    Pool: {
      icon: faSwimmingPool,
      description: "Access to a swimming pool (private or shared).",
    },
    "Gym/Fitness Center": {
      icon: faDumbbell,
      description: "On-site gym or fitness center.",
    },
    "Hot Tub/Jacuzzi": {
      icon: faHotTub,
      description: "Private or shared hot tub for relaxation.",
    },
    "Outdoor Space": {
      icon: faTree,
      description: "Outdoor space, such as a patio, balcony, garden, or terrace.",
    },
    "Barbecue/Grill": {
      icon: faUtensilSpoon,
      description: "Barbecue or grill for outdoor cooking.",
    },
    Elevator: {
      icon: faElevator,
      description: "Elevator access (if applicable).",
    },
    "Pets Allowed": {
      icon: faPaw,
      description: "Pets are allowed in the listing.",
    },
    "Family/Kid-Friendly": {
      icon: faChild,
      description: "Amenities suitable for families with children.",
    },
    "Smoking Policy": {
      icon: faSmoking,
      description: "Smoking policy for the listing.",
    },
    "Wheelchair Accessible": {
      icon: faWheelchair,
      description: "Facilities for guests with mobility challenges.",
    },
    "Self Check-in": {
      icon: faKey,
      description: "Self check-in with keyless entry or lockbox.",
    },
    "24/7 Check-in": {
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
    "Security Features": {
      icon: faShieldAlt,
      description: "Security features like smoke detectors and first aid kits.",
    },
    "Concierge Services": {
      icon: faConciergeBell,
      description: "Concierge services for local recommendations and activities.",
    },
  };