import { Box, Button, Paper, Typography } from "@mui/material";

interface Props {
  courseName: String;
  courseId: String;
  totalClasses: Number;
  onDelete: () => void;
}

const CourseCard = ({
  courseName,
  courseId,
  totalClasses,
  onDelete,
}: Props) => {
  return (
    <Paper
      sx={{
        bgcolor: "white",
        width: "100%",
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p:2
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
          {String(totalClasses)} {totalClasses === 1 ? "class" : "classes"} till
          now
        </Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          href={`/dashboard/${courseId}`}
          sx={{ mt: 1, width: "100%" }}
        >
          Attendance
        </Button>
        <Button
          variant="outlined"
          onClick={onDelete}
          sx={{ mt: 1, width: "100%" }}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseCard;
