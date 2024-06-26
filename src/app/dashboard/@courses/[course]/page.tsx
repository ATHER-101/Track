"use client";

import {
  Button,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const DownloadButton = ({ params }: { params: { course: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [emailId, setEmailId] = useState<string | undefined>();
  const [courseName,setCourseName] = useState<string>("");
  const [data, setData] = useState<string[][] | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!!emailId) {
      try {
        const response = await fetch(`/api/courses/${params.course}`);
        const res = await response.json();

        let arr: any[] = await res.students;
        const tempData: any[] = [["Students / Date"]];
        arr.forEach((element: string) => {
          tempData.push([element]);
        });

        const attendance = res.attendance;

        if (Array.isArray(attendance)) {
          attendance.map((period: { date: string; present: [] }) => {
            tempData[0].push(period.date);
            for (let index = 0; index < arr.length; index++) {
              let rollNo = arr[index];
              if (
                period.present.find((element: any) => element === rollNo) !==
                undefined
              ) {
                tempData[index + 1].push("Present");
              } else {
                tempData[index + 1].push("Absent");
              }
            }
          });
          setCourseName(res.courseName);
          setData(tempData);
          setLoading(false);
        } else {
          console.error(
            "Attendance data is not in expected format:",
            attendance
          );
        }
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      }
    }
  }, [emailId]);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const emailId = email.split("@")[0];
      setEmailId(emailId);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [emailId, fetchData]);

  const handleDownload = async () => {
    if (data !== undefined) {
      const csvContent = data.map((row: any) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const hiddenLink = document.createElement("a");
      hiddenLink.href = url;
      hiddenLink.download = `${courseName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
      hiddenLink.click();

      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            href={`/dashboard/${params.course}/attendance`}
          >
            Mark Attendance
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton
              variant="rounded"
              width="100%"
              height={40}
              sx={{bgcolor:"white"}}
            />
          ) : (
            <Button fullWidth variant="contained" onClick={handleDownload}>
              Download Attendance as Excel
            </Button>
          )}
        </Grid>
      </Grid>

      {loading ? (
        <Skeleton
          variant="rounded"
          width="100%"
          height={440}
          sx={{ mt: 2, bgcolor:"white" }}
        />
      ) : (
        <Paper sx={{ borderRadius: "6px", mt: 3 }}>
          <TableContainer
            sx={{ maxHeight: 440, width: "100%", borderRadius: "6px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {data?.at(0)?.map((date: string, index) => {
                    return (
                      <TableCell
                        key={index}
                        sx={{
                          py: 1,
                          bgcolor: index === 0 ? "#1976d2" : "#65a5e5",
                        }}
                      >
                        <Typography variant="subtitle1">{date}</Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row: string[], index) => {
                  if (index !== 0) {
                    return (
                      <TableRow key={index}>
                        {row?.map((cell: string, index) => {
                          return (
                            <TableCell
                              key={index}
                              sx={{
                                py: 1,
                                bgcolor: index === 0 ? "#65a5e5" : "white",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {cell}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};

export default DownloadButton;
