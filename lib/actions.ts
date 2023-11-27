"use server";

import prisma from "@/lib/prisma";
import { Bedroom, Post, Site } from "@prisma/client";
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
import { getBlurDataURL } from "@/lib/utils";

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
        OR: [{ status: "PENDING" }, { status: "CONFIRMED" }],
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

export const getBedrooms = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      propertyDetails: {
        include: {
          bedrooms: {
            orderBy: {
              createdAt: "asc", // Order by createdAt in descending order (LIFO)
            },
          },
        },
      },
    },
  });
  return post?.propertyDetails?.bedrooms || [];
};

export const updateBedroom = async (bedroom: Bedroom) => {
  const updatedBedroom = await prisma.bedroom.update({
    where: { id: bedroom.id },
    data: bedroom,
  });
  return updatedBedroom;
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

        console.log("filename: " + filename);

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

const getAirBnBData = () => {
  const url = 'https://www.airbnb.ca/rooms/43805999';

  const listingId = url.split('/').pop();
  console.log('listingId: ', listingId);
  const toEncode = `StayListing:${listingId}`;
  const encoded = btoa(toEncode).replace('=', '%3D');

  const headers = {
    'accept-language': 'en-US',
    'content-type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36',
    'x-airbnb-api-key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20', // Copy from Airbnb request headers
  };

  const newUrl = `https://www.airbnb.ca/api/v3/StaysPdpSections?operationName=StaysPdpSections&locale=en-CA&currency=CAD&_cb=1987xzg1yzv9ed124yrix00ybtwv&variables=%7B%22id%22%3A%22${encoded}%22%2C%22pdpSectionsRequest%22%3A%7B%22adults%22%3A%221%22%2C%22bypassTargetings%22%3Afalse%2C%22categoryTag%22%3Anull%2C%22causeId%22%3Anull%2C%22children%22%3Anull%2C%22disasterId%22%3Anull%2C%22discountedGuestFeeVersion%22%3Anull%2C%22displayExtensions%22%3Anull%2C%22federatedSearchId%22%3Anull%2C%22forceBoostPriorityMessageType%22%3Anull%2C%22infants%22%3Anull%2C%22interactionType%22%3Anull%2C%22layouts%22%3A%5B%22SIDEBAR%22%2C%22SINGLE_COLUMN%22%5D%2C%22pets%22%3A0%2C%22pdpTypeOverride%22%3Anull%2C%22preview%22%3Afalse%2C%22previousStateCheckIn%22%3Anull%2C%22previousStateCheckOut%22%3Anull%2C%22priceDropSource%22%3Anull%2C%22privateBooking%22%3Afalse%2C%22promotionUuid%22%3Anull%2C%22relaxedAmenityIds%22%3Anull%2C%22searchId%22%3Anull%2C%22selectedCancellationPolicyId%22%3Anull%2C%22selectedRatePlanId%22%3Anull%2C%22staysBookingMigrationEnabled%22%3Afalse%2C%22translateUgc%22%3Anull%2C%22useNewSectionWrapperApi%22%3Afalse%2C%22sectionIds%22%3Anull%2C%22checkIn%22%3Anull%2C%22checkOut%22%3Anull%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%222e71de979aa92574a9e7e83d9192b3bb6bb184b8c446380b12c3160cfc8a9cbc%22%7D%7D`;
  //const newUrl = `https://www.airbnb.com/api/v2/get-data-layer-variables?locale=en&currency=USD`;
  fetch(newUrl, { headers })
    .then(response => response.json())
    .then(data => {
      // console.log(data.data.presentation.stayProductDetailPage.sections.metadata.loggingContext.eventDataLogging.listingLat);
      const listingData = data.data.presentation.stayProductDetailPage;

      // Extracting the required information
      const title = listingData.sections.listingTitle.title;
      const pictureUrls = listingData.sections.listingPhotos.photos.map(photo => photo.large);
      const description = listingData.sections.listingDescription.description;
      const amenities = listingData.sections.listingAmenities.amenities.map(amenity => amenity.title);
      const maxGuests = listingData.sections.listingPolicies.policies.find(policy => policy.title === 'Max guests').content;

      // Logging the extracted data
      console.log('Title:', title);
      console.log('Picture URLs:', pictureUrls);
      console.log('Description:', description);
      console.log('Amenities:', amenities);
      console.log('Max Guests:', maxGuests);
      return data;
    })
    .catch(error => console.error('Error:', error));
}

export const createPost = withSiteAuth(async (_: FormData, site: Site) => {
  getAirBnBData();
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.post.create({
    data: {
      title: "",
      description: "",
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
      location: {
        create: {},
      },
      pricing: {
        create: {},
      },
      availability: {
        create: {},
      },
      propertyRules: {
        create: {},
      },
      propertyDetails: {
        create: {},
      },
      afterBookingInfo: {
        create: {},
      },
    },
  });

  await revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
  );
  site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

  return response;
});

// we need to break this update function up
/*export const updatePost = async (data: Post) => {
  console.log("data: " + JSON.stringify(data));
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" };
  }

  // Fetch the post and its related sub-tables
  console.log();

  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      images: true,
      site: true,
      pricing: true,
      location: true,
      availability: true,
      propertyRules: true,
      propertyDetails: true,
      afterBookingInfo: true,
    },
  });

  if (!post || post.userId !== session.user.id) {
    return { error: "Post not found" };
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    // const locationId = data.locationId!;
    // const location = prisma.location.findUnique({ where: { id: locationId } });

    // LocationUpdateRequest
    if (data.location) {
      const { longitude, latitude, radius } = data.location;
      const randomizedLocation = approximateLocation(
        parseFloat(latitude),
        parseFloat(longitude),
        radius ?? 0,
      );

      console.log("radius: ", radius);

      const lng: string = randomizedLocation.lng + "";
      const lat: string = randomizedLocation.lat + "";

      data.location.longitude = lng;
      data.location.latitude = lat;

      console.log("ideal location: ", JSON.stringify(data.location));

      await prisma.location.update({
        where: { id: post.location!.id },
        data: data.location,
      });
    }

    if (data.pricing) {
      await prisma.pricing.update({
        where: { id: post.pricing!.id },
        data: data.pricing,
      });
    }

    if (data.availability) {
      await prisma.availability.update({
        where: { id: post.availability!.id },

        data: data.availability,
      });
    }

    if (data.propertyRules) {
      console.log(JSON.stringify(data.propertyRules));
      await prisma.propertyRules.update({
        where: { id: post.propertyRulesId! },
        data: data.propertyRules,
      });
    }

    // Check if the totalBedrooms field is being updated
    if (
      data.propertyDetails &&
      typeof data.propertyDetails.totalBedrooms !== "undefined"
    ) {
      const newTotalBedrooms = data.propertyDetails.totalBedrooms;
      const currentTotalBedrooms = post.propertyDetails.totalBedrooms;

      // If there's an increase in totalBedrooms
      if (newTotalBedrooms > currentTotalBedrooms) {
        const difference = newTotalBedrooms - currentTotalBedrooms;
        for (let i = 0; i < difference; i++) {
          // Create a new Bedroom entry with default values
          await prisma.bedroom.create({
            data: {
              // Add any other default values if necessary
              propertyDetailsId: post.propertyDetails.id,
            },
          });
        }
      }

      // If there's a decrease in totalBedrooms
      if (newTotalBedrooms < currentTotalBedrooms) {
        const difference = currentTotalBedrooms - newTotalBedrooms;
        // Fetch the latest 'difference' number of Bedroom entries
        // Assuming a createdAt field exists in the Bedroom model
        const bedroomsToDelete = await prisma.bedroom.findMany({
          where: { propertyDetailsId: post.propertyDetails.id },
          orderBy: { createdAt: "desc" },
          take: difference,
        });

        for (const bedroom of bedroomsToDelete) {
          // Delete the Bedroom entry
          await prisma.bedroom.delete({ where: { id: bedroom.id } });
        }
      }

      // Now, update the propertyDetails
      await prisma.propertyDetails.update({
        where: { id: post.propertyDetails.id },
        data: data.propertyDetails,
      });
    }
    // if (data.propertyDetails) {
    //   const totalBedrooms = data.propertyDetails.totalBedrooms;

    //   await prisma.propertyDetails.update({
    //     where: { id: post.propertyDetails!.id },
    //     data: data.propertyDetails,
    //   });
    // }

    if (data.afterBookingInfo) {
      await prisma.afterBookingInfo.update({
        where: { id: post.afterBookingInfo!.id },
        data: data.afterBookingInfo,
      });
    }

    return updatedPost;
  } catch (error: any) {
    console.error("Error updating post and its relations:", error);
    return { error: error.message };
  }
};*/

