
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
  faShuttleVan,
  faBus,
  faBed,
  faSoap,
  faBath,
  faChair,
  faBaby,
  faChess,
  faBook,
  faCompactDisc,
  faLightbulb,
  faFirstAid,
  faFireExtinguisher,
  faExclamationTriangle,
  faMap,
  faGift,
  faRecycle,
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
  "Reserved Parking": {
    icon: faParking,
    description: "Reserved parking space available.",
  },
  "Covered Parking": {
    icon: faParking,
    description: "Covered parking space available.",
  },
  "Garage Parking": {
    icon: faParking,
    description: "Garage parking available.",
  },
  "Airport Shuttle": {
    icon: faShuttleVan,
    description: "Airport shuttle service available.",
  },
  "Public Transportation Access": {
    icon: faBus,
    description: "Easy access to public transportation.",
  },
  "Extra Bedding and Linens": {
    icon: faBed,
    description: "Extra bedding and linens provided.",
  },
  "Toiletries (Shampoo, Soap, etc.)": {
    icon: faSoap,
    description: "Toiletries provided (shampoo, soap, etc.).",
  },
  "Towels and Washcloths": {
    icon: faBath,
    description: "Towels and washcloths provided.",
  },
  "Coffee Maker": {
    icon: faCoffee,
    description: "Coffee maker available for guest use.",
  },
  "Cooking Utensils": {
    icon: faUtensilSpoon,
    description: "Cooking utensils available for guest use.",
  },
  "Cutlery": {
    icon: faUtensils,
    description: "Cutlery available for guest use.",
  },
  "Dishes and Silverware": {
    icon: faUtensils,
    description: "Dishes and silverware provided.",
  },
  "Dining Table and Chairs": {
    icon: faChair,
    description: "Dining table and chairs provided.",
  },
  "High Chair (for families with infants)": {
    icon: faBaby,
    description: "High chair available for families with infants.",
  },
  "Board Games": {
    icon: faChess,
    description: "Board games available for guest use.",
  },
  "Books": {
    icon: faBook,
    description: "Books available for guest reading.",
  },
  "DVDs/Blu-rays": {
    icon: faCompactDisc,
    description: "DVDs/Blu-rays available for guest entertainment.",
  },
  "High-Speed Internet": {
    icon: faWifi,
    description: "High-speed internet available for guest use.",
  },
  "Streaming Services (Netflix, Hulu, etc.)": {
    icon: faTv,
    description: "Streaming services (Netflix, Hulu, etc.) available.",
  },
  "Smart Home Features (Smart Locks, Thermostat)": {
    icon: faLightbulb,
    description: "Smart home features (smart locks, thermostat, etc.) available.",
  },
  "Outdoor Furniture (Chairs, Tables, Lounges)": {
    icon: faChair,
    description: "Outdoor furniture provided (chairs, tables, lounges, etc.).",
  },
  "Grill Accessories": {
    icon: faUtensilSpoon,
    description: "Grill accessories available for outdoor cooking.",
  },
  "First Aid Kit": {
    icon: faFirstAid,
    description: "First aid kit available for emergencies.",
  },
  "Fire Extinguisher": {
    icon: faFireExtinguisher,
    description: "Fire extinguisher available for safety.",
  },
  "Carbon Monoxide Detector": {
    icon: faExclamationTriangle,
    description: "Carbon monoxide detector for safety.",
  },
  "Local Maps and Guidebooks": {
    icon: faMap,
    description: "Local maps and guidebooks for guest exploration.",
  },
  "Decorations (for birthdays, anniversaries, etc.)": {
    icon: faGift,
    description: "Decorations available for special occasions.",
  },
  "Laptop-Friendly Workspace": {
    icon: faLaptop,
    description: "Laptop-friendly workspace with desk and chair.",
  },
  "Recycling Bins": {
    icon: faRecycle,
    description: "Recycling bins for eco-friendly guests.",
  },
  "Energy-Efficient Appliances": {
    icon: faLightbulb,
    description: "Energy-efficient appliances for eco-conscious guests.",
  },
};
