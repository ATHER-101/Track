import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";

export default function DateCalendarValue({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: any;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        views={["day"]}
        value={date}
        onChange={(newValue) => setDate(newValue)}
        sx={{
          backgroundColor:'#f5f5f5',
          borderRadius:1,
          height:"317px",
          width:"100%",
          '& .MuiStack-root': {
            paddingTop: 0,
            width: '100%',
          },
          '& .MuiPickersCalendarHeader-root': {
            paddingTop: '4px',
            marginTop: 0,
            marginBottom: 0,
            backgroundColor: '#e8edf3',
            width: '100%',
          },
          '& .MuiDayCalendar-header': {
            backgroundColor: '#d6deea',
            width: '100%',
          },
        }}
      />
    </LocalizationProvider>
  );
}