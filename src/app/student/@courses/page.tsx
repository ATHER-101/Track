"use client";

import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";

import StudentCourseCard from "@/components/studentCourseCard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [rollNo, setRollNo] = useState<string | undefined>();

  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = useCallback(async () => {
    if (!!rollNo) {
      try {
        const response = await fetch(`/api/students/${rollNo}`, {
          cache: "no-store",
        });
        const res = await response.json();

        if (!!rollNo && res.error === "Student not found") {
          await fetch("/api/students", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              rollNo: rollNo,
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

              let presentCount: number = 0;
              courseData.attendance.map((element: any) => {
                const found = element.present.find(
                  (element: any) => element === rollNo
                );
                if (found !== undefined) {
                  presentCount++;
                }
              });

              return {
                courseId: course_id,
                totalAttendance: presentCount,
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
    }
  }, [rollNo]);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const rollNo = email.split("@")[0];
      setRollNo(rollNo);
    }
  }, [session]);

  useEffect(()=>{
    fetchCourses();
  },[rollNo,fetchCourses])

  return (
    <>
        <Grid container spacing={2}>
          {courses.map((course: any) => {
            return (
              <Grid key={course.courseId} item xs={6} md={2.4}>
                <Box width="100%" height="100%">
                  <StudentCourseCard
                    key={course.courseId}
                    courseId={course.courseId}
                    totalAttendance={course.totalAttendance}
                    totalClasses={course.totalClasses}
                    courseName={course.courseName}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
    </>
  );
};

export default Page;
