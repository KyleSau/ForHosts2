"use server";

import { getSession } from "@/lib/auth";
import { list, del, BlobResult } from '@vercel/blob';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const uploadBlobMetadata = async (blobResult: BlobResult, postId: string, siteId: string) => {
  try {

    const session = await getSession();

    if (!session?.user.id) {
      throw new Error('user not authenticated');
    }
    // transaction:
    const images = await prisma.image.findMany({
      where: {
        postId: postId
      }
    });

    // Run any logic after the file upload completed
    // const { userId } = JSON.parse(metadata);
    // await db.update({ avatar: blob.url, userId });
    const response = await prisma.image.create({
      data: {
        url: blobResult.url,
        uploadedAt: blobResult.uploadedAt,
        size: blobResult.size.toString(),
        fileName: blobResult.pathname,
        orderIndex: images.length,
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
  if (!siteId)
    throw new Error('no site id found!');
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
  console.log("blobs: ", blobs);
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

// i need to finish this
export async function shiftBlobMetadata(postId: string, oldIndex: number, newIndex: number) {
  const images = prisma.image.findMany({ where: { postId: postId }, orderBy: { orderIndex: 'asc' } });
  let tmp = [];
  if (oldIndex < newIndex)
    tmp = (await images).slice(oldIndex, newIndex);
  else
    tmp = (await images).slice(newIndex, oldIndex);

  // ignore the first
  for (const t of tmp) {
    prisma.image.update
  }
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