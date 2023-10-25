import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  console.log("----- entered middleware -----");
  const url = req.nextUrl;
  // console.log("Original URL:", url);
  console.log("NEXT_PUBLIC_ROOT_DOMAIN: ", process.env.NEXT_PUBLIC_ROOT_DOMAIN);

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  console.log("hostname: ", hostname);
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  console.log("path: ", path);

  // rewrites for app pages
  if (hostname == `dashboard.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await getToken({ req });
    if (!session && path !== "/login") {
      const redirect1 = NextResponse.redirect(new URL("/login", req.url));
      console.log("AAA redirect: ", redirect1);
      return redirect1;
    } else if (session && path == "/login") {
      const redirect2 = NextResponse.redirect(new URL("/", req.url));
      console.log("BBB redirect2: ", redirect2);
      return redirect2;
    }

    console.log('CCC');
    const temp = new URL(`/app${path === "/" ? "" : path}${url.search}`, req.url);
    console.log("new URL to rewrite (Dashboard): ", temp.href);
    return NextResponse.rewrite(temp);
  }

  if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log('path (Admin): ', path);
    const session = await getToken({ req });
    if (!session && path !== "/login") {
      const redirect3 = NextResponse.redirect(new URL("/app", req.url));
      console.log("DDD redirect3: ", redirect3);
      return redirect3;
    } else if (session && path == "/login") {
      const redirect4 = NextResponse.redirect(new URL("/", req.url));
      console.log("EEE redirect4: ", redirect4);
      return redirect4;
    }

    console.log("FFF");
    const temp = new URL(`/app/admin${path === "/" ? "" : path}${url.search}`, req.url);
    console.log("new URL to rewrite (Admin): ", temp.href);
    return NextResponse.rewrite(temp);
  }


  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/home${path}${url.search}`, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}${url.search}`, req.url));
}