import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingDetails from './listing-details';
import InfoForGuests from './info-for-guests';
import PolicySettings from './policy-settings';
import ListingImages from './listing-images';
import {
  faCalendar,
  faMoneyCheckDollar,
  faPaperclip,
  faScaleBalanced,
  faCircleInfo,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import Availability from './availability';
import Pricing from './pricing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditorTabs({ data }) {
  return (
    <div className="flex justify-center w-full">
      <Tabs defaultValue="ListingDetails" className="w-full">
        {/* Adjust TabsList class for responsiveness */}
        <TabsList className="w-full md:w-auto h-125 shadow-md md:w-full flex-wrap justify-center md:flex-nowrap">
          {/* Add responsive classes to each TabsTrigger */}
          <TabsTrigger value="ListingDetails" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faPaperclip} />
              </div>
              <div>
                Listing Details
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="Pricing" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faMoneyCheckDollar} className="mx-auto" />
              </div>
              <div>
                Pricing
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="Availability" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faCalendar} className="mx-auto" />
              </div>
              <div>
                Availability
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="PolicySettings" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faScaleBalanced} />
              </div>
              <div>
                Policies & Rules
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="InfoForGuests" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
              </div>
              <div>
                Info For Guests
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="ListingImages" className="w-full md:w-auto">
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faImage} />
              </div>
              <div>
                Image Gallery
              </div>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent className='text-gray-400 font-bold' value="ListingDetails"><ListingDetails data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="Pricing"><Pricing data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="Availability"><Availability data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="PolicySettings"><PolicySettings data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="InfoForGuests"><InfoForGuests data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="ListingImages"><ListingImages data={data} /></TabsContent>
      </Tabs>
    </div>

  );
}
