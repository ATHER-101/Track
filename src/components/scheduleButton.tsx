import { ChangeEvent, useState } from "react";
import { TextField, Button, Box, Grid } from "@mui/material";

const ScheduleButton = ({
  day,
  onToggle,
}: {
  day: string;
  onToggle: (day: string, active: string, time: string) => void;
}) => {
  const [active, setActive] = useState<string>("false");
  const [time, setTime] = useState<string>("");

  const handleToggle = () => {
    setActive(active === "true" ? "false" : "true");
    setTime("");
    onToggle(day, active === "true" ? "false" : "true", "");
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
    onToggle(day, active, event.target.value);
  };

  return (
    <Box>
          <Button
            variant={active === "true" ? "contained" : "outlined"}
            sx={{height:"40px", width:{xs: "45%", md:"20%"}, mt:1, mr:{xs:"3%",md:"1.5%"} }}
          >
            <label htmlFor={day}>{day}</label>
          </Button>

          <input
            id={day}
            className="hidden"
            type="checkbox"
            checked={active === "true" ? true : false}
            onChange={handleToggle}
          />
          <TextField
            label="Timing"
            id="outlined-size-small"
            placeholder="8:30-9:30"
            value={time}
            onChange={handleTimeChange}
            size="small"
            sx={{width:{xs:"52%",md:"55%"}, mt:1, mr:{md:"23.5%"}}}
            className={active === "true" ? "visible" : "hidden"}
          />
    </Box>
  );
};

export default ScheduleButton;
