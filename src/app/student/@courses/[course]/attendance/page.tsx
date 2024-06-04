"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DownloadButton = ({ params }: { params: { course: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const email = session?.user?.email;
  const rollNo = email?.split("@")[0];
  console.log(rollNo);

  const [data, setData] = useState<any[] | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/courses/${params.course}`);
      const res = await response.json();

      const tempData: any[] = [[], []];

      const attendance = res.attendance;
      attendance.map((element: { date: string; present: [] }) => {
        tempData[0].push(element.date);
        if (
          element.present.find((element: any) => element === rollNo) !==
          undefined
        ) {
          tempData[1].push("Present");
        } else {
          tempData[1].push("Absent");
        }
      });

    //   console.log(tempData);
      setData(tempData);
    //   console.log(data);
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
      hiddenLink.download = "export.csv";
      hiddenLink.click();

      window.URL.revokeObjectURL(url);

      router.push("/student");
    }
  };

  const wait = ()=>{
    console.log(data);
  }

  return <button onClick={data!==undefined?handleDownload:wait}>Download Excel</button>;
};

export default DownloadButton;
