"use client";

import { useEffect, useState } from "react";
import ScheduleButton from "@/components/scheduleButton";
import Papa from "papaparse";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FileUpload from "../../../../components/FileUpload";
import { Box, Paper, Button, TextField, Skeleton, Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const [emailId, setEmailId] = useState<string>();

  const [course, setCourse] = useState<string>("");
  const [schedule, setSchedule] = useState<{
    [key: string]: { active: string; time: string };
  }>({
    Monday: { active: "false", time: "" },
    Tuesday: { active: "false", time: "" },
    Wednesday: { active: "false", time: "" },
    Thursday: { active: "false", time: "" },
    Friday: { active: "false", time: "" },
    Saturday: { active: "false", time: "" },
    Sunday: { active: "false", time: "" },
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const email = session?.user?.email;
    const emailId = email?.split("@")[0];
    setEmailId(emailId);
    setLoading(false);
  }, [session]);

  const handleCourseInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourse(event.target.value);
  };

  const handleToggle = (day: string, active: string, time: string) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: { active, time },
    }));
  };

  const router = useRouter();

  const submit = async () => {
    setSubmiting(true);
    const timePattern =
      /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*-\s*(0?[1-9]|1[0-2]):[0-5][0-9]$/;

    const invalidDays = Object.entries(schedule)
      .filter(
        ([day, { active, time }]) =>
          active === "true" && !timePattern.test(time)
      )
      .map(([day]) => day);

    if (course === "") {
      console.warn("Please give course name!");
      setSubmiting(false);
    } else if (invalidDays.length > 0) {
      console.warn(
        `Please give correct course timings for ${invalidDays.join(", ")}`
      );
      setSubmiting(false);
    } else {
      const csvFile = file;

      if (csvFile !== null) {
        Papa.parse(csvFile, {
          header: false,
          complete: async (result) => {
            const students: string[] = [];
            const data = result.data as string[][];

            data.forEach((i) => {
              students.push(i[0]);
            });

            const response = await fetch("/api/courses", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                courseName: course,
                schedule: schedule,
                students: students,
                professor: emailId,
                attendance: [],
              }),
            });

            const res = await response.json();
            console.log(res);

            res.students.map(async (rollNo: String) => {
              const studentResponse = await fetch("/api/students", {
                method: "PUT",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  rollNo: rollNo,
                  courseId: res._id,
                }),
              });

              const studentRes = await studentResponse.json();
              console.log(studentRes);
            });

            const professorResponse = await fetch("/api/professors", {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                emailId: emailId,
                courseId: res._id,
              }),
            });

            const professorRes = await professorResponse.json();
            console.log(professorRes);

            router.back();
            setSubmiting(false);
          },
        });
      } else {
        console.error("No file selected");
        setSubmiting(false);
      }
    }
  };

  return (
    <Paper sx={{ bgcolor: "white", p: 2 }}>
      <Grid item xs={12} md={8}>
        {loading || submiting ? (
          <Skeleton
            variant="rounded"
            sx={{
              width: "100%",
              height: "40px",
              mb: 2,
            }}
          />
        ) : (
          <TextField
            label="Course Name"
            variant="outlined"
            size="small"
            value={course}
            onChange={handleCourseInput}
            sx={{
              width: "100%",
              mb: 1,
            }}
          />
        )}
      </Grid>

      {Object.keys(schedule).map((day) =>
        loading ? (
          <Grid key={day} item xs={6} md={3}>
            <Skeleton
              
              variant="rounded"
              sx={{
                width: "100%",
                height: "40px",
                mb: 1,
              }}
            />
          </Grid>
        ) : (
          <ScheduleButton key={day} day={day} onToggle={handleToggle} submiting={submiting} />
        )
      )}

      {loading ? (
        <Grid item xs={6} md={3}>
          <Skeleton
            variant="rounded"
            sx={{
              width: "100%",
              height: "40px",
              mt: 2,
            }}
          />
        </Grid>
      ) : (
        <FileUpload file={file} setFile={setFile} submiting={submiting} />
      )}

      <Grid item xs={12} md={8}>
        {loading ? (
          <Skeleton
            variant="rounded"
            sx={{
              width: "100%",
              height: "40px",
              mb: 2,
              mt: 3,
            }}
          />
        ) : submiting ? (
          <LoadingButton
            loading
            loadingPosition="center"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ width: "100%", mt: 3 }}
          >
            Save
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            onClick={submit}
            sx={{ width: "100%", mt: 3 }}
          >
            Add Course
          </Button>
        )}
      </Grid>
    </Paper>
  );
};

export default Page;
