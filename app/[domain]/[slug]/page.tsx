import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import ReservationForm from "@/components/booking/reservation-form";
import AmenitiesModal from "@/components/amenities/amenities-modal";
import { amenityDetails } from "@/components/amenities/amenities-data";
import ImageGallery from "@/components/dash-site-page/image-gallery";
import DashHeader from "@/components/dash-site-page/dash-header";
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
        {/* Make this Photo Gallery? */}
        {/* md:w-7/12 */}
        <div className="m-auto w-full text-center md:w-10/12">
          <div className="relative m-auto h-80 w-full max-w-screen-lg overflow-hidden md:mb-5 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
            <ImageGallery image={data.image} imageBlurhash={data.imageBlurhash} />
          </div>
          <div>
            <DashHeader title={data.title} subtext={data.description} guests={data.maxGuests} bedrooms={data.bedrooms} totalbeds={data.totalBeds} bathrooms={data.bathrooms} />
          </div>
          <hr />
          <div className="flex flex-col bg-gray-50 items-center [-9">
            {/* <ReservationForm postId={data.id} /> */}
          </div>
          <div className="p-8">
            <AmenitiesModal amenityDetails={amenityDetails} />
          </div>
          <hr />
          {/* <div className="flex grid w-full grid-cols-2">
              <div className="flex grid col-span-2 col-start-1 bg-green-300 h-96">
                <h2 className={"text-lg"}>Map of Property Location</h2>
              </div>
              <div className="flex grid col-span-2 bg-gray-300">
                <h2 className={"text-lg"}>ggggggg</h2>
              </div>
            </div>

            <div className="flex grid w-full grid-cols-6 bg-gray-100 mt-5 rounded-md h-full">
              <div className="flex grid col-span-6 w-full row-start-1 rounded-md">
                <h2 className={"text-lg font-bold p-5"}>Things To Know</h2>
              </div>
              <div className="flex grid col-span-2 row-start-2 bg-gray-50 p-5">
                <h2 className={"text-md font-bold"}>House Rules</h2>
                <ul className="list-disc list-inside text-left">
                  <li>Check-in: 3:00 PM - 9:00 PM</li>
                  <li>Checkout before 11:00 AM</li>
                  <li>2 guests maximum</li>
                </ul>
                <button className="bg-gray-400 rounded-md p-2 hover:bg-gray-200" />
              </div>
              <div className="flex grid col-span-2 row-start-2 bg-gray-75 p-5">
                <h2 className={"text-md font-bold"}>Safety Considerations</h2>
                <ul className="list-disc list-inside text-left">
                  <li>Pool/hot tub without a gate or lock</li>
                  <li>Nearby lake, river, other body of water</li>
                  <li>Carbon monoxide alarm</li>
                </ul>
                <button className="bg-gray-400 rounded-md p-2 hover:bg-gray-200" />
              </div>
              <div className="flex grid col-span-2 row-start-2 bg-gray-50 p-5">
                <h2 className={"text-md font-bold"}>Cancellation Policy</h2>
                <ul className="list-disc list-inside text-left">
                  <li>Free cancellation before Jan 30.</li>
                  <li>Review the Host’s full cancellation policy.</li>
                </ul>
                <button className="bg-gray-400 rounded-md p-2 hover:bg-gray-200" />
              </div>
            </div>
            </div>*/}
        </div>
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
