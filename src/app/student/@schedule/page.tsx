"use client";

import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import ScheduleCalendar from "@/components/Calendar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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

  const [rollNo, setRollNo] = useState<string | undefined>();
  const [date, setDate] = useState<Date>(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedule, setSchedule] = useState<
    { courseName: string; time: string }[]
  >([]);

  const fetchCourses = useCallback(async () => {
    try {
      if (!!rollNo) {
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
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }, []);

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
    const day: string = days[date.getDay()];
    const tempSchedule: { courseName: string; time: string }[] = courses
      .filter((course) => course.schedule[day]?.active === "true")
      .map((course) => ({
        courseName: course.courseName,
        time: course.schedule[day].time,
      }));
    setSchedule(tempSchedule);
  }, [courses, date]);

  useEffect(() => {
    getSchedule();
  }, [date, courses, getSchedule]);

  return (
    <Box width="100%">
      <Typography variant="h5" sx={{ mb: 2, color: "white" }}>
        Schedule
      </Typography>
      <ScheduleCalendar date={date} setDate={setDate} />
      <Paper sx={{ p: 1 }}>
        {schedule.map((element) => (
          <Typography variant="body1" key={element.courseName} className="px-3">
            {element.courseName}: {element.time}
          </Typography>
        ))}
        {schedule.length === 0 && "No classes today!"}
      </Paper>
    </Box>
  );
};

export default Page;
