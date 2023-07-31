"use client";

import { Info } from 'lucide-react';
import { Tooltip } from "@mui/material";
import { calcRelativeDate } from "@/lib/utils";

export default function DateSlider({availabilityWindow, setAvailabilityWindowTimes}: 
  {availabilityWindow: any, setAvailabilityWindowTimes: Function}) 
{
  const defaultIntervals = ["1 mo", "2 mo", "3 mo", "4 mo", "5 mo", "6 mo", "1 yr", "custom"];

  const calculateOutOfServiceDate = (sliderEvent: React.ChangeEvent<HTMLInputElement>) => {
    const sliderIdx = parseInt(sliderEvent.target.value);
    const query = defaultIntervals[sliderIdx];
    console.log("calculateOutOfServiceDate: query", query);
    
    // if(query === "custom") {
    //   let outOfServiceDateFromInput = undefined;
    //   if (availabilityWindow && availabilityWindow !== undefined && availabilityWindow.length === 2) {
    //     outOfServiceDateFromInput = availabilityWindow[1];
    //   }
    // }

    const [inServiceDate, outOfServiceDate] = availabilityWindow;
    console.log("inServiceDate: ", inServiceDate);
    console.log("outOfServiceDate: ", outOfServiceDate);

    const newOutOfServiceDate = calcRelativeDate(new Date(inServiceDate), query).toISOString().split("T")[0];
    console.log("newOutOfServiceDate: ", newOutOfServiceDate);
    setAvailabilityWindowTimes(newOutOfServiceDate, 1);
  };

  return (<>
    <div className="flex">
      <input type="range" min={0} max={defaultIntervals.length-1} defaultValue={0} step="1" 
        className="range w-[373px] ml-[6px]" 
        onChange={(sliderEvent) => calculateOutOfServiceDate(sliderEvent)}/>
      <Tooltip title="Time from the In-Service Date until your listing becomes inactive.">
        <Info className="ml-2 opacity-90 stroke-[1px]"/> 
      </Tooltip>
    </div>
    
    <div className="flex justify-between text-xs w-[390px] px-0 -mt-2 mb-2">
      {
        defaultIntervals.map((element:string, idx:number) => (
          <div key={idx} className="justify-center">
            <div className="text-center">|</div>
            <div className="text-center">{element}</div>
          </div>
        ))
      }
      </div>
  </>);
};