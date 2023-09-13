"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Post } from "@prisma/client";
import PropertyDescription from "./property-descript-tab";
import PriceSpecifications from "./home-price-specifications";
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
      <div className="relative rounded-xl bg-gray-100">
        <ul
          className="relative flex list-none flex-wrap rounded-xl bg-transparent p-1"
          nav-pills
          role="tablist"
        >
          <li
            className={` flex-auto text-center ${
              activeTab === "TitleInfo"
                ? "rounded-xl bg-white text-gray-600 shadow-md  transition duration-100 ease-in-out  "
                : "w- rounded-xl bg-transparent text-slate-700  transition duration-100 ease-in-out  "
            }`}
          >
            <a
              className="ease-soft-in-out mb-0 flex w-full flex-col items-center rounded-lg border-0 bg-inherit px-0 py-1 text-slate-700 transition-all"
              href="javascript:;"
              onClick={() => handleTabClick("TitleInfo")} // Set the active tab when clicking
              aria-selected={activeTab === "TitleInfo" ? "true" : "false"}
            >
              <svg
                className="text-slate-700"
                width="16px"
                height="16px"
                viewBox="0 0 42 42"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-2319.000000, -291.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(603.000000, 0.000000)">
                        <path
                          className="fill-slate-800"
                          d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                        ></path>
                        <path
                          className="fill-slate-800"
                          d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                          opacity="0.7"
                        ></path>
                        <path
                          className="fill-slate-800"
                          d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                          opacity="0.7"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="ml-1">General Info</span>
            </a>
          </li>
          <li
            className={`z-30 flex-auto text-center  ${
              activeTab === "PropDetails"
                ? "rounded-xl bg-white text-gray-600 shadow-md transition duration-100 ease-in-out  "
                : " rounded-xl bg-transparent text-slate-700 transition duration-100 ease-in-out  "
            }`}
          >
            <a
              className="ease-soft-in-out mb-0 flex w-full flex-col items-center rounded-lg border-0 bg-inherit px-0 py-1 text-slate-700 transition-all"
              href="javascript:;"
              onClick={() => handleTabClick("PropDetails")} // Set the active tab when clicking
            >
              <svg
                className="text-slate-700"
                width="16px"
                height="16px"
                viewBox="0 0 40 44"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <title>document</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-1870.000000, -591.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(154.000000, 300.000000)">
                        <path
                          className="fill-slate-800"
                          d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z"
                          opacity="0.603585379"
                        ></path>
                        <path
                          className="fill-slate-800"
                          d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="ml-1">Home Information</span>
            </a>
          </li>
          <li className="flex-auto text-center">
            <a
              className=" ease-soft-in-out mb-0 flex w-full flex-col items-center rounded-lg border-0 bg-inherit px-0 py-1 text-slate-700 transition-all"
              nav-link
              href="javascript:;"
              role="tab"
              aria-selected="false"
            >
              <svg
                className="text-slate-700"
                width="16px"
                height="16px"
                viewBox="0 0 40 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <title>settings</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-2020.000000, -442.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(304.000000, 151.000000)">
                        <polygon
                          className="fill-slate-800"
                          opacity="0.596981957"
                          points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"
                        ></polygon>
                        <path
                          className="fill-slate-800"
                          d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z"
                          opacity="0.596981957"
                        ></path>
                        <path
                          className="fill-slate-800"
                          d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="ml-1">Listing settings</span>
            </a>
          </li>
        </ul>
      </div>
      <hr />
      {activeTab === "TitleInfo" && <PropertyDescription data={data} />}
      {activeTab === "PropDetails" && <PriceSpecifications data={data} />}
    </div>
  );
}
