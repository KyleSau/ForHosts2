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
import WhatToKnow from "../what-to-know";
import SleepingQuarters from "../users-sites/sleeping-quarters";
// import MapWrapper from "../editor/map-wrapper";
const Map = dynamic(() => import("@/components/editor/map-wrapper"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function DashPage({ data }) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: parseFloat(data.location.latitude),
    lng: parseFloat(data.location.longitude),
  });

  const bedrooms: Bedroom[] = data.propertyDetails.bedrooms;

  return (
    <>
      <div className="grid-rows-10 container mb-5 pb-5 pt-5 grid grid-cols-1 rounded-2xl bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:grid-cols-5">
        <div className="col-span-1 m-2 justify-center md:col-span-full ">
          <ImageGallery
            images={[data.site.image]}
            imageBlurhash={[data.site.imageBlurhash]}
          />
        </div>

        <div className="col-span-1 m-2 md:col-span-full ">
          <DashHeader
            title={data.title}
            guests={data.propertyDetails.maxGuests}
            bedrooms={data.propertyDetails.totalBedrooms}
            bathrooms={data.propertyDetails.bathrooms}
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
          <hr className="mt-10 h-2" />
        </div>
        <div className="col-start-1 m-2 rounded-sm md:col-span-3 md:col-start-3">
          <div className="flex justify-center">
            <SleepingQuarters />
          </div>
          <hr className="mt-10 h-2 w-full" />
        </div>
        <div className="col-start-1 m-2 rounded-sm p-8 md:col-span-3 md:col-start-3">
          <div className="flex justify-center">
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
          <div>
            <p className="text-2xl mb-5">Where You&apos;ll Be</p>
            <Map coordinates={coordinates} />
            <div className="m-5">
              <p className="text-lg font-bold text-gray-600">Rockbridge, Ohio, United States</p>

            </div>
          </div>
        </div>
        <hr className="col-span-1 m-5 md:col-span-full" />
        <WhatToKnow />
      </div >
    </>
  );
}
