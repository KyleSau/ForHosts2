"use client"
import {
    Calendar as BigCalendar,
    momentLocalizer,
    Views
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { getReservationFields, getReservations } from "@/lib/actions";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

enum EventTypes {
    PREVIOUS = "previous",
    ACTIVE = "active", // ongoing and future
    BLOCKED = "blocked"
}

// abstract this with interface
const getEventStatus = (start: Date, end: Date, blocked: boolean): string => {
    const now = moment();
    const endDate = moment(end);

    if (blocked) {
        return EventTypes.BLOCKED;
    }

    if (now.isAfter(endDate)) {
        return EventTypes.PREVIOUS;
    } else {
        return EventTypes.ACTIVE;
    }
}

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    blocked: boolean;
}

const styles = {
    container: {
        width: "100wh",
        height: "100vh",
        margin: "ml-auto mr-auto"
    }
};

const components = {
    event: (props: any) => {
        const { event } = props;
        switch (getEventStatus(event.start, event.end, event.blocked)) {
            case "previous":
                return <div style={{ background: "gray" }}>{event.title}</div>;
            case "active":
                return <div style={{ background: "green" }}>{event.title}</div>;
            case "blocked":
                return <div style={{ background: "red" }}>{event.title}</div>;
            default:
                return null;
        }
    }
}

interface Reservation {
    [key: string]: any;
}

export default function CustomCalendar() {

    const [events, setEvents] = useState<Event[]>([]);
    const [reservations, setReservations] = useState<any>([]);

    useEffect(() => {
        async function handleGetReservationFields() {
            const resFields = await getReservationFields();
        }
        handleGetReservationFields();
    }, []);

    // do a join in actions.ts to get title in reservation result set.
    useEffect(() => {
        async function handleGetReservations(): Promise<void> {
            const reservations = await getReservations();
            setReservations(reservations);
            const events: Event[] = [];
            if (Array.isArray(reservations)) {
                let idx = 0;
                for (const reservation of reservations) {
                    Object.entries(reservation).forEach(([key, value]) => {
                        console.log(`${key}: ${value}`);
                    });
                    events.push({
                        id: idx++,
                        title: reservation.post?.title ?? 'No title',
                        start: new Date(reservation.startDate),
                        end: new Date(reservation.endDate),
                        blocked: false
                    }); // clk8uat0l0002jt08satnq0dd 
                }
                setEvents(events);
            } else {
                console.log(reservations.error);
            }
        }

        handleGetReservations();
    }, []);

    return (
        <div className="flex max-w-screen-xl flex-col">
            <div className="flex flex-col">
                <div style={styles.container}>
                    <BigCalendar
                        components={components}
                        selectable
                        localizer={localizer}
                        events={events}
                        defaultView={Views.MONTH}
                        views={[Views.DAY, Views.WEEK, Views.MONTH]}
                        step={60}
                    />
                </div>
            </div>
        </div>

    );
}
