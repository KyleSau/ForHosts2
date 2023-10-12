import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
// import PhotoManager from "@/components/editor/photo-manager";
// import { getBlurDataURL } from "@/lib/utils";
import { getBlobMetadata } from "@/lib/blob_actions";
import PreviewSite from "@/components/preview-site";
// import Editor from "@/components/editor";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      images: true,
      site: {
        select: {
          id: true,
          subdomain: true,
        },
      },
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }
  // const enrichedImages = await Promise.all(data.images.map(async (image) => {
  //   const blurDataURL = await getBlurDataURL(image.url); // Assuming image has a url property
  //   return { ...image, blurDataURL };
  // }));

  // const postId = data.id;
  // const siteId = data.site!.id;

  // const currentBlobMetadataForPost = await getBlobMetadata(siteId, postId);
  // const currentFileDataObjects = currentBlobMetadataForPost.map(
  //   (blobMetadata: any & { post: any | null }) => {
  //     const fileDataObject: any = {
  //       inBlobStore: true,
  //       isUploading: false,
  //       ...blobMetadata
  //     }
  //     return fileDataObject;
  //   }
  // );

  // data.images = enrichedImages;

  return <PreviewSite url={'https://google.com'} />
}
