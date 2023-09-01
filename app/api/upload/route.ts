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
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }


  if (!Array.isArray(req.body)) {
    // NOTE: use old method then do single upload instead of throwing 400
    return new Response("Expected an array of files.", {
      status: 400,
    });
  }

  const responses = [];

  for (const file of req.body) {
    const contentType = file.type || "text/plain";
    const filename = `${nanoid()}.${contentType.split("/")[1]}`;
    console.log('filename: ' + filename);
    const blob = await put(filename, file, {
      contentType,
      access: "public",
    });

    responses.push(blob);
  }

  return NextResponse.json(responses);
}
