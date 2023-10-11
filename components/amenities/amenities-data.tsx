
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
  faBaseballBall,
  faBell,
  faBowlingBall,
  faBroom,
  faBullseye,
  faCalendarAlt,
  faCouch,
  faCut,
  faDice,
  faDoorOpen,
  faFaucet,
  faFilm,
  faFlask,
  faGamepad,
  faLock,
  faLuggageCart,
  faMountain,
  faMusic,
  faShower,
  faSnowflake,
  faTemperatureLow,
  faUserTie,
  faVideo,
  faWind,
  faWindowMaximize,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";


export type Amenity = {
  id: string
  category: string
  description: string | null
  icon: IconDefinition | null
}

export const amenityDetails: Amenity[] =
  [
    {
      "id": "Essentials",
      "category": "Popular",
      "description": "Towels, bed sheets, soap, toilet paper, and pillows",
      "icon": faBed
    },
    {
      "id": "Air conditioning",
      "category": "Popular",
      "description": "Add details",
      "icon": faSnowflake
    },
    {
      "id": "Cleaning products",
      "category": "Popular",
      "description": null,
      "icon": faBroom
    },
    {
      "id": "Cooking basics",
      "category": "Popular",
      "description": "Pots and pans, oil, salt and pepper",
      "icon": faUtensils
    },
    {
      "id": "Dedicated workspace",
      "category": "Popular",
      "description": "Guests have a desk or table that’s used just for working, along with a comfortable chair",
      "icon": faLaptop
    },
    {
      "id": "Dishes and silverware",
      "category": "Popular",
      "description": "Bowls, chopsticks, plates, cups, etc.",
      "icon": faUtensils
    },
    {
      "id": "Dryer",
      "category": "Popular",
      "description": null,
      "icon": faTshirt
    },
    {
      "id": "Hair dryer",
      "category": "Popular",
      "description": null,
      "icon": faCut
    },
    {
      "id": "Heating",
      "category": "Popular",
      "description": null,
      "icon": faTemperatureLow
    },
    {
      "id": "Hot tub",
      "category": "Popular",
      "description": null,
      "icon": faHotTub
    },
    {
      "id": "Kitchen",
      "category": "Popular",
      "description": "Space where guests can cook their own meals",
      "icon": faUtensils
    },
    {
      "id": "Pool",
      "category": "Popular",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "TV",
      "category": "Popular",
      "description": null,
      "icon": faTv
    },
    {
      "id": "Washer",
      "category": "Popular",
      "description": null,
      "icon": null
    },
    {
      "id": "Wifi",
      "category": "Popular",
      "description": "Available throughout the listing",
      "icon": faWifi
    },
    {
      "id": "Bathroom",
      "category": "Bedroom and laundry",
      "description": "Bathtub",
      "icon": faBath
    },
    {
      "id": "Bidet",
      "category": "Bathroom",
      "description": null,
      "icon": faFaucet
    },
    {
      "id": "Body soap",
      "category": "Bathroom",
      "description": null,
      "icon": faSoap
    },
    {
      "id": "Cleaning products",
      "category": "Bathroom",
      "description": null,
      "icon": faBroom
    },
    {
      "id": "Conditioner",
      "category": "Bathroom",
      "description": null,
      "icon": faFlask
    },
    {
      "id": "Hair dryer",
      "category": "Bathroom",
      "description": null,
      "icon": faCut
    },
    {
      "id": "Hot water",
      "category": "Bathroom",
      "description": null,
      "icon": faShower
    },
    {
      "id": "Outdoor shower",
      "category": "Bathroom",
      "description": null,
      "icon": faShower
    },
    {
      "id": "Shampoo",
      "category": "Bathroom",
      "description": null,
      "icon": faFlask
    },
    {
      "id": "Shower gel",
      "category": "Bathroom",
      "description": null,
      "icon": faFlask
    },
    {
      "id": "Bed linens",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faBed
    },
    {
      "id": "Clothing storage",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": null
    },
    {
      "id": "Dryer",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faTshirt
    },
    {
      "id": "Drying rack for clothing",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faTshirt
    },
    {
      "id": "Extra pillows and blankets",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faBed
    },
    {
      "id": "Hangers",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": null
    },
    {
      "id": "Iron",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": null
    },
    {
      "id": "Mosquito net",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faBed
    },
    {
      "id": "Room-darkening shades",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faWindowMaximize
    },
    {
      "id": "Safe",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": faLock
    },
    {
      "id": "Washer",
      "category": "Bedroom and laundry",
      "description": null,
      "icon": null
    },
    {
      "id": "Arcade games",
      "category": "Entertainment",
      "description": null,
      "icon": faGamepad
    },
    {
      "id": "Batting cage",
      "category": "Entertainment",
      "description": null,
      "icon": faBaseballBall
    },
    {
      "id": "Books and reading material",
      "category": "Entertainment",
      "description": "NEW",
      "icon": faBook
    },
    {
      "id": "Bowling alley",
      "category": "Entertainment",
      "description": null,
      "icon": faBowlingBall
    },
    {
      "id": "Climbing wall",
      "category": "Entertainment",
      "description": null,
      "icon": faMountain
    },
    {
      "id": "Darts",
      "category": "Entertainment",
      "description": null,
      "icon": faBullseye
    },
    {
      "id": "Fitness equipment",
      "category": "Entertainment",
      "description": "Show all 6 amenities",
      "icon": faDumbbell
    },
    {
      "id": "Game console",
      "category": "Entertainment",
      "description": null,
      "icon": faGamepad
    },
    {
      "id": "Games",
      "category": "Entertainment",
      "description": null,
      "icon": faDice
    },
    {
      "id": "Hammock",
      "category": "Entertainment",
      "description": null,
      "icon": null
    },
    {
      "id": "Movie theater",
      "category": "Entertainment",
      "description": null,
      "icon": faFilm
    },
    {
      "id": "Music",
      "category": "Entertainment",
      "description": null,
      "icon": faMusic
    },
    {
      "id": "Patio or balcony",
      "category": "Entertainment",
      "description": "Private or shared",
      "icon": faCouch
    },
    {
      "id": "Ping pong table",
      "category": "Entertainment",
      "description": null,
      "icon": null
    },
    {
      "id": "Pool table",
      "category": "Entertainment",
      "description": null,
      "icon": null
    },
    {
      "id": "Record player",
      "category": "Entertainment",
      "description": null,
      "icon": faCompactDisc
    },
    {
      "id": "Sauna",
      "category": "Entertainment",
      "description": null,
      "icon": faHotTub
    },
    {
      "id": "Swimming pool",
      "category": "Entertainment",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Table tennis",
      "category": "Entertainment",
      "description": null,
      "icon": null
    },
    {
      "id": "Tennis court",
      "category": "Entertainment",
      "description": null,
      "icon": null
    },
    {
      "id": "Fire extinguisher",
      "category": "Health and safety",
      "description": null,
      "icon": faFireExtinguisher
    },
    {
      "id": "First aid kit",
      "category": "Health and safety",
      "description": null,
      "icon": faFirstAid
    },
    {
      "id": "Smoke alarm",
      "category": "Health and safety",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Carbon monoxide alarm",
      "category": "Health and safety",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Internet",
      "category": "Logistics",
      "description": "Wifi details",
      "icon": faWifi
    },
    {
      "id": "Long-term stays allowed",
      "category": "Logistics",
      "description": "Allow stay for 28 days or more",
      "icon": faCalendarAlt
    },
    {
      "id": "Luggage dropoff allowed",
      "category": "Logistics",
      "description": null,
      "icon": faLuggageCart
    },
    {
      "id": "Paid parking",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Free parking on premises",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Free street parking",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Private entrance",
      "category": "Logistics",
      "description": null,
      "icon": faDoorOpen
    },
    {
      "id": "Private living room",
      "category": "Logistics",
      "description": null,
      "icon": faCouch
    },
    {
      "id": "Private outdoor pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Private pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Shared outdoor pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Shared pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Air purifier",
      "category": "Safety features",
      "description": null,
      "icon": faWind
    },
    {
      "id": "Baby monitor",
      "category": "Safety features",
      "description": null,
      "icon": faBaby
    },
    {
      "id": "Babysitter recommendations",
      "category": "Safety features",
      "description": null,
      "icon": null
    },
    {
      "id": "Buzzer/wireless intercom",
      "category": "Safety features",
      "description": null,
      "icon": faBell
    },
    {
      "id": "CCTV cameras",
      "category": "Safety features",
      "description": null,
      "icon": faVideo
    },
    {
      "id": "Doorman",
      "category": "Safety features",
      "description": null,
      "icon": faUserTie
    },
    {
      "id": "Doorperson",
      "category": "Safety features",
      "description": null,
      "icon": faUserTie
    },
    {
      "id": "Fire extinguisher",
      "category": "Safety features",
      "description": null,
      "icon": faFireExtinguisher
    },
    {
      "id": "Fireplace guards",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Firm mattress",
      "category": "Safety features",
      "description": null,
      "icon": faBed
    },
    {
      "id": "First aid kit",
      "category": "Safety features",
      "description": null,
      "icon": faFirstAid
    },
    {
      "id": "Smoke alarm",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Carbon monoxide alarm",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Internet",
      "category": "Logistics",
      "description": "Wifi details",
      "icon": faWifi
    },
    {
      "id": "Long-term stays allowed",
      "category": "Logistics",
      "description": "Allow stay for 28 days or more",
      "icon": faCalendarAlt
    },
    {
      "id": "Luggage dropoff allowed",
      "category": "Logistics",
      "description": null,
      "icon": faLuggageCart
    },
    {
      "id": "Paid parking",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Free parking on premises",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Free street parking",
      "category": "Logistics",
      "description": null,
      "icon": faParking
    },
    {
      "id": "Private entrance",
      "category": "Logistics",
      "description": null,
      "icon": faDoorOpen
    },
    {
      "id": "Private living room",
      "category": "Logistics",
      "description": null,
      "icon": faCouch
    },
    {
      "id": "Private outdoor pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Private pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Shared outdoor pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Shared pool",
      "category": "Logistics",
      "description": null,
      "icon": faSwimmingPool
    },
    {
      "id": "Air purifier",
      "category": "Safety features",
      "description": null,
      "icon": faWind
    },
    {
      "id": "Baby monitor",
      "category": "Safety features",
      "description": null,
      "icon": faBaby
    },
    {
      "id": "Buzzer/wireless intercom",
      "category": "Safety features",
      "description": null,
      "icon": faBell
    },
    {
      "id": "CCTV cameras",
      "category": "Safety features",
      "description": null,
      "icon": faVideo
    },
    {
      "id": "Doorman",
      "category": "Safety features",
      "description": null,
      "icon": faUserTie
    },
    {
      "id": "Doorperson",
      "category": "Safety features",
      "description": null,
      "icon": faUserTie
    },
    {
      "id": "Fire extinguisher",
      "category": "Safety features",
      "description": null,
      "icon": faFireExtinguisher
    },
    {
      "id": "Fireplace guards",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Firm mattress",
      "category": "Safety features",
      "description": null,
      "icon": faBed
    },
    {
      "id": "First aid kit",
      "category": "Safety features",
      "description": null,
      "icon": faFirstAid
    },
    {
      "id": "Smoke alarm",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    },
    {
      "id": "Carbon monoxide alarm",
      "category": "Safety features",
      "description": null,
      "icon": faFire
    }
  ]
