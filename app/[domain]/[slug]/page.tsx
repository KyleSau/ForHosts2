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
import WhereStaying from "@/components/users-sites/where-staying";
import Highlights from "@/components/highlights/highlights";
import HighlightsData from "@/components/highlights/highlights-data";
import SleepingOptions from "@/components/sleeping-options/sleeping-section";
import { sleepingOptions } from "@/components/sleeping-options/sleeping-data";
import SleepingSection from "@/components/sleeping-options/sleeping-section";
import { faBed, faCouch } from "@fortawesome/free-solid-svg-icons";
import { Bedroom } from "@/components/sleeping-options/types";

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

const bedrooms: Bedroom[] = [
  {
    name: 'Bedroom 1',
    description: 'Master Bedroom with lake views',
    beds: [
      {
        name: 'King Bed',
        icon: faBed,
      },
      {
        name: 'Couch',
        icon: faCouch,
      },
      // Add more single beds if needed
    ],
  },
  {
    name: 'Bedroom 2',
    description: 'Guest Room',
    beds: [
      {
        name: 'Double Bed',
        icon: faBed,
      },
      {
        name: 'Double Bed',
        icon: faBed,
      },
      // Add more double beds if needed
    ],
  },
  // Add more bedrooms if needed
  {
    name: 'Living Room',
    description: 'Description for Living Room',
    beds: [
      {
        name: 'Couch',
        icon: faCouch,
      },
      {
        name: 'Couch',
        icon: faCouch,
      },
      // Add more couches if needed
    ],
  },
];

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
      <HighlightsData>{(highlightsData) => (<Highlights highlightsData={highlightsData} />)}</HighlightsData>
      {data.content != null && <ShowMoreModal text={data.content} mdxSource={data.mdxSource} />}
      <AmenitiesModal amenityDetails={amenityDetails} />
      <CalendarDemo />
      <SleepingSection bedrooms={bedrooms} />
      <Map />
      <WhereStaying />
    </>
  );
}
