// import { put } from "@vercel/blob";
// import { nanoid } from "nanoid";
// import { NextResponse } from "next/server";
// import { compare } from "swr/_internal";

// export const runtime = "edge";

// export async function POST(req: Request) {
//   if (!process.env.BLOB_READ_WRITE_TOKEN) {
//     return new Response(
//       "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
//       {
//         status: 401,
//       },
//     );
//   }

//   const file = req.body || "";
//   const contentType = req.headers.get("content-type") || "text/plain";
//   const filename = `${nanoid()}.${contentType.split("/")[1]}`;
//   console.log('filename: ' + filename);
//   const blob = await put(filename, file, {
//     contentType,
//     access: "public",
//   });

//   return NextResponse.json(blob);
// }
// import { put } from "@vercel/blob";
// import { nanoid } from "nanoid";
// import { NextResponse } from "next/server";

// export const runtime = "edge";

// export async function POST(req: Request) {
//   if (!process.env.BLOB_READ_WRITE_TOKEN) {
//     return new Response(
//       "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
//       {
//         status: 401,
//       },
//     );
//   }


//   if (!Array.isArray(req.body)) {
//     // NOTE: use old method then do single upload instead of throwing 400
//     return new Response("Expected an array of files.", {
//       status: 400,
//     });
//   }

//   const responses = [];

//   for (const file of req.body) {
//     const contentType = file.type || "text/plain";
//     const filename = `${nanoid()}.${contentType.split("/")[1]}`;
//     console.log('filename: ' + filename);
//     const blob = await put(filename, file, {
//       contentType,
//       access: "public",
//     });

//     responses.push(blob);
//   }

//   return NextResponse.json(responses);
// }

//https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads

import { handleBlobUpload, type HandleBlobUploadBody } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleBlobUploadBody;
  console.log("request body: ", body);

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
            userId: "userid_mushu",
          }),
        };
      },
      onUploadCompleted: async ({ blob, metadata }) => {
        // Get notified of browser upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
 
        console.log('onUploadCompleted: blob upload completed: ', blob, metadata);
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(metadata);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
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

