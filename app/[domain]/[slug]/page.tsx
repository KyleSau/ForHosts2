import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import ReservationForm from "@/components/booking/reservation-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@/components/modal";
import AmenitiesModal from "@/components/amenities/amenities-modal";
import { amenityDetails } from "@/components/amenities/amenities-data";

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


export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getPostData(domain, slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-5 md:text-2xl">
          <div>
            <h1 className="md:text-1xl font-bold text-stone-800 dark:text-white">
              {data.title}
            </h1>
          </div>
          <div>
            <h1 className="md:text-1xl text-stone-600 dark:text-white">
              {/* {data.location} */}
            </h1>
          </div>
          <div>
            <h1 className="md:text-1xl text-stone-800 dark:text-white">
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

          <AmenitiesModal amenityDetails={amenityDetails} />

          <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2">
            <div className="flex-row">
              <ReservationForm postId={data.id} />
            </div>
            <div className="flex-row">
              <h2 className={"text-lg"}>Availability</h2>
            </div>
            <div className="flex-row">
              <h2 className={"text-lg"}>Availability</h2>
            </div>
          </div>
        </div>
      </div>
      <MDX source={data.mdxSource} />
      {data.adjacentPosts.length > 0 && (
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
      )}
      {data.adjacentPosts && (
        <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
          {data.adjacentPosts.map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )}
    </>
  );
}
