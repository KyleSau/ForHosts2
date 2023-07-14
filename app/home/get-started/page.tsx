import HomeLayout from '@/components/home/HomeLayout'
import { Section } from '@/components/home/Section'
import Image from 'next/image'
import React from 'react'

const GetStartedPage: React.FC = () => {
  return (
    <HomeLayout>
      <Section title='How many properties do you plan on listing?' description='Choose the option that best describes your business'>
        <div className="flex justify-between pt-20">
          <div className="flex flex-col space-y-16">
            <button className="flex space-x-4 items-center border border-black hover:bg-sitecolor text-black font-bold py-3 px-4 rounded">
              <div>
                <Image src='/apartmentNarrow.svg' width={52} height={20} alt='Image 1' />
              </div>
              <div className="flex-grow flex items-center">
               I manage 1 to 10 properties
              </div>
            </button>
            <button className="flex space-x-4 items-center border border-black hover:bg-sitecolor text-black font-bold py-3 px-4 rounded">
            <div>
                <Image src='/apartmentWide.svg' width={52} height={20} alt='Image 2' />
              </div>
              <div className="flex-grow flex items-center">
              I manage 10 or more properties
              </div>
            </button>
          </div>
          <div>
          <Image src='/rentalApartment.svg' width={250} height={80} alt='Image 2' />
          </div>
        </div>
      </Section>
    </HomeLayout>
  )
}

export default GetStartedPage;
