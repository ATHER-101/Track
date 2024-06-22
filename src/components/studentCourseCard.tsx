import Box from "@mui/material/Box";
import { Grid, Button, Paper, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import Link from "next/link";

const StudentCourseCard = ({
  courseName,
  courseId,
  totalAttendance,
  totalClasses,
}: {
  courseName: String;
  courseId: String;
  totalAttendance: number;
  totalClasses: number;
}) => {
  const theme = createTheme();

  return (
    <>
      <Paper sx={{ bgcolor:"#ffffff", width: "100%" }}>
        <Typography variant="h6" sx={{pt:1}}>{courseName}</Typography>
        <Typography variant="body1">
          Attendance: {totalAttendance}/{totalClasses}
        </Typography>
        <Typography variant="body2" fontSize={20}>
          {totalAttendance / 40}%
        </Typography>
        <Button
          variant="contained"
          href={`/student/${courseId}/attendance`}
          sx={{ mt: 1,mb:2, width:"85%" }}
        >Attendance</Button>
      </Paper>
    </>
  );
};

export default StudentCourseCard;
