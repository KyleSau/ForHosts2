"use client";

import { useEffect, useRef, useState } from "react";

export default function DateSlider() {
  

  
  return (<>
    <input type="range" min={0} max="100" defaultValue={(5/8)*100} className="range w-96" step="25" />
    <div className="w-96 flex justify-between text-xs px-2">
      <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
    </div>
    <div className="w-96 flex justify-between text-xs px-2 my-8">
      <span>1 mo</span><span>2 mo</span><span>3 mo</span><span>4 mo</span><span>5 mo</span><span>6 mo</span><span>1 yr</span><span>custom</span>
    </div>
  </>);
};