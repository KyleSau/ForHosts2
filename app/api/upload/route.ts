import { handleBlobUpload, type HandleBlobUploadBody } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { put } from '@vercel/blob';

// Using this: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk#upload-a-blob (server upload)
// export async function PUT(request: Request) {
//   const form = await request.formData();
//   const file = form.get('file') as File;
//   console.log("received file: ", file);
//   console.log("file.name: ", file.name);
//   const blob = await put(file.name, file, { access: 'public' });
//   return NextResponse.json(blob);
// }


// Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleBlobUploadBody;
  console.log("request body: ", body);

  const session = await getSession();

  if (!session)
    throw new Error('Session does not exist');

  try {
    const jsonResponse = await handleBlobUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before reaching this point.
        // Otherwise, you're allowing anonymous uploads.
        // const { user, userCanUpload } = await auth(request, pathname);
        // if (!userCanUpload) {
        //   throw new Error('not authenticated or bad pathname');
        // }
        console.log("onBeforeGenerateToken pathname: ", pathname);

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          metadata: JSON.stringify({
            // optional, sent to your server on upload completion
            userId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, metadata }) => {
        // Get notified of browser upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('onUploadCompleted: blob upload completed: ', blob, metadata);
        // create the image table
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}


// Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads
// export async function POST(request: Request): Promise<NextResponse> {
//   const body = (await request.json()) as HandleBlobUploadBody;
//   console.log("request body: ", body);

//   const session = await getSession();

//   if (!session)
//     throw new Error('Session does not exist');

//   try {
//     const jsonResponse = await handleBlobUpload({
//       body,
//       request,
//       onBeforeGenerateToken: async (pathname) => {
//         // Generate a client token for the browser to upload the file

//         // ⚠️ Authenticate users before reaching this point.
//         // Otherwise, you're allowing anonymous uploads.
//         // const { user, userCanUpload } = await auth(request, pathname);
//         // if (!userCanUpload) {
//         //   throw new Error('not authenticated or bad pathname');
//         // }



//         console.log("onBeforeGenerateToken pathname: ", pathname);

//         return {
//           allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
//           metadata: JSON.stringify({
//             // optional, sent to your server on upload completion
//             userId: session.user.id,
//           }),
//         };
//       },
//       onUploadCompleted: async ({ blob, metadata }) => {
//         // Get notified of browser upload completion
//         // ⚠️ This will not work on `localhost` websites,
//         // Use ngrok or similar to get the full upload flow

//         console.log('onUploadCompleted: blob upload completed: ', blob, metadata);
//         // create the image table


//         // try {
//         //   // Run any logic after the file upload completed
//         //   // const { userId } = JSON.parse(metadata);
//         //   // await db.update({ avatar: blob.url, userId });
//         //   const response = await prisma.image.create({
//         //     // site: {
//         //     //   connect: {
//         //     //     id: site.id,
//         //     //   },
//         //     // },
//         //     // post: {
//         //     //   connect: {
//         //     //     id: post.id,
//         //     //   },
//         //     // },
//         //     data: {
//         //       url: blob.url,
//         //       uploadedAt: blob.uploadedAt,
//         //       size: blob.size,
//         //       user: {
//         //         connect: {
//         //           id: session.user.id,
//         //         },
//         //       }
//         //     }
//         //   });
//         // } catch (error) {
//         //   throw new Error('Could not update user');
//         // }
//       },
//     });

//     return NextResponse.json(jsonResponse);
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 400 }, // The webhook will retry 5 times waiting for a 200
//     );
//   }
// }

