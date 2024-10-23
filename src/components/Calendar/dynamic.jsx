import React, { useState } from 'react';
import './calendarStyle.css';
import CalendarPicker from '../calendarpicker/CalendarPicker';

function DynimicCalendar() {
  const [firstSelectedDate, setFirstSelectedDate] = useState(
    new Date().toString()
  );
  const [lastSelectedDate, setLastSelectedDate] = useState(
    new Date().toString()
  );

  console.log(firstSelectedDate)
  console.log(lastSelectedDate)

  let minDt = new Date();
  minDt.setFullYear(minDt.getFullYear() - 1);
  let maxDt = new Date();
  maxDt.setFullYear(maxDt.getFullYear() + 1);

  return (
    <React.Fragment>
      <CalendarPicker
        setFirstSelectedDate={setFirstSelectedDate}
        setLastSelectedDate={setLastSelectedDate}
        calendarData={[
          {
            availability: "",
            date: "01/09/2022",
            index: ["Unavailable"]
          }
        ]}
        minDt={minDt}
        maxDt={maxDt}
        indices={[
          {
            color: "red",
            legend: "Unavailable"
          },
          {
            color: "green",
            legend: "Available"
          },
          {
            color: "yellow",
            legend: "Limited"
          },
          {
            color: "grey",
            legend: "Past Dates"
          }
        ]}
        showBlackoutLegend={true}
      />
    </React.Fragment>
  );
}

export default DynimicCalendar;
