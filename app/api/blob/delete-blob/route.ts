import { BlobResult, del } from '@vercel/blob';
 
export const runtime = 'edge';
 
export async function DELETE(request: Request) {
  // console.log("request: ", request);
  const { searchParams } = new URL(request.url);
  // console.log("searchParams: ", searchParams);
  const urlToDelete: string | null = searchParams.get('url');
  if(urlToDelete !== null) {
    const deletedBlob: any = await del(urlToDelete);
    console.log("deletedBlob: ", deletedBlob);

    const blobUrl = deletedBlob?.url;
    console.log("blobUrl: ", blobUrl);

    if(urlToDelete === blobUrl) {
      const responseJson = {
        message: 'Success'
      };
  
      const response = new Response(JSON.stringify(responseJson), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    }
  }

  const errorResponse = {
    message: 'An error occurred on the server.',
  };
  
  const response = new Response(JSON.stringify(errorResponse), {
    status: 500,
    statusText: 'Internal Server Error',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}


/*
deletedBlob example: 
{
  url: 'https://ccd1kw3boji7y6xm.public.blob.vercel-storage.com/xzMOIrz-u1om2hF5rNuH6HDZ0fvoQK2hPz9BH5.png',
  size: 0,
  uploadedAt: 1970-01-01T00:00:00.000Z,
  pathname: 'xzMOIrz.png',
  contentDisposition: 'attachment; filename="xzMOIrz.png"',
  contentType: 'image/png'
}
*/