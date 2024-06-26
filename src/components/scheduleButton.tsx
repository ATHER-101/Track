import { ChangeEvent, useState } from "react";
import { TextField, Button, Box, Grid, Skeleton } from "@mui/material";

const ScheduleButton = ({
  day,
  onToggle,
  submiting,
}: {
  day: string;
  onToggle: (day: string, active: string, time: string) => void;
  submiting: boolean;
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
    <Grid container spacing={1}>
      <Grid item xs={6} md={3}>
        {submiting ? (
          <Skeleton
            variant="rounded"
            sx={{ height: "40px", width: "100%", mt: 1 }}
          />
        ) : (
          <Button
            variant={active === "true" ? "contained" : "outlined"}
            sx={{
              height: "40px",
              width: "100%",
              mt: 1,
            }}
          >
            <label htmlFor={day}>{day}</label>
          </Button>
        )}

        <input
          id={day}
          className="hidden"
          type="checkbox"
          checked={active === "true" ? true : false}
          onChange={handleToggle}
        />
      </Grid>

      <Grid item xs={6} md={5}>
        {submiting && active==="true" ? (
          <Skeleton
            variant="rounded"
            sx={{ height: "40px", width: "100%", mt: 1 }}
          />
        ) : (
          <TextField
            label="Timing"
            id="outlined-size-small"
            placeholder="8:30-9:30"
            value={time}
            onChange={handleTimeChange}
            size="small"
            sx={{ width: "100%", mt: 1 }}
            className={active === "true" ? "visible" : "hidden"}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ScheduleButton;
