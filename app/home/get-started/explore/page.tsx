import { Section } from '@/components/home/Section'
import HomeLayout from '@/components/home/home-layout'
import React from 'react'
import Image from 'next/image'
export default function page() {
    return (
     <HomeLayout>
      <Section title='Explore Forhosts'  description='Discover how you can use us to scale your business'>
      <div className="flex flex-col md:flex-row justify-between pt-32 md:space-x-10 space-y-10 md:space-y-0">
            <div className="flex flex-col space-y-16">
            <button className="flex space-x-4 items-center border border-black bg-gray-300 hover:bg-sitecolor text-black font-bold py-3 px-4 rounded">
                <div>
                  <Image src='/checkPackageExplore.svg' width={52} height={20} alt='Image 1' />
                </div>
                <div className="flex-grow flex flex-col items-center md:items-start">
                 <div>Check out our packages</div>
                 <div className="text-sm text-gray-500">Check out our pricing points for various feature packages</div>
                </div>
              </button>
              <button className="flex space-x-4 items-center border border-black bg-gray-300 hover:bg-sitecolor text-black font-bold py-3 px-4 rounded">
              <div>
                  <Image src='/phoneCallExplore.svg' width={52} height={20} alt='Image 2' />
                </div>
                <div className="flex-grow flex flex-col items-center md:items-start">
                <div>Book a demo call</div>
                <div className="text-sm text-gray-500">Let our experts explain all the features we provide</div>
                </div>
              </button>
            </div>
            <div className="mt-10 md:mt-0 flex justify-center md:justify-start">
            <Image src='/getStartedExplore.svg' width={280} height={100} alt='Image 2' />
            </div>
          </div>
      </Section>
      </HomeLayout>  )
  }
  
