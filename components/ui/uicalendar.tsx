"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <div className="m-auto">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="m-auto"
                numberOfMonths={2}
            />
        </div>
    )
}
