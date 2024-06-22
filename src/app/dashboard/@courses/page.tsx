"use client";

import Stack from "@mui/material/Stack";
import { createSvgIcon } from "@mui/material/utils";

import Box from "@mui/material/Box";
import { Grid, Paper, SvgIcon, Button, Typography } from "@mui/material";

import CourseCard from "@/components/courseCard";
import Image from "next/image";
import plus from "@/../public/plus.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  "Plus"
);

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const email = session?.user?.email;
  const emailId = email?.split("@")[0];
  console.log(emailId);

  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    if (emailId) {
      const response = await fetch(`/api/professors/${emailId}`, {
        cache: "no-store",
      });
      const res = await response.json();

      console.log(res);
      console.log(res.courses);

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
        let tempCourses: any[] = [];
        res.courses.forEach(async (course_id: string) => {
          const response = await fetch(`/api/courses/${course_id}`, {
            cache: "no-store",
          });
          const res = await response.json();

          console.log(res);

          tempCourses.push({
            courseId: course_id,
            totalClasses: res.attendance.length,
            courseName: res.courseName,
          });
        });
        setCourses(tempCourses);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [emailId]);

  return (
    <>
      <Paper
        style={{
          padding: "16px",
          textAlign: "center",
          backgroundColor: "#29b6f6",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Courses
        </Typography>
        <Grid container spacing={2}>
          {courses.map((course: any) => {
            return (
              <Grid key={course.course_id} item xs={6} md={2.5}>
                <Box width="100%">
                  <CourseCard
                    key={course.courseId}
                    courseId={course.courseId}
                    totalClasses={course.totalClasses}
                    courseName={course.courseName}
                  />
                </Box>
              </Grid>
            );
          })}
          <Grid item xs={6} md={2.5}>
            <Paper
              sx={{
                bgcolor: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                href="/dashboard/add-course"
                sx={{ border: 1, height: "80%", width: "80%" }}
              >
                <SvgIcon
                  component={PlusIcon}
                  style={{ width: 100, height: 100 }}
                />
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Page;
