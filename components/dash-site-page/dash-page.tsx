"use client";
import AmenitiesModal from "@/components/amenities/amenities-modal";
import { amenityDetails } from "@/components/amenities/amenities-data";
import BookingComponent from "@/components/booking/booking-component";
import ListingDescription from "@/components/users-sites/listing-description";
// import Map from "@/components/users-sites/open-street-map";
import { CalendarDemo } from "@/components/ui/uicalendar";
import ShowMoreModal from "@/components/users-sites/show-more-modal";
import ImageGallery from "@/components/dash-site-page/image-gallery";
import DashHeader from "@/components/dash-site-page/dash-header";
// import { useMap, Circle } from "react-leaflet";
import { useEffect, useState } from "react";
// import Location from "../editor/location";

import dynamic from "next/dynamic";
import { Bedroom } from "@prisma/client";
import AmenitiesPage from "../amenities/amenities-page";
// import MapWrapper from "../editor/map-wrapper";
const Map = dynamic(() => import("@/components/editor/map-wrapper"), {
  loading: () => <p>loading...</p>,
  ssr: false
})

export default function DashPage({ data }) {

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: parseFloat(data.location.latitude),
    lng: parseFloat(data.location.longitude),
  });
  // return (
  //   <div>
  //     {JSON.stringify(coordinates)}
  //     < Map coordinates={coordinates} />
  //   </div >
  // );
  const bedrooms: Bedroom[] = data.propertyDetails.bedrooms;
  return (
    <>
      <div className="col-span-1 m-2 justify-center md:col-span-full ">
        <ImageGallery
          images={[data.site.image]}
          imageBlurhash={[data.site.imageBlurhash]}
        />
      </div>
      <DashHeader
        title={data.title}
        guests={data.propertyDetails.maxGuests}
        bedrooms={data.propertyDetails.totalBedrooms}
        bathrooms={data.propertyDetails.bathrooms}
        totalbeds={bedrooms?.length ?? 0} />
      < Map coordinates={coordinates} />
      <div className="sticky top-0 pb-[150px] pt-[150px]">
        <BookingComponent listing={data} />
      </div>
      <div className="col-start-1 m-2 rounded-sm p-8 md:col-span-3 md:col-start-3 ">
        <div className="">Notable Features</div>
        <hr className="mt-10" />
      </div>
      <div className="flex justify-center">
        Amenities
        <AmenitiesModal amenityDetails={amenityDetails} />
        {/* <AmenitiesModal amenityDetails={amenityDetails} /> */}
      </div>
      {/* <div className="grid-rows-10 container mb-5 grid grid-cols-1 rounded-2xl bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:grid-cols-5">
        <div className="col-span-1 m-2 justify-center md:col-span-full ">
          <ImageGallery
            images={[data.site.image]}
            imageBlurhash={[data.site.imageBlurhash]}
          />
        </div>

        <div className="col-span-1 m-2 md:col-span-full ">
          <DashHeader
            title={data.title}
            guests={propertyDetails.maxGuests}
            bedrooms={propertyDetails.totalBedrooms}
            bathrooms={propertyDetails.bathrooms}
          />
          <hr />
        </div>
        <div className="relative col-span-1 row-span-4 row-start-3 m-2 md:col-span-2 md:min-w-[300px] ">
          <div className="sticky top-0 pb-[150px] pt-[150px]">
            <BookingComponent listing={data} />
          </div>
        </div>
        <div className="col-start-1 m-2 rounded-sm p-8 md:col-span-3 md:col-start-3 ">
          <div className="">Notable Features</div>
          <hr className="mt-10" />
        </div>
        <div className=" col-start-1 m-2 p-8 md:col-span-3 md:col-start-3 ">
          <div className="">Listing Description</div>
          <ListingDescription description={data.description} />
          {data.description && (
            <div>
              <ShowMoreModal text={data.description} />
            </div>
          )}
          <hr className="mt-10" />
        </div>
        <div className=" col-start-1 m-2 mb-8 p-8 md:col-span-3 md:col-start-3">
          <div className="">Sleeping quarters and beds</div>
          <hr className="mt-10" />
        </div>
        <div className=" col-start-1 m-2 mb-8 p-8 md:col-span-3 md:col-start-3">
          <div className="flex justify-center">
            Amenities
            <AmenitiesModal amenityDetails={amenityDetails} />
          </div>
          <hr className="mt-10" />
        </div>
        <div className=" col-start-1 m-2 mb-8 p-8 md:col-span-3 md:col-start-3">
          <div className="mx-auto flex w-full justify-center">
            <CalendarDemo />
          </div>
        </div>
        <hr className="col-span-1 m-5 md:col-span-full" />
        <div className="col-span-1 m-2 md:col-span-full">
          <div className="flex justify-center">
            Map
            Coords: {JSON.stringify(coordinates)}
            < Map coordinates={coordinates} />
          </div>
        </div>
        <hr className="col-span-1 m-5 md:col-span-full" />
        <div className="col-span-1 m-2 rounded-sm bg-white md:col-span-full">
          <p className="mb-5 flex justify-center text-xl font-bold">
            What To Know About Where You&apos;re Staying
          </p>
          <div className="grid grid-cols-3">
            <div className="m-2">
              <p className="flex justify-center text-lg font-bold">
                House Rules
              </p>
              <hr />
              <p className=" flex justify-center">
                Check-in after 3:00 PM
                <br />
                Checkout before 11:00 AM
                <br />
                No pets
              </p>
            </div>
            <div className="m-2">
              <p className="flex justify-center text-lg font-bold">
                Cancellation Info
              </p>
              <hr />
              <p className="flex justify-center">
                Check-in after 3:00 PM
                <br />
                Checkout before 11:00 AM
                <br />
                No pets
              </p>
            </div>
            <div className="m-2">
              <p className="flex justify-center text-lg font-bold">Safety</p>
              <hr />
              <p className=" flex justify-center">
                Check-in after 3:00 PM
                <br />
                Checkout before 11:00 AM
                <br />
                No pets
              </p>
            </div>
          </div>
        </div>
      </div> */}
      {/* <MDX source={data.mdxSource} /> */}
      {/* {
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
      } */}
    </>
  );
}
