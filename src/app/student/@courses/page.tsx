"use client";

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

          tempCourses.push({ courseId: element, courseName: res.courseName });
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
      <div className="bg-blue-300 my-5 ml-5 p-6 ">
        <div>Courses</div>
        <div className="flex flex-row flex-wrap  overflow-auto w-[950px]">
          {courses.map((course: any) => {
            return (
              <StudentCourseCard
                key={course.courseId}
                courseId={course.courseId}
                courseName={course.courseName}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Page;
