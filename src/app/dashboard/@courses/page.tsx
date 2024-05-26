"use client"

import CourseCard from "@/components/courseCard";
import Image from "next/image";
import plus from "@/../public/plus.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

const page = () => {
  const [courses,setCourses] = useState([])
  
  
  const fetchCourses = async()=>{
    const response = await fetch("https://localhost:3000/api/courses");
    const temp = await response.json();
    setCourses(temp);
  }

  useEffect(()=>{
    fetchCourses();
  },[])

  return (
    <>
      <div className="bg-blue-300 m-6 p-6 ">
        <div>Courses</div>
        <div className="flex flex-row flex-wrap  overflow-auto w-[950px]">
          {courses.map((course:any) => {
            return <CourseCard key={course._id} courseName={course.courseName} courseId={course._id} />;
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

export default page;
