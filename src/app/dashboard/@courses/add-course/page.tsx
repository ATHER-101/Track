"use client";

import { useEffect, useState } from "react";
import ScheduleButton from "@/components/scheduleButton";
import Papa from "papaparse";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FileUpload from "../../../../components/FileUpload";
import { Box, Typography, Paper, Button, Grid, TextField } from "@mui/material";

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

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
    } else if (invalidDays.length > 0) {
      console.warn(
        `Please give correct course timings for ${invalidDays.join(", ")}`
      );
    } else {
      const csvFile = file;

      if (csvFile !== null) {
        Papa.parse(csvFile, {
          header: false,
          complete: async (result) => {
            const students: string[] = [];
            const data = result.data as string[][]; // Explicitly typing the result data

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
          },
        });
      } else {
        console.error("No file selected");
      }
    }
  };

  return (
    <Paper sx={{ bgcolor: "white", p: 2 }}>
      <Box>
        <Typography variant="h6" paddingBottom={2}>
          Add Course
        </Typography>

        <TextField
          label="Course Name"
          variant="outlined"
          size="small"
          value={course}
          onChange={handleCourseInput}
          sx={{
            width: { xs: "100%", md: "76.5%" },
            mb: 1,
            mr: { md: "23.5%" },
          }}
        />

        {Object.keys(schedule).map((day) => (
          <ScheduleButton key={day} day={day} onToggle={handleToggle} />
        ))}

        <FileUpload file={file} setFile={setFile} />

        <Button
          variant="contained"
          onClick={submit}
          sx={{ width: { xs: "100%", md: "76.5%" }, mt: 3 }}
        >
          Add Course
        </Button>
      </Box>
    </Paper>
  );
};

export default Page;
