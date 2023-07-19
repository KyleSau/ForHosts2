"use client"
import {
    Calendar as BigCalendar,
    momentLocalizer,
    Views
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { title } from "process";
import { color } from "framer-motion";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const events = [
    {
        id: 1,
        title: "booked",
        start: new Date(2023, 6, 8, 8, 30, 0),
        end: new Date(2023, 6, 23, 12, 30, 0),
        resourceId: 3
    },
    {
        id: 2,
        title: "booked2",
        allDay: true,
        start: new Date(2023, 6, 8, 8, 30, 0),
        end: new Date(2023, 6, 16, 12, 30, 0),
        resourceId: 2
    },
    {
        id: 3,
        title: "booked3",
        start: new Date(2023, 6, 8, 8, 30, 0),
        end: new Date(2023, 6, 11, 12, 30, 0),
        resourceId: 3
    },
];

const resourceMap = [
    { resourceId: 1, resourceTitle: "Rental 1" },
    { resourceId: 2, resourceTitle: "Rental 2" },
    { resourceId: 3, resourceTitle: "Rental 3" },
    { resourceId: 4, resourceTitle: "Rental 4" }
];

const styles = {
    container: {
        width: "100wh",
        height: "100vh",
        margin: "ml-auto mr-auto"
    }
};

export default function CustomCalendar() {
    return (
        <div className="flex max-w-screen-xl flex-col">
            <div className="flex flex-col">
                <div style={styles.container}>
                    <BigCalendar
                        selectable
                        localizer={localizer}
                        events={events}
                        defaultView={Views.MONTH}
                        views={[Views.DAY, Views.WEEK, Views.MONTH]}
                        step={60}
                        resources={resourceMap}
                        resourceIdAccessor="resourceId"
                        resourceTitleAccessor="resourceTitle"
                    />
                </div>
            </div>
        </div>

    );
}
