import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyDescription from './property-descript-tab'
import PropertyDetails from './prop-details-tab'
import PriceSpecifications from './home-price-specifications'


export default function EditorTabs({ data }) {
  return (
    <div className="flex justify-center w-full">
      <Tabs defaultValue="propDesc" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="propDesc">Property Description</TabsTrigger>
          <TabsTrigger value="price">Pricing Information</TabsTrigger>
          <TabsTrigger value="time">Time Settings</TabsTrigger>
          <TabsTrigger value="guestSettings">Guest Settings </TabsTrigger>
          <TabsTrigger value="photo">Photo Settings</TabsTrigger>

        </TabsList>

        <TabsContent className='text-gray-400 font-bold' value="propDesc"><PropertyDescription data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="price"><PriceSpecifications data={data} /></TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="time">Set various information regarding times for your listing</TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="guestSettings">Set various settings regarding the guest</TabsContent>
        <TabsContent className='text-gray-400 font-bold' value="photo">Set various settings regarding photos</TabsContent>

      </Tabs>
    </div>

  )
}
