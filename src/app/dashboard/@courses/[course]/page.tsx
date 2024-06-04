"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { course: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [data, setData] = useState<any[] | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/courses/${params.course}`);
      const res = await response.json();

      let arr = res.students;
      const tempData: any[] = [[""]];
      arr.forEach((element: string) => {
        tempData.push([element]);
      });

      const attendance = res.attendance;
      attendance.map((period: { date: string; present: [] }) => {
        tempData[0].push(period.date);
        for (let index = 0; index < arr.length; index++) {
          let rollNo = arr[index];
          if (
            period.present.find((element: any) => element === rollNo) !==
            undefined
          ) {
            tempData[index+1].push("Present");
          } else {
            tempData[index+1].push("Absent");
          }
          
        }
      });

      setData(tempData);
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    if (data !== undefined) {
      const csvContent = data.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const hiddenLink = document.createElement("a");
      hiddenLink.href = url;
      hiddenLink.download = `attendance.csv`;
      hiddenLink.click();

      window.URL.revokeObjectURL(url);

      router.push("/dashboard");
    }
  };

  const wait = () => {
    console.log(data);
  };

  return (
    <>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 p-2 rounded">
        <Link href={`/dashboard/${params.course}/attendance`}>
          Mark Attendance
        </Link>
      </button>

      <button
        onClick={data !== undefined ? handleDownload : wait}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 p-2 rounded"
      >
        Download Attendance Record
      </button>
    </>
  );
};

export default Page;
