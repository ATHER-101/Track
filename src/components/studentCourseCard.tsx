import Box from "@mui/material/Box";
import { Button, Paper, Typography, Skeleton } from "@mui/material";

const StudentCourseCard = ({
  courseName,
  courseId,
  totalAttendance,
  totalClasses,
  loading,
}: {
  courseName: String;
  courseId: String;
  totalAttendance: number;
  totalClasses: number;
  loading: boolean;
}) => {

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
          {loading ? (
            <>
              <Skeleton width="100%" height={20} sx={{mt:1}}/>
              <Skeleton width="60%" height={20} />
            </>
          ) : (
            <Typography variant="h6" sx={{ pt: 1, color: "#385353" }}>
              {courseName}
            </Typography>
          )}
          {loading ? (
            <>
              <Skeleton width="70%" height={10} sx={{ mt: 1.5 }} />
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#385353" }}>
              Attendance: {totalAttendance}/{totalClasses}
            </Typography>
          )}
          {loading ? (
            <>
              <Skeleton width="80%" height={10} sx={{ mt: 1 }} />
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#385353" }}>
              Percentage: {totalAttendance / 40}%
            </Typography>
          )}
        </Box>
        {loading ? (
          <>
            <Skeleton variant="rounded" width="100%" height={35} sx={{ mt: 1.5}} />
          </>
        ) : (
          <Button
            variant="contained"
            href={`/student/${courseId}/attendance`}
            sx={{ mt: 1, width: "100%" }}
          >
            Attendance
          </Button>
        )}
      </Paper>
    </>
  );
};

export default StudentCourseCard;
