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
      <Paper
        sx={{
          bgcolor: "white",
          width: "100%",
          height: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ pt: 1, color: "#385353" }}>
            {courseName}
          </Typography>
          <Typography variant="body1" sx={{ color: "#385353" }}>
            Attendance: {totalAttendance}/{totalClasses}
          </Typography>
          <Typography variant="body1" sx={{ color: "#385353" }}>
            Percentage: {totalAttendance / 40}%
          </Typography>
        </Box>
        <Button
          variant="contained"
          href={`/student/${courseId}/attendance`}
          sx={{ mt: 1, width: "100%" }}
        >
          Attendance
        </Button>
      </Paper>
    </>
  );
};

export default StudentCourseCard;
