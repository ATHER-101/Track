"use client";

import { createSvgIcon } from "@mui/material/utils";
import Box from "@mui/material/Box";
import { Grid, Paper, SvgIcon, Button, Typography } from "@mui/material";
import CourseCard from "@/components/courseCard";
import { useEffect, useState, useCallback } from "react";
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

  const [emailId, setEmailId] = useState<string | undefined>();
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = useCallback(async (emailId: string) => {
    try {
      const response = await fetch(`/api/professors/${emailId}`, {
        cache: "no-store",
      });
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
          res.courses.map(async (course_id: string) => {
            const courseResponse = await fetch(`/api/courses/${course_id}`, {
              cache: "no-store",
            });
            const courseData = await courseResponse.json();
            return {
              courseId: course_id,
              totalClasses: courseData.attendance.length,
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

  //Delete course
  const deleteCourse = async (course_id: String) => {
    
    setCourses(courses.filter((course) => course.courseId !== course_id));

    const deletedCourse = await fetch("/api/courses", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        courseId: course_id,
      }),
    });

    const deleteRes = await deletedCourse.json();
    console.log(deleteRes);

    deleteRes.students.map(async (rollNo: String) => {
      await fetch("/api/students", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          rollNo: rollNo,
          courseId: course_id,
        }),
      });
    });

    await fetch("/api/professors", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        emailId: deleteRes.professor,
        courseId: course_id,
      }),
    });
  };

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
          {courses.map((course) => (
            <Grid key={course.courseId} item xs={6} md={2.5}>
              <Box width="100%">
                <CourseCard
                  key={course.courseId}
                  courseId={course.courseId}
                  totalClasses={course.totalClasses}
                  courseName={course.courseName}
                  onDelete={() => deleteCourse(course.courseId)}
                />
              </Box>
            </Grid>
          ))}
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
