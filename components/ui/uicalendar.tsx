"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <div className="bg-white col-start-1 md:col-start-3 md:col-span-3 m-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="w-full mx-auto flex justify-center">
                <div className="m-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="m-auto w-full"
                        numberOfMonths={2}
                    />
                </div>
            </div>
        </div>
    )
}
