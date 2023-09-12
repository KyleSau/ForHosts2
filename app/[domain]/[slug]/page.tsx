import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import AmenitiesModal from "@/components/amenities/amenities-modal";
import { amenityDetails } from "@/components/amenities/amenities-data";
import ImageGallery from "@/components/dash-site-page/image-gallery";
import DashHeader from "@/components/dash-site-page/dash-header";
import BookingComponent from "@/components/booking/booking-component";
import dynamic from 'next/dynamic'
import { CalendarDemo } from "@/components/ui/uicalendar";
import ShowMoreModal from "@/components/users-sites/show-more-modal"
import Beds from "@/components/users-sites/beds";
import Features from "@/components/users-sites/features";
import WhereStaying from "@/components/users-sites/where-staying";
import OtherRentals from "@/components/users-sites/other-rentals";

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
      <ImageGallery images={data.photoGallery} imageBlurhash={data.photoGalleryBlurhash} />
      <DashHeader title={data.title} guests={data.maxGuests} bedrooms={data.bedrooms} totalbeds={data.totalBeds} bathrooms={data.bathrooms} />
      <BookingComponent listing={data} />
      {data.content != null && <ShowMoreModal text={data.content} mdxSource={data.mdxSource} />}
      <AmenitiesModal amenityDetails={amenityDetails} />
      <CalendarDemo />
      <Features />
      <Beds />
      <Map />
      <WhereStaying />
    </>
  );
}
