"use client";

import { useRef, useState } from "react";
import ScheduleButton from "@/components/scheduleButton";
import Papa from "papaparse";
import Router, { useRouter } from "next/navigation";

const Page = () => {
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
      .filter(([day, { active, time }]) => active==="true" && !timePattern.test(time))
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
        const students: string[] = [];

        Papa.parse(csvFile as File, {
          header: false,
          complete: (result) => {
            const data = result.data as string[][]; // Explicitly typing the result data

            data.map((i) => {
              students.push(i[0]);
            });
          },
        });

        const response = await fetch("https://localhost:3000/api/add-course", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: course,
            schedule: schedule,
            students: students
          }),
        });

        const res = await response.json();
        console.log(res);

        router.back();

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
