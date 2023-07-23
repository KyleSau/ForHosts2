import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import ReservationForm from "@/components/booking/reservation-form";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  Layout,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  CalendarCheck2,
  Home,
  CircleDollarSign,
  FileQuestion,
  MessagesSquare,
  BookOpen,
  CalendarDays,
} from "lucide-react";


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
      creator: "@vercel",
    },
  };
}

const amenitiesList: any = [
  "Towels",
  "Bed sheets",
  "Soap",
  "Toilet paper",
  "Pillows",
  "Air conditioning",
  "Cleaning products",
  "Cooking basics",
  "Pots and pans",
  "Oil",
  "Salt and pepper",
  "Dedicated workspace",
  "Guests have a desk or table that’s used just for working, along with a comfortable chair. Add details",
  "Dishes and silverware",
  "Bowls",
  "Chopsticks",
  "Plates",
  "Cups",
  "Dryer",
  "Hair dryer",
  "Heating",
  "Hot tub",
  "Add details",
  "Kitchen",
  "Space where guests can cook their own meals",
  "Pool",
  "TV",
  "Washer",
  "Add details",
  "Wifi",
  "Available throughout the listing",
  "Bathroom",
  "Bathtub",
  "Bidet",
  "Body soap",
  "Cleaning products",
  "Conditioner",
  "Hot water",
  "Outdoor shower",
  "Shampoo",
  "Shower gel",
  "Bedroom and laundry",
  "Essentials",
  "Towels, bed sheets, soap, toilet paper, and pillows",
  "Bed linens",
  "Clothing storage",
  "Dryer",
  "Drying rack for clothing",
  "Extra pillows and blankets",
  "Hangers",
  "Iron",
  "Mosquito net",
  "Room-darkening shades",
  "Safe",
  "Washer",
  "Add details",
  "Entertainment",
  "Arcade games",
  "Batting cage",
  "Books and reading materialNEW",
  "Bowling alley",
  "Climbing wall",
  "Ethernet connection",
  "Exercise equipmentNEW",
  "Game console",
  "Laser tag",
  "Life size games",
  "Mini golf",
  "Movie theater",
  "Piano",
  "Ping pong table",
  "Pool table",
  "Record player",
  "Skate ramp",
  "Sound system",
  "Theme room",
  "A room or multiple spaces that are designed to follow the same theme",
  "TV",
  "Family",
  "Baby bath",
  "Baby monitor",
  "Children’s bikes",
  "Children's playroom",
  "An indoor room with toys, books, and games for children",
  "Baby safety gates",
  "Babysitter recommendations",
  "Board gamesNEW",
  "Changing table",
  "Children’s books and toys",
  "Children’s dinnerware",
  "Crib",
  "Fireplace guards",
  "High chair",
  "Outdoor playground",
  "An outdoor area equipped with play structures for children",
  "Outlet covers",
  "Pack ’n play/Travel crib",
  "Table corner guards",
  "Window guards",
  "Heating and cooling",
  "Air conditioning",
  "Ceiling fan",
  "Heating",
  "Indoor fireplace",
  "Portable fans",
  "Home safety",
  "Carbon monoxide alarm",
  "Check your local laws, which may require a working carbon monoxide detector in every room",
  "Fire extinguisher",
  "First aid kit",
  "Smoke alarm",
  "Check your local laws, which may require a working smoke detector in every room",
  "Internet and office",
  "Dedicated workspace",
  "Guests have a desk or table that’s used just for working, along with a comfortable chair. Add details",
  "Pocket wifi",
  "Wifi",
  "Available throughout the listing",
  "Kitchen and dining",
  "Baking sheet",
  "Barbecue utensils",
  "Grill, charcoal, bamboo skewers/iron skewers, etc.",
  "Bread maker",
  "BlenderNEW",
  "CoffeeNEW",
  "Coffee maker",
  "Cooking basics",
  "Pots and pans, oil, salt and pepper",
  "Dining table",
  "Dishes and silverware",
  "Bowls, chopsticks, plates, cups, etc.",
  "Dishwasher",
  "Freezer",
  "Hot water kettle",
  "Kitchen",
  "Space where guests can cook their own meals",
  "Kitchenette",
  "Space where guests can heat up and refrigerate food",
  "Microwave",
  "Mini fridge",
  "Oven",
  "Refrigerator",
  "Rice maker",
  "Stove",
  "Toaster",
  "Trash compactor",
  "Wine glasses",
  "Location features",
  "Beach access",
  "Guests can enjoy a nearby beach",
  "Lake access",
  "Guests can get to a lake using a path or dock",
  "Laundromat nearby",
  "Private entrance",
  "Separate street or building entrance",
  "Resort accessNEW",
  "Guests can use nearby resort facilities",
  "Ski-in/Ski-out",
  "Guests can access ski lifts without driving or taking paid transportation",
  "Waterfront",
  "Right next to a body of water",
  "Outdoor",
  "Backyard",
  "An open space on the property usually covered in grass",
  "BBQ grill",
  "Beach essentials",
  "Beach towels, umbrella, beach blanket, snorkeling gear",
  "Bikes",
  "Boat slip",
  "Fire pit",
  "HammockNEW",
  "Kayak",
  "Outdoor dining area",
  "Outdoor furniture",
  "Outdoor kitchenNEW",
  "Patio or balcony",
  "Sun loungers",
  "Parking and facilities",
  "Elevator",
  "The home or building has an elevator that’s at least 52 inches deep and a doorway at least 32 inches wide.",
  "EV charger",
  "Guests can charge their electric vehicles on the property.",
  "Free parking on premises",
  "Add details",
  "Hockey rink",
  "Free street parking",
  "Gym",
  "Hot tub",
  "Add details",
  "Paid parking off premises",
  "Paid parking on premises",
  "Pool",
  "Sauna",
  "Single level home",
  "No stairs in home",
  "Services",
  "Breakfast",
  "Breakfast is provided",
  "Cleaning available during stay",
  "Long term stays allowed",
  "Allow stay for 28 days or more",
  "Luggage dropoff allowed",
  "For guests' convenience when they have early arrival or late departure",
];

