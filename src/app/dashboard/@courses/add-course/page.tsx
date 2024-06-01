"use client";

import { useRef, useState } from "react";
import ScheduleButton from "@/components/scheduleButton";
import Papa from "papaparse";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

  const [course, setCourse] = useState<string>("");
  const [schedule, setSchedule] = useState<{
    [key: string]: { active: string; time: string };
  }>({
    Monday: { active: "false", time: "" },
    Tuesday: { active: "false", time: "" },
    Wednesday: { active: "false", time: "" },
    Thursday: { active: "false", time: "" },
    Friday: { active: "false", time: "" },
    Saturday: { active: "false", time: "" },
    Sunday: { active: "false", time: "" },
  });

  const handleCourseInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourse(event.target.value);
  };

  const handleToggle = (day: string, active: string, time: string) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: { active, time },
    }));
  };

  const file = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const submit = async () => {
    const timePattern =
      /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*-\s*(0?[1-9]|1[0-2]):[0-5][0-9]$/;

    const invalidDays = Object.entries(schedule)
      .filter(
        ([day, { active, time }]) =>
          active === "true" && !timePattern.test(time)
      )
      .map(([day]) => day);

    if (course === "") {
      console.warn("Please give course name!");
    } else if (invalidDays.length > 0) {
      console.warn(
        `Please give correct course timings for ${invalidDays.join(", ")}`
      );
    } else {
      const csvFile = file.current?.files?.[0] ?? null;

      if (csvFile !== null) {
        Papa.parse(csvFile, {
          header: false,
          complete: async (result) => {
            const students: string[] = [];
            const data = result.data as string[][]; // Explicitly typing the result data

            data.forEach((i) => {
              students.push(i[0]);
            });

            const response = await fetch("/api/courses", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                courseName: course,
                schedule: schedule,
                students: students,
                professor: emailId,
                attendance: [],
              }),
            });

            const res = await response.json();
            console.log(res);

            res.students.map(async (rollNo: String) => {
              const studentResponse = await fetch("/api/students", {
                method: "PUT",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  rollNo: rollNo,
                  courseId: res._id,
                }),
              });

              const studentRes = await studentResponse.json();
              console.log(studentRes);
            });

            const professorResponse = await fetch("/api/professors", {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                emailId: emailId,
                courseId: res._id,
              }),
            });

            const professorRes = await professorResponse.json();
            console.log(professorRes);

            router.back();
          },
        });
      } else {
        console.error("No file selected");
      }
    }
  };

  return (
    <>
      <h1 className="m-2 text-xl">Add Course</h1>

      <label htmlFor="course" className="m-2 text-lg">
        Course Name
      </label>
      <input
        id="course"
        className="block my-1 mx-2 border-2 border-blue-500 rounded"
        type="text"
        value={course}
        onChange={handleCourseInput}
      />

      <div className="m-2 text-lg">Schedule</div>
      {Object.keys(schedule).map((day) => (
        <ScheduleButton key={day} day={day} onToggle={handleToggle} />
      ))}

      <label className="m-2 text-lg" htmlFor="large_size">
        Large file input
      </label>
      <input
        ref={file}
        className="m-2 block w-full border-2 border-blue-500 rounded text-lg text-blue-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500
        file:bg-blue-500 file:hover:bg-blue-700 hover:border-blue-700 file:border-0
        file:me-3
        file:py-1 file:px-4 file:text-white"
        id="large_size"
        type="file"
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 my-5 mx-2 rounded"
        onClick={submit}
      >
        Add Course
      </button>
    </>
  );
};

export default Page;
