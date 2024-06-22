"use client";

import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";

import StudentCourseCard from "@/components/studentCourseCard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const email = session?.user?.email;
  const rollNo = email?.split("@")[0];
  console.log(rollNo);

  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    if (rollNo) {
      const response = await fetch(`/api/students/${rollNo}`);
      const res = await response.json();

      console.log(res);
      console.log(res.courses);

      if (res.error === "Student not found") {
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
        let tempCourses: any[] = [];
        res.courses.forEach(async (element: string) => {
          const response = await fetch(`/api/courses/${element}`);
          const res = await response.json();

          let presentCount: number = 0;

          const attendance = res.attendance;
          attendance.map((element: any) => {
            const found = element.present.find(
              (element: any) => element === rollNo
            );
            if (found !== undefined) {
              presentCount++;
            }
          });

          tempCourses.push({
            courseId: element,
            totalAttendance: presentCount,
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
  }, [rollNo]);

  return (
    <>
      <Box width="100%">
        <Typography variant="h5" sx={{mb:2}}>Courses</Typography>
        <Grid container spacing={2}>
          {courses.map((course: any) => {
            return (
              <Grid key={course.course_id} item xs={6} md={2.5}>
                <Box width="100%">
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
      </Box>
    </>
  );
};

export default Page;
