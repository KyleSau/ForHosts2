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
        <div className="grid md:grid-cols-2 gap-4 items-center justify-items-center">
          <div 
            className={`flex flex-col items-center transition-all`}
            onMouseEnter={() => setIsHovered1(true)}
            onMouseLeave={() => setIsHovered1(false)}
          >
            <div
              className="m-2  rounded-full border-4 border-gray-600 p-16 w-64 h-64 flex items-center justify-center relative"
              onClick={() => console.log("Card 1 clicked")}
            >
              <div className="text-center flex flex-col items-center justify-center relative z-10">
                <img
                  className="object-contain w-full h-32"
                  src="/seeThroughHouse.svg"
                  alt="SVG for Card 1"
                />
                <p className="mt-2">I manage 1-10 properties</p>
              </div>
            </div>
            
           

<button className="hover:text-black text-black hover:bg-sitecolor hover:scale-110 transition ease-in-out delay-75 font-bold py-2 px-4 rounded mt-3 border border-black ">
  <Link href="/get-started/explore">
    Get Started &#8599;
  </Link>
</button>

          </div>
          <div 
            className={`flex flex-col items-center transition-all`}
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
          >
            <div
              className="m-2 rounded-full border-4 border-gray-600 p-16 w-64 h-64 flex items-center justify-center relative"
          
            >
              <div className="text-center flex flex-col items-center justify-center relative z-10">
                <img
                  className="object-contain w-full h-32"
                  src="/bigHome.svg"
                  alt="SVG for Card 2"
                />
                <p className="mt-2">I manage 10+ properties</p>
              </div>
            </div>
            <button className="hover:text-black text-black hover:bg-sitecolor hover:scale-110 transition ease-in-out delay-75 font-bold py-2 px-4 rounded mt-3 border border-black ">
            <Link href="/get-started">
    Get Started &#8599;
  </Link>
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export { PropertyQuantitySelection };
