import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function DateCalendarValue({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: any;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateCalendar", "DateCalendar"]}>
        <DemoItem>
          <DateCalendar
            views={["day"]}
            defaultValue={dayjs()}
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{bgcolor:"#d6dfea", borderRadius:1}}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
