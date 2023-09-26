"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { list, del, BlobResult } from '@vercel/blob';
import { getBlurDataURL } from "./utils";

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