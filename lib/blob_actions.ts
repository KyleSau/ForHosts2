"use server";

import { getSession } from "@/lib/auth";
import { list, del, BlobResult } from '@vercel/blob';
import { getBlurDataURL } from "./utils";
import { PrismaClient } from "@prisma/client";
import { promiseHooks } from "v8";
const prisma = new PrismaClient();

export const uploadBlobMetadata = async (blobResult: BlobResult, orderIndex: number, postId: string, siteId: string) => {
  console.log("entered uploadBlobMetadata");
  try {
    console.log("uploadBlobMetadata: postId: ", postId);
    console.log("uploadBlobMetadata: siteId: ", siteId);
    console.log("blobSize: ", blobResult.size);
    console.log("size type: ", typeof blobResult.size);

    const tempOrderIndex = 0;

    const session = await getSession();

    // Run any logic after the file upload completed
    // const { userId } = JSON.parse(metadata);
    // await db.update({ avatar: blob.url, userId });
    const response = await prisma.image.create({
      data: {
        url: blobResult.url,
        uploadedAt: blobResult.uploadedAt,
        size: blobResult.size.toString(),
        fileName: blobResult.pathname,
        orderIndex,
        site: {
          connect: {
            id: siteId
          }
        },
        post: {
          connect: {
            id: postId
          }
        }
      }
    });
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw new Error('Could not update user');
  }
};

export const updateBlobMetadata = async (cuid: string, updatedFields: any) => {
  console.log("entered updateBlobMetadata");
  try {
    console.log("cuid: ", cuid);
    const response = await prisma.image.update({
      where: {
        id: cuid
      },
      data: {
        orderIndex: updatedFields.orderIndex
      }
    });
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw new Error('Could not update user');
  }
};

export const getBlobMetadata = async (siteId: string, postId: string) => {
  try {
    const response = await prisma.image.findMany({
      where: {
        siteId,
        postId
      },
      include: {
        post: true,
      },
      orderBy: {
        orderIndex: "asc"
      }
    });
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw new Error('Could not update user');
  }
};


export const listAllBlobMetadata = async () => {
  try {
    const response = await prisma.image.findMany({
      orderBy: {
        orderIndex: "asc"
      }
    });
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw new Error('Could not update user');
  }
};


export const deleteBlobMetadata = async (id: string) => {
  const response = await prisma.image.delete({
    where: {
      id
    }
  });
  return response;
};


export const listAllBlobsInStore = async () => {
  console.log("listAllBlobsInStoreAction called");
  const { blobs } = await list();
  // console.log("type of blobs: ", typeof(blobs));
  // console.log("blobs: ", blobs);
  // return NextResponse.json(blobs);
  return blobs;
};


export const deleteBlobFromStore = async (urlToDelete: string) => {
  console.log("deleteBlobFromStore called");

  if (urlToDelete !== null) {
    const deletedBlob: any = await del(urlToDelete);
    console.log("deletedBlob: ", deletedBlob);

    const blobUrl = deletedBlob?.url;
    console.log("blobUrl: ", blobUrl);

    if (urlToDelete === blobUrl) {
      const successJson = {
        message: "Success",
        ...deletedBlob
      };
      return successJson;
    }
  }

  const errorJson = {
    message: "An error occurred on the server while deleting file at: " + urlToDelete
  };
  return errorJson;
};

//slotIdx is the destination idx
export async function swapBlobMetadata(postId: string, slotIdx: number, imageId: string) {
  console.log("swapBlobMetadata entered: postId: ", postId, "    slotIdx: ", slotIdx, "   imageId: ", imageId);
  if (!postId || slotIdx === undefined || !imageId) {
    console.log('swapping blob meta data was missing server action arguments');
    return;
  }

  // Retrieve currentImage using its imageId and get its orderIndex
  const currentImage = await prisma.image.findUnique({
    where: {
      id: imageId
    }
  });

  if (!currentImage) {
    throw new Error(`Image with ID ${imageId} not found.`);
  }

  // Retrieve prevImage using the slotIdx and postId
  const prevImage = await prisma.image.findFirst({
    where: {
      postId: postId,
      orderIndex: slotIdx,
    }
  });

  if (!prevImage) {
    throw new Error(`Image with postId ${postId} and orderIndex ${slotIdx} not found.`);
  }

  // Use Prisma's transaction to ensure both updates happen or none of them does
  await prisma.$transaction([
    prisma.image.update({
      where: { id: currentImage.id },
      data: { orderIndex: slotIdx }
    }),
    prisma.image.update({
      where: { id: prevImage.id },
      data: { orderIndex: currentImage.orderIndex }
    }),
  ]);

  return {
    swappedImage: currentImage,
    replacedImage: prevImage
  };
}

/**
 * 
 * @param id cuid of the image metadata to delete
 * @param slotIdxToDelete actual index in the array of images
 * @returns 
 */
export async function deleteAndReindex(id: string, slotIdxToDelete: number) {
  return prisma.$transaction([
    prisma.image.delete({
      where: { id }
    }),
    prisma.image.updateMany({
      where: { orderIndex: { gt: slotIdxToDelete } },
      data: { orderIndex: { decrement: 1 } }
    }),
  ]);
}
