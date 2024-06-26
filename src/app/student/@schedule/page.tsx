"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import Calendar from "@/components/Calendar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

interface Course {
  courseName: string;
  schedule: {
    [key: string]: {
      active: string;
      time: string;
    };
  };
}

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [rollNo, setRollNo] = useState<string | undefined>();
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [schedule, setSchedule] = useState<
    { courseName: string; time: string }[]
  >([
    { courseName: "0", time: "0" },
    { courseName: "1", time: "1" },
    { courseName: "2", time: "2" },
  ]);

  const fetchCourses = useCallback(async () => {
    if (!!rollNo) {
      try {
        const response = await fetch(`/api/students/${rollNo}`);
        const res = await response.json();

        const tempCourses = await Promise.all(
          res.courses.map(async (element: string) => {
            const courseResponse = await fetch(`/api/courses/${element}`);
            const courseData = await courseResponse.json();
            return {
              schedule: courseData.schedule,
              courseName: courseData.courseName,
            };
          })
        );
        setCourses(tempCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }
  }, [rollNo]);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const rollNo = email.split("@")[0];
      setRollNo(rollNo);
      fetchCourses();
    }
  }, [session, fetchCourses]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getSchedule = useCallback(() => {
    const day: string = days[date.day()];
    if (courses) {
      const tempSchedule: { courseName: string; time: string }[] = courses
        .filter(
          (course) => course.schedule && course.schedule[day]?.active === "true"
        )
        .map((course) => ({
          courseName: course.courseName,
          time: course.schedule[day].time,
        }));
      setSchedule(tempSchedule);
      setLoading(false);
    }
  }, [courses, date]);

  useEffect(() => {
    getSchedule();
  }, [date, courses, getSchedule]);

  return (
    <Box width="100%">
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <Skeleton
            variant="rounded"
            sx={{ height: "296.5px", width: "100%" }}
          />
        ) : (
          <Calendar date={date} setDate={setDate} />
        )}
      </Paper>

      <Paper sx={{ py: 2, px: 3 }}>
        {schedule.map((element) =>
          loading ? (
            <Skeleton
              key={element.courseName}
              width="100%"
              height={13}
              sx={{ mt: 1 }}
            />
          ) : (
            <Typography variant="body1" key={element.courseName}>
              {element.courseName}: {element.time}
            </Typography>
          )
        )}
        {schedule.length === 0 && (
          <Typography variant="body1">No Classes Today!</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Page;
