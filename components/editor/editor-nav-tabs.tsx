import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyDescription from './property-descript-tab'
import PropertyDetails from './prop-details-tab'
import PriceSpecifications from './home-price-specifications'
import ListingDetails from './listing-details'
import PricingAvailability from './pricing-availability'
import InfoForGuests from './info-for-guests'
import PolicySettings from './policy-settings'
import ListingImages from './listing-images'


export default function EditorTabs({ data }) {
  return (
    <div className="flex justify-center w-full">
      <Tabs defaultValue="ListingDetails" className="w-full">
        <TabsList className="w-full shadow-md">
          <TabsTrigger value="ListingDetails">Listing Details</TabsTrigger>
          <TabsTrigger value="PricingAvailability">Pricing & Availability</TabsTrigger>
          <TabsTrigger value="PolicySettings">Policies & Rules</TabsTrigger>
          <TabsTrigger value="InfoForGuests">Info For Guests</TabsTrigger>
          <TabsTrigger value="ListingImages">Image Gallery</TabsTrigger>
        </TabsList>
        <TabsContent className='text-gray-400 font-bold' value="ListingDetails"><ListingDetails data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="PricingAvailability"><PricingAvailability data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="PolicySettings"><PolicySettings data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="InfoForGuests"><InfoForGuests data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="ListingImages"><ListingImages data={data} /></TabsContent>

      </Tabs>
    </div>

  )
}
