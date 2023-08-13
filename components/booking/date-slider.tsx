"use client";
import { Info } from 'lucide-react';
import { Tooltip } from "@mui/material";
import { calcRelativeDate } from "@/lib/utils";

export default function DateSlider({availabilityWindow, setAvailabilityWindowTimes, sliderIntervals, sliderIdx, setSliderIdx}: 
  {availabilityWindow: any, setAvailabilityWindowTimes: Function, sliderIntervals: string[], sliderIdx: number, setSliderIdx: Function}) 
{
  const calculateOutOfServiceDate = (sliderEvent: React.ChangeEvent<HTMLInputElement>) => {
    const sliderIdxFromEvent = parseInt(sliderEvent.target.value);
    const query = sliderIntervals[sliderIdxFromEvent];
    const [inServiceDate, _] = availabilityWindow;

    const newOutOfServiceDate = calcRelativeDate(new Date(inServiceDate), query).toISOString()?.split("T")[0];
    setSliderIdx(sliderIdxFromEvent);
    setAvailabilityWindowTimes(newOutOfServiceDate, 1, false);
  };

  return (<>
    <div className="flex">
      <input type="range" min={0} max={sliderIntervals.length-1} value={sliderIdx} step="1" 
        className="range w-[373px] ml-[6px]" 
        onChange={(sliderEvent) => calculateOutOfServiceDate(sliderEvent)}
        disabled={availabilityWindow[0] === undefined || availabilityWindow[0] === ""}
        />
      <Tooltip title="Time from the In-Service Date until your listing becomes inactive.">
        <Info className="ml-2 opacity-90 stroke-[1px]"/> 
      </Tooltip>
    </div>
    
    <div className="flex justify-between text-xs w-[390px] px-0 -mt-2 mb-2">
    {
      sliderIntervals.map((element:string, idx:number) => (
        <div key={idx} className="justify-center">
          <div className="text-center">|</div>
          <div className="text-center">{element}</div>
        </div>
      ))
    }
    </div>
  </>);
};