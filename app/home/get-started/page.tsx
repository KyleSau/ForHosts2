import HomeLayout from "@/components/home/home-layout";
import { Section } from "@/components/home/Section";
import Image from "next/image";
import React from "react";
import Link from "next/link";
const GetStartedPage: React.FC = () => {
  return (
    <HomeLayout>
      <Section
        title="How many properties do you plan on listing?"
        description="Choose the option that best describes your business"
      >
        <div className="flex flex-col justify-between space-y-10 pt-20 md:flex-row md:space-x-10 md:space-y-0">
          <div className="flex flex-col space-y-16">
            <Link href="/get-started/explore" legacyBehavior>
              <a className="flex items-center space-x-4 rounded border border-black px-4 py-3 font-bold text-black hover:bg-sitecolor">
                <div>
                  <Image
                    src="/apartmentNarrow.svg"
                    width={52}
                    height={20}
                    alt="Image 1"
                  />
                </div>
                <div className="flex flex-grow items-center">
                  I manage 1 to 10 properties
                </div>
              </a>
            </Link>

            <Link href="/get-started/multi-explore" legacyBehavior>
              <a className="flex items-center space-x-4 rounded border border-black px-4 py-3 font-bold text-black hover:bg-sitecolor">
                <div>
                  <Image
                    src="/apartmentWide.svg"
                    width={52}
                    height={20}
                    alt="Image 1"
                  />
                </div>
                <div className="flex flex-grow items-center">
                  I manage 10 or more properties
                </div>
              </a>
            </Link>
          </div>
          <div className="mt-10 flex justify-center md:mt-0 md:justify-start">
            <Image
              src="/rentalApartment.svg"
              width={250}
              height={100}
              alt="Image 2"
            />
          </div>
        </div>
      </Section>
    </HomeLayout>
  );
};

export default GetStartedPage;
