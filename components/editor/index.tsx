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

  const [activeTab, setActiveTab] = useState("TitleInfo"); // Initialize the active tab state

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab when a button is clicked
  };

  const sliderIntervals = [
    "1 mo",
    "2 mo",
    "3 mo",
    "4 mo",
    "5 mo",
    "6 mo",
    "1 yr",
    "custom",
  ];
  const [sliderIdx, setSliderIdx] = useState(0);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`;

  const [debouncedData] = useDebounce(data, 1000);

  const prev = useRef("");

  const setAvailabilityWindowTimes = async (
    date: string,
    index: number,
    scope: boolean,
  ) => {
    let availabilityWindow = data.availabilityWindow;

    if (!availabilityWindow || availabilityWindow.length == 0) {
      availabilityWindow = ["", ""];
    } else if (availabilityWindow.length < 2) {
      availabilityWindow.push("");
    }

    if (scope) {
      //if function is called from parent component
      if (index === 0) {
        //start date
        availabilityWindow[0] = date;
      } else if (index === 1) {
        //end date
        //if called from parent AND is setting the end date, then this means host is setting a custom date
        setSliderIdx(sliderIntervals.length - 1);
        availabilityWindow[1] = date;
      }
    } else {
      //if function is called from child component via being passed as a callback
      if (index === 1) {
        availabilityWindow[1] = date;
      }
    }
    setData({ ...data, availabilityWindow });
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <EditorTabs data={data} /> 
    </div>
  );
}
