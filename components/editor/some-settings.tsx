import React from 'react'

export default function SomeSettings() {
  return (
    <form>
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900 mt-10">Home Information</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Vital information regarding your property.</p>
  
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
                          <div className="col-span-full">
                              
            <label className="block text-sm font-medium leading-6 text-gray-900">Price per night of listing</label>
            <div className="mt-2">
              <input type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                              </div>
                              
          </div>
  
          <div className="sm:col-span-2 sm:col-start-1">
            <label  className="block text-sm font-medium leading-6 text-gray-900 mt-8">Max guests allowed</label>
            <div className="mt-2">
              <input type="text" name="maxGuests" id="maxGuests"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
  
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium leading-6 text-gray-900 mt-8">Minimum stay required (in days)</label>
            <div className="mt-2">
              <input type="text" name="minDays" id="minDays"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
  
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium leading-6 text-gray-900 mt-8">Number of rooms in listing</label>
            <div className="mt-2">
              <input type="text" name="numRooms" id="numRooms" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium leading-6 text-gray-900 mt-8">Cleaning Fee</label>
            <div className="mt-2">
              <input type="text" name="cleaningFee" id="cleaningFee" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
                          </div>
                          <div className="sm:col-span-2">
            <label className="block text-sm font-medium leading-6 text-gray-900 mt-8">Security Deposit required by client</label>
            <div className="mt-2">
              <input type="text" name="numRooms" id="numRooms" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
          </div>
  
          <div className="col-span-full">
            
            <div className="mt-2 fond-bold ">
              <div>put amenities modal button/icon here</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">Open up the amenities icon above to select all the amenities your property includes.</p>
          </div>
  

  
          <div className="col-span-full">
            <label  className="block text-sm font-medium leading-6 text-gray-900">Property listing photos</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
                          </div>
                          
          </div>
        </div>
      </div>
  
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Property Listing Information</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">This information will only be revealed in full after the property is.</p>
  
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
         
  
 
  
          <div className="sm:col-span-3">
            <label  className="block text-sm font-medium leading-6 text-gray-900">Country</label>
            <div className="mt-2">
              <select id="country" name="country" autocomplete="country-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>
  
          <div className="col-span-full">
            <label for="street-address" className="block text-sm font-medium leading-6 text-gray-900">Street address</label>
            <div className="mt-2">
              <input type="text" name="street-address" id="street-address" autocomplete="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
  
          <div className="sm:col-span-2 sm:col-start-1">
            <label for="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
            <div className="mt-2">
              <input type="text" name="city" id="city" autocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
  
          <div className="sm:col-span-2">
            <label for="region" className="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
            <div className="mt-2">
              <input type="text" name="region" id="region" autocomplete="address-level1" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
  
          <div className="sm:col-span-2">
            <label for="postal-code" className="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
            <div className="mt-2">
              <input type="text" name="postal-code" id="postal-code" autocomplete="postal-code" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
        </div>
      </div>
  
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>
  
        <div className="mt-10 space-y-10">
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
            <div className="mt-6 space-y-6">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                </div>
                <div className="text-sm leading-6">
                  <label for="comments" className="font-medium text-gray-900">Comments</label>
                  <p className="text-gray-500">Get notified when someones posts a comment on this listing.</p>
                </div>
              </div>
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input id="candidates" name="candidates" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                </div>
                <div className="text-sm leading-6">
                  <label for="candidates" className="font-medium text-gray-900">Upcoming clients</label>
                  <p className="text-gray-500">Get notified daily of upcoming clients about to stay at the property.</p>
                </div>
              </div>
   
               
              
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-x-3">
                <input id="push-everything" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <label for="push-everything" className="block text-sm font-medium leading-6 text-gray-900">Everything</label>
              </div>
              <div className="flex items-center gap-x-3">
                <input id="push-email" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <label for="push-email" className="block text-sm font-medium leading-6 text-gray-900">Same as email</label>
              </div>
              <div className="flex items-center gap-x-3">
                <input id="push-nothing" name="push-notifications" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <label for="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">No push notifications</label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  
    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Previous</button>
      <button type="submit" className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
    </div>
  </form>
  )
}