export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return { error: "Not authenticated" };
  }

  // Fetch the post and its related sub-tables
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      images: true,
      site: true,
      pricing: true,
      location: true,
      availability: true,
      propertyRules: true,
      propertyDetails: true,
      afterBookingInfo: true,
    },
  });

  if (!post || post.userId !== session.user.id) {
    return { error: "Post not found" };
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    if (post.location) {
      await prisma.location.update({
        where: { id: post.location!.id },
        data: post.location,
      });
    }

    if (post.pricing) {
      await prisma.pricing.update({
        where: { id: post.pricing!.id },
        data: post.pricing,
      });
    }

    if (post.availability) {
      await prisma.availability.update({
        where: { id: post.availability!.id },
        data: post.availability,
      });
    }

    if (post.propertyRules) {
      await prisma.propertyRules.update({
        where: { id: post.propertyRules!.id },
        data: post.propertyRules,
      });
    }

    if (post.propertyDetails) {
      await prisma.propertyDetails.update({
        where: { id: post.propertyDetails!.id },
        data: post.propertyDetails,
      });
    }

    if (post.afterBookingInfo) {
      await prisma.afterBookingInfo.update({
        where: { id: post.afterBookingInfo!.id },
        data: post.afterBookingInfo,
      });
    }

    return updatedPost;

  } catch (error: any) {
    console.error('Error updating post and its relations:', error);
    return { error: error.message };
  }
};

export const getPosts = async (
  userId: string,
  siteId: string | undefined,
  limit = null,
) => {
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
      images: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      // and other tables
    },
    ...(limit ? { take: limit } : {}),
  });

  return posts;
};

// revisit this
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
        const urls = await Promise.all(
          files.map(async (file) => {
            const filename = `${nanoid()}.${file.type.split("/")[1]}`;
            console.log("post filename: " + filename);

            const SIZE_LIMIT = 50000;
            if (file.size > SIZE_LIMIT) {
            }
            const { url } = await put(filename, file, {
              access: "public",
            });

            const blurhash = await getBlurDataURL(url);
            return { url, blurhash };
          }),
        );

        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {},
        });
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

// McDoodle: test if everything is cascade deleted!
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
  // try {
  //   const post = await prisma.post.findUnique({
  //     where: {
  //       id: postId,
  //     },
  //     select: {
  //       calendarUrls: true,
  //     },
  //   });
  //   return post?.calendarUrls || []; // Return an empty array if calendarUrls is not found
  // } catch (error: any) {
  //   return {
  //     error: "Failed to fetch calendar urls",
  //   };
  // }
};

/*
export const createReservation = async (formData: FormData, currentDate: Date) => {
  const postId = formData.get("postId") as string;
  const startDate = new Date(formData.get("start-date") as string);
  const endDate = new Date(formData.get("end-date") as string);

  try {
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
*/
