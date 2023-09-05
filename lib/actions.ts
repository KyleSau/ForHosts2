"use server";

import prisma from "@/lib/prisma";
import { Prisma, Post, Site, Reservation, PrismaPromise } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withPostAuth, withSiteAuth } from "./auth";
import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { calcDateDelta, getBlurDataURL } from "@/lib/utils";
import { RESERVATION_FUTURE_DAYS_THRESHOLD } from "./constants";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const getReservationsByPostId = async (postId: string) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        post: {
          id: postId,
        },
        OR: [
          { status: 'PENDING' },
          { status: 'CONFIRMED' },
        ],
      },
      include: {
        post: true,
      },
    });
    return reservations;
  } catch (error: any) {
    return {
      error: "Failed to fetch reservations",
    };
  }
};

export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await addDomainToVercel(value);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – ping @steventey on Twitter for access.",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        console.log('filename: ' + filename);

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const getSiteFromPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      siteId: true,
    },
  });
  return post?.siteId;
};

export const createPost = withSiteAuth(async (_: FormData, site: Site) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.post.create({
    data: {
      title: '',
      price: 0,
      checkInTime: '0:00',
      checkOutTime: '0:00',
      location: 'location',
      currency: 'USD',
      minimumStay: 0,
      cleaningFee: 0,
      securityDeposit: 0,
      totalBeds: 0,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],  // empty array for amenities
      photoGallery: [],  // empty array for photoGallery
      additionalServices: [],  // empty array for additionalServices
      calendarUrls: [],
      propertyType: 'idk',
      site: {
        connect: {
          id: site.id,
        },
      },
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });


  await revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
  );
  site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

  return response;
});

export const updatePropertyDescript = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!post || post.userId !== session.user.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    
    });
  } catch (e) {
    console.error(e);
  }
}
// creating a separate function for this because we're not using FormData
export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!post || post.userId !== session.user.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        content: data.content,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        location: data.location,
        currency: data.currency,
        minimumStay: data.minimumStay,
        cleaningFee: data.cleaningFee,
        securityDeposit: data.securityDeposit,
        amenities: data.amenities,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        totalBeds: data.totalBeds,
        instantBooking: data.instantBooking,
        rating: data.rating,
        photoGallery: data.photoGallery,
        additionalServices: data.additionalServices,
        availabilityWindow: data.availabilityWindow,
        calendarUrls: data.calendarUrls,
        propertyType: data.propertyType, // change this to data.propertyTpe
      },
    });

    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    );
    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
    );

    // if the site has a custom domain, we need to revalidate those tags too
    post.site?.customDomain &&
      (await revalidateTag(`${post.site?.customDomain}-posts`),
        await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getPosts = async (userId: string, siteId: string | undefined, limit = null) => {
  const posts = await prisma.post.findMany({
    where: {
      userId: userId as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      site: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return posts;
};


export const updatePostMetadata = withPostAuth(
  async (
    formData: FormData,
    post: Post & {
      site: Site;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const files = formData.getAll("image") as File[]; // This will retrieve all the files
        const urls = await Promise.all(files.map(async (file) => {
          const filename = `${nanoid()}.${file.type.split("/")[1]}`;
          console.log('post filename: ' + filename);

          const SIZE_LIMIT = 50000;
          if (file.size > SIZE_LIMIT) {

          }
          const { url } = await put(filename, file, {
            access: "public",
          });

          const blurhash = await getBlurDataURL(url);
          return { url, blurhash };
        }));

        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            image: urls[0]?.url,  // Take the first image URL as the main image
            imageBlurhash: urls[0]?.blurhash, // Same for the blurhash
            photoGallery: urls.map(u => u.url), // Store all the URLs in the photoGallery
            photoGalleryBlurhash: urls.map(u => u.blurhash), // Store all the blurhashes
          },
        })
      } else {
        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }
      // if (key === "image") {
      //   const file = formData.get("image") as File;
      //   const filename = `${nanoid()}.${file.type.split("/")[1]}`;
      //   console.log('post filename: ' + filename);

      //   const { url } = await put(filename, file, {
      //     access: "public",
      //   });

      //   const blurhash = await getBlurDataURL(url);

      //   response = await prisma.post.update({
      //     where: {
      //       id: post.id,
      //     },
      //     data: {
      //       image: url,
      //       imageBlurhash: blurhash,
      //     },
      //   });
      // } else {
      //   response = await prisma.post.update({
      //     where: {
      //       id: post.id,
      //     },
      //     data: {
      //       [key]: key === "published" ? value === "true" : value,
      //     },
      //   });
      // }

      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
      );
      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      post.site?.customDomain &&
        (await revalidateTag(`${post.site?.customDomain}-posts`),
          await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deletePost = withPostAuth(async (_: FormData, post: Post) => {
  try {
    const response = await prisma.post.delete({
      where: {
        id: post.id,
      },
      select: {
        siteId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};


export const getReservations = async (limit: number = 10) => {
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  try {
    const reservations = await prisma.reservation.findMany({
      // take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        post: {
          userId: session.user.id,
        },
      },
      include: {
        post: true,
      },
    });
    return reservations;
  } catch (error: any) {
    return {
      error: "Failed to fetch reservations",
    };
  }
};

// get all the calendar urls from the Post
export const getCalendarUrls = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        calendarUrls: true,
      },
    });
    return post?.calendarUrls || []; // Return an empty array if calendarUrls is not found
  } catch (error: any) {
    return {
      error: "Failed to fetch calendar urls",
    };
  }
};

// this will be invoked by the stripe webhook
// StripeMetaData
export const createReservation = async (formData: FormData, currentDate: Date) => {
  // FormData
  const postId = formData.get("postId") as string;
  const startDate = new Date(formData.get("start-date") as string);
  const endDate = new Date(formData.get("end-date") as string);

  try {
    //do validation
    const dateDeltaArray = calcDateDelta(currentDate, startDate);

    if (dateDeltaArray.some((t: number) => t < 0)) {
      throw new Error("The starting date of your reservation must be on or after today.")
    } else if (dateDeltaArray[0] > RESERVATION_FUTURE_DAYS_THRESHOLD) {
      throw new Error(`The starting date of your reservation cannot be more than ${RESERVATION_FUTURE_DAYS_THRESHOLD} days from today.`);
    }

    const response = await prisma?.reservation.create({
      data: {
        postId,
        startDate,
        endDate,
        totalPrice: 100,
        status: 'PENDING',
      }
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This reservation is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

