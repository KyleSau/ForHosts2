import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import MDX from "@/components/mdx";
import AmenitiesModal from "@/components/amenities/amenities-modal";
import { amenityDetails } from "@/components/amenities/amenities-data";
import BookingComponent from "@/components/booking/booking-component";
import ListingDescription from "@/components/users-sites/listing-description";

import dynamic from 'next/dynamic'
import { CalendarDemo } from "@/components/ui/uicalendar";
// import OpenStreetMap from '../component/OpenStreetMap'
const Map = dynamic(() => import('@/components/users-sites/open-street-map'), {
  ssr: false,
})

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
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 grid-rows-10 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl">
        {/* <div className="col-span-1 md:col-span-full justify-center m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <ImageGallery images={data.photoGallery} imageBlurhash={data.photoGalleryBlurhash} />
        </div>
        <div className="bg-white col-span-1 md:col-span-full m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <DashHeader title={data.title} guests={data.maxGuests} bedrooms={data.bedrooms} totalbeds={data.totalBeds} bathrooms={data.bathrooms} />
          <hr />
        </div> */}
        <div className="relative bg-white col-span-1 md:col-span-2 md:min-w-[400px] m-2 row-span-4 row-start-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="sticky top-0 pt-[50px] pb-[50px]">
            <BookingComponent listing={data} />
          </div>
        </div>
        <div className="bg-white rounded-sm col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="">
            Notable Features
          </div>
        </div>
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="">
            Listing Description
          </div>
          <ListingDescription description={data.description} />
        </div>
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="">
            Sleeping quarters and beds
          </div>
        </div>
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 p-8 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex justify-center">
            <AmenitiesModal amenityDetails={amenityDetails} />
          </div>
        </div>
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="w-full mx-auto flex justify-center">
            <CalendarDemo />
          </div>
        </div>
        <hr className="m-5 col-span-1 md:col-span-full" />
        <div className="col-span-1 md:col-span-full m-2">
          <div className="">
            {/* <Map /> */}
          </div>
        </div>
        <hr className="m-5 col-span-1 md:col-span-full" />
        <div className="bg-white col-span-1 md:col-span-full m-2">
          <div className="">
            Host Description
          </div>
        </div>
        <div className="bg-white col-span-1 md:col-span-full m-2 rounded-sm">
          <p className="text-xl font-bold flex justify-center mb-5">What To Know About Where You&apos;re Staying</p>
          <div className="grid grid-cols-3">
            <div className="m-2">
              <p className="text-lg font-bold flex justify-center">House Rules</p>
              <hr />
              <p className=" flex justify-center">Check-in after 3:00 PM<br />
                Checkout before 11:00 AM<br />
                No pets

              </p>
            </div>
            <div className="m-2">
              <p className="text-lg font-bold flex justify-center">Cancellation Info</p>
              <hr />
              <p className="flex justify-center">Check-in after 3:00 PM<br />
                Checkout before 11:00 AM<br />
                No pets

              </p>
            </div>
            <div className="m-2">
              <p className="text-lg font-bold flex justify-center">Safety</p>
              <hr />
              <p className=" flex justify-center">Check-in after 3:00 PM<br />
                Checkout before 11:00 AM<br />
                No pets

              </p>
            </div>
          </div>
        </div>
      </div >

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
            {data.adjacentPosts.map((data: any, index: number) => (
              <BlogCard key={index} data={data} />
            ))}
          </div>
        )
      }
    </>
  );
}