const amenityDetails: any = {
  "Wifi": {
    icon: <ArrowLeft width={18} />,
    description: "Wifi available throughout the listing."
  },
  "Towels": {
    icon: <ArrowLeft width={18} />,
    description: "High-quality towels provided."
  },
  "Bed sheets": {
    icon: <ArrowLeft width={18} />,
    description: "Clean and comfortable bed sheets provided."
  },
  "Soap": {
    icon: "icon-soap", description: "Soap available in the bathroom."
  },
  "Toilet paper": { icon: "icon-toilet-paper", description: "Toilet paper provided." },
  "Pillows": { icon: "icon-pillows", description: "Soft and fluffy pillows provided." },
  "Air conditioning": { icon: "icon-air-conditioning", description: "Air conditioning available." },
  "Cleaning products": { icon: "icon-cleaning-products", description: "Cleaning products provided." },
  "Cooking basics": { icon: "icon-cooking-basics", description: "Basic cooking utensils and ingredients provided." },
  "Pots and pans": { icon: "icon-pots-and-pans", description: "Cookware provided for cooking." },
  "Oil": { icon: "icon-oil", description: "Cooking oil provided." },
  "Salt and pepper": { icon: "icon-salt-and-pepper", description: "Salt and pepper provided." },
  "Dedicated workspace": { icon: "icon-dedicated-workspace", description: "Workspace with a desk and chair for guests to work comfortably." },
};

const amenitiesMap: any = amenitiesList.reduce((map: any, amenity: any) => {
  map[amenity] = amenityDetails[amenity] || { icon: "default-icon", description: "" };
  return map;
}, {});

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
    'Bathroom'
  ];

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 dark:text-stone-400 md:text-base">
            {toDateString(data.createdAt)}
          </p>
          {/* Prop for postId */}
          <ReservationForm postId={data.id} />
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {data.title}
          </h1>
          <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
            {data.description}
          </p>
          <h2>Amenities</h2>
          <div className="flex flex-row justify-left">
            <ul>
              {amenities.map((amenity) => (
                <li key={amenity}>
                  <div className={`flex items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}>
                    {/* <strong>{amenitiesMap[amenity].icon}{amenity}</strong>: {amenitiesMap[amenity]?.description} */}
                    {amenitiesMap[amenity].icon}
                    <span className="text-sm font-medium">{amenity} {amenitiesMap[amenity]?.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <a
          // if you are using Github OAuth, you can get rid of the Twitter option
          href={
            data.site?.user?.username
              ? `https://twitter.com/${data.site.user.username}`
              : `https://github.com/${data.site?.user?.gh_username}`
          }
          rel="noreferrer"
          target="_blank"
        >
          <div className="my-8">
            <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
              {data.site?.user?.image ? (
                <BlurImage
                  alt={data.site?.user?.name ?? "User Avatar"}
                  height={80}
                  src={data.site.user.image}
                  width={80}
                />
              ) : (
                <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                  ?
                </div>
              )}
            </div>
            <div className="text-md ml-3 inline-block align-middle dark:text-white md:text-lg">
              by <span className="font-semibold">{data.site?.user?.name}</span>
            </div>
          </div>
        </a>
      </div >
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
