import { notFound } from "next/navigation";
import { getPostData } from "@/lib/fetchers";

import DashPage from "@/components/dash-site-page/dash-page";
// import OpenStreetMap from '../component/OpenStreetMap'

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
  const idStuff = await getPostData(domain, slug);
  const data = await prisma.post.findUnique({
    where: {
      id: idStuff.id,
    },
    include: {
      availability: true,
      propertyDetails: true,
      location: true,
      images: true,
      site: {
        select: {
          subdomain: true,
        },
      },
    },
  });

  if (!data) {
    notFound();
  }

  return (
    <>
      <DashPage data={data} />
    </>
  );
}
