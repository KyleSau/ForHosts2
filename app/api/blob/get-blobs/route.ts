import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};
 
export async function GET(request: Request) {
  const { blobs } = await list();
  // console.log("type of blobs: ", typeof(blobs));
  return NextResponse.json(blobs);
}
