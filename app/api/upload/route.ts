import { handleBlobUpload, type HandleBlobUploadBody } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth";
import { FILE_CONSTS } from '@/lib/constants';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleBlobUploadBody;

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

        console.log("onBeforeGenerateToken: pathname: ", pathname);
        // console.log("body: ", body);
        // console.log("request: ", request);

        return {
          allowedContentTypes: [FILE_CONSTS.JPEG, FILE_CONSTS.PNG, FILE_CONSTS.BMP],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            userId: session.user.id,
          })
        };
      },
      onUploadCompleted: async ({ blob, metadata }) => {
        // Get notified of browser upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('onUploadCompleted: blob: ', blob);
        console.log("onUploadCompleted: metadata: ", metadata);
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
