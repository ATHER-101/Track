import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";

interface Props {
  courseName: String;
  courseId: String;
  totalClasses: Number;
  loading: boolean;
  onDelete: () => void;
}

const CourseCard = ({
  courseName,
  courseId,
  totalClasses,
  loading,
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
            <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
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
            {String(totalClasses)} {totalClasses === 1 ? "class" : "classes"}{" "}
            till now
          </Typography>
        )}
      </Box>
      <Box>
        {loading ? (
          <>
            <Skeleton
              variant="rounded"
              width="100%"
              height={35}
              sx={{ mt: 1.5 }}
            />
          </>
        ) : (
          <Button
            variant="contained"
            href={`/dashboard/${courseId}`}
            sx={{ mt: 1, width: "100%" }}
          >
            Attendance
          </Button>
        )}
        {loading ? (
          <>
            <Skeleton
              variant="rounded"
              width="100%"
              height={35}
              sx={{ mt: 1.5 }}
            />
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={onDelete}
            sx={{ mt: 1, width: "100%" }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default CourseCard;
