"use client";

import Box from "@mui/material/Box";
import { Paper, Skeleton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import Calendar from "@/components/Calendar";

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

  const [loading, setLoading] = useState<boolean>(true);
  const [emailId, setEmailId] = useState<string | undefined>();
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
    if (!!emailId) {
      try {
        const response = await fetch(`/api/professors/${emailId}`);
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
  }, [emailId]);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const emailId = email.split("@")[0];
      setEmailId(emailId);
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
            <Typography
              variant="body1"
              key={element.courseName}
              className="px-3"
            >
              {element.courseName}: {element.time}
            </Typography>
          )
        )}
        {schedule.length === 0 && (
          <Typography variant="body1">No classes Today!</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Page;
