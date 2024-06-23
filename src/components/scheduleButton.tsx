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
    <>
      <Grid container spacing={2} sx={{ my: "1px" }}>
        <Grid item md={3} lg={2}>
          <Button
            variant={active === "true" ? "contained" : "outlined"}
            sx={{ width: "100%" }}
          >
            <label htmlFor={day}>{day}</label>
          </Button>
        </Grid>
        <input
          id={day}
          className="hidden"
          type="checkbox"
          checked={active === "true" ? true : false}
          onChange={handleToggle}
        />

        <Grid
          item
          md={6}
          lg={6}
          className={active === "true" ? "inline-block" : "hidden"}
        >
          <TextField
            label="Timing"
            id="outlined-size-small"
            placeholder="8:30-9:30"
            value={time}
            onChange={handleTimeChange}
            size="small"
            fullWidth
          />
          {/* </div> */}
        </Grid>
      </Grid>
    </>
  );
};

export default ScheduleButton;
