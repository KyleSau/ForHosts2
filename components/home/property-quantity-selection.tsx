"use client";
import { Section } from "./Section";
import { useState } from "react";
import Link from "next/link";
const PropertyQuantitySelection = () => {
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  return (
    <div className="bg-gray-300">
      <Section
        title="Tell us a bit about yourself..."
        description="Please select how many properties you need listings for"
      >
        <div className="grid items-center justify-items-center gap-4 md:grid-cols-2">
          <div
            className={`flex flex-col items-center transition-all`}
            onMouseEnter={() => setIsHovered1(true)}
            onMouseLeave={() => setIsHovered1(false)}
          >
            <div className="relative  m-2 flex h-64 w-64 items-center justify-center rounded-full border-4 border-gray-600 p-16">
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <img
                  className="h-32 w-full object-contain"
                  src="/seeThroughHouse.svg"
                  alt="SVG for Card 1"
                />
                <p className="mt-2">I manage 1-10 properties</p>
              </div>
            </div>

            <button className="mt-3 rounded border border-black px-4 py-2 font-bold text-black transition delay-75 ease-in-out hover:scale-110 hover:bg-sitecolor hover:text-black ">
              <Link href="/get-started">Get Started &#8599;</Link>
            </button>
          </div>
          <div
            className={`flex flex-col items-center transition-all`}
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
          >
            <div className="relative m-2 flex h-64 w-64 items-center justify-center rounded-full border-4 border-gray-600 p-16">
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <img
                  className="h-32 w-full object-contain"
                  src="/bigHome.svg"
                  alt="SVG for Card 2"
                />
                <p className="mt-2">I manage 10+ properties</p>
              </div>
            </div>
            <button className="mt-3 rounded border border-black px-4 py-2 font-bold text-black transition delay-75 ease-in-out hover:scale-110 hover:bg-sitecolor hover:text-black ">
              <Link href="/get-started">Get Started &#8599;</Link>
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export { PropertyQuantitySelection };
