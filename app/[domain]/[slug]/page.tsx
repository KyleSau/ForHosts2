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
    'Towels',
    'Wifi',
    'Bathroom',
    'Breakfast'
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
                  <div className={`flex items-center space-x-3 rounded-lg px-2 py-1.5 dark:text-white `}>
                    {<FontAwesomeIcon icon={amenitiesMap[amenity].icon} />}
                    <span className="text-sm font-medium m-5">{amenity} &nbsp; </span>{amenitiesMap[amenity]?.description}
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