"use client";

import { useEffect, useState } from "react";
import {
    Calendar as BigCalendar,
    momentLocalizer,
    Views
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const styles = {
    container: {
        width: "100wh",
        height: "100vh",
        margin: "ml-auto mr-auto"
    }
};

export default function ReservationCalendar({ reservations }: any) {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        setEvents(reservations.map((reservation: any) => {
            return {
                id: reservation.id,
                title: reservation.post.title,
                start: reservation.startDate,
                end: reservation.endDate,
            }
        }));
    }, []);

    const handleSelectedEvent = (event: any) => {
        console.log(event);
    };

    return (
        <div>
            <div className="flex max-w-screen-xl flex-col">
                <div className="flex flex-col">
                    <div style={styles.container}>
                        <BigCalendar
                            // components={components}
                            selectable={true}
                            onSelectEvent={handleSelectedEvent}
                            localizer={localizer}
                            events={events}
                            defaultView={Views.MONTH}
                            views={[Views.DAY, Views.WEEK, Views.MONTH]}
                            step={60}
                        />
                    </div>
                </div>
            </div>
        </div>

    );

}