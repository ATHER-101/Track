"use client";

import Box from "@mui/material/Box";
import { Grid, Paper, Typography } from "@mui/material";
import ScheduleCalendar from "@/components/Calendar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [emailId, setEmailId] = useState<string | undefined>();
  const [date, setDate] = useState<Date>(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedule, setSchedule] = useState<{ courseName: string; time: string }[]>([]);

  const fetchCourses = useCallback(async (emailId: string) => {
    try {
      const response = await fetch(`/api/professors/${emailId}`);
      const res = await response.json();

      if (res.error === "Professor not found") {
        await fetch("/api/professors", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            emailId: emailId,
            courses: [],
          }),
        });
      } else {
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
      const emailId = email.split("@")[0];
      setEmailId(emailId);
      fetchCourses(emailId);
    }
  }, [session, fetchCourses]);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getSchedule = useCallback(() => {
    const day: string = days[date.getDay()];
    const tempSchedule: { courseName: string; time: string }[] = courses
      .filter(course => course.schedule[day]?.active === "true")
      .map(course => ({
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
        {schedule.map(element => (
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
