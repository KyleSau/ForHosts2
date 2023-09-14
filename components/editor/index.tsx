"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Post } from "@prisma/client";
import PropertyDescription from "./property-descript-tab";
import PriceSpecifications from "./home-price-specifications";
import EditorTabs from "./editor-nav-tabs";
type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({ post }: { post: PostWithSite }) {
  const [data, setData] = useState<PostWithSite>(post);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <EditorTabs data={data} />
    </div>
  );
}
