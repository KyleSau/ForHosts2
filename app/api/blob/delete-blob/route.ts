import { del } from '@vercel/blob';
 
export const runtime = 'edge';
 
export async function DELETE(request: Request) {
  console.log("request: ", request);
  const { searchParams } = new URL(request.url);
  console.log("searchParams: ", searchParams);
  const urlToDelete: string | null = searchParams.get('url');
  if(urlToDelete !== null) {
    const deletedBlob = await del(urlToDelete);
    console.log("deletedBlob: ", deletedBlob);

    return new Response();
  }

  // return new Response();
}
