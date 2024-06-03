"use client";

import ScheduleCalendar from "@/components/Calendar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

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

  const email = session?.user?.email;
  const rollNo = email?.split("@")[0];
  console.log(rollNo);

  const [date, setDate] = useState<Date>(new Date());
  const [courses, setCourses] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

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

          tempCourses.push({
            schedule: res.schedule,
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

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getSchedule = () => {
    const day: string = days[date.getDay()];
    const tempSchedule: any[] = [];
    courses.forEach((course: Course) => {
      if (course.schedule[day].active === "true") {
        tempSchedule.push({
          courseName: course.courseName,
          time: course.schedule[day].time,
        });
      }
    });
    setSchedule(tempSchedule);
  };

  useEffect(() => {
    getSchedule();
    console.log(courses);
    console.log(schedule);
  }, [date]);

  useEffect(()=>{

  },[schedule])

  return (
    <>
      <div className="bg-blue-300 my-5 mr-5">
        <div className="mx-5 pt-4">Schedule</div>
        <ScheduleCalendar date={date} setDate={setDate} />
        <div className="flex justify-center">
          <div className="w-[86%] mb-4 p-2 bg-blue-500">
            {schedule.map((element)=>{
                return <div key={element.courseName} className="px-3">{element.courseName} : {element.time}</div>
            })}
            {schedule.length==0?"No classes today!":false}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
