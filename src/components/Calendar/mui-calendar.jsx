import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function MuiCalendar({selectedDate,handleDateChange}) {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar value={dayjs(selectedDate).$d.toString() != "Invalid Date" ? dayjs(new Date(selectedDate)) : null} onChange={handleDateChange} />
    </LocalizationProvider>
  );
}

export default MuiCalendar;
