import Box from "@mui/material/Box";
import { Grid } from "@mui/material";

export default function Layout({
  children,
  courses,
  schedule,
}: {
  children: React.ReactNode;
  courses: React.ReactNode;
  schedule: React.ReactNode;
}) {

  return (
    <>
      <div>{children}</div>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={8} lg={9}>
              {courses}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              {schedule}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
