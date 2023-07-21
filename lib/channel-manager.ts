// actions.ts -> getCalendarUrls

// loop through each calendar url and parse it's ical data to get startDate and endDate
// then check if the event is in the past or future
// if it's in the past, delete it
// if it's in the future, add it to the list of events to be added to the calendar

// note: on data range picker for {availability} prop, block all dates up until (now - 1 day)
// don't allow people to book a date in the past
