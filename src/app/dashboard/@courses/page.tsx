"use client";

import CourseCard from "@/components/courseCard";
import Image from "next/image";
import plus from "@/../public/plus.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
      const response = await fetch(`/api/professors/${emailId}`);
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
          const response = await fetch(`/api/courses/${course_id}`);
          const res = await response.json();

          tempCourses.push({ courseId: course_id ,totalClasses:res.attendance.length, courseName: res.courseName });
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
      <div className="bg-blue-300 m-6 p-6 ">
        <div>Courses</div>
        <div className="flex flex-row flex-wrap  overflow-auto w-[950px]">
          {courses.map((course: any) => {
            return (
              <CourseCard
                key={course.courseId}
                totalClasses={course.totalClasses}
                courseId={course.courseId}
                courseName={course.courseName}
              />
            );
          })}

          <Link
            href="/dashboard/add-course"
            className="bg-blue-500 hover:bg-blue-700 p-2 my-3 h-[140px] w-[170px] flex justify-center items-center"
          >
            <Image
              src={plus}
              width={50}
              height={50}
              alt="Picture of the author"
              placeholder="empty"
              priority={false}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
