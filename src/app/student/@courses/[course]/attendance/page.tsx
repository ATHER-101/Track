"use client";

import {
  Button,
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
import React, { useCallback, useEffect, useState } from "react";

const DownloadButton = ({ params }: { params: { course: string } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [rollNo, setRollNo] = useState<string | undefined>();

  const [data, setData] = useState<string[][] | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!!rollNo) {
      try {
        const response = await fetch(`/api/courses/${params.course}`);
        const res = await response.json();

        const tempData: any[] = [[], []];

        const attendance = res.attendance;

        if (Array.isArray(attendance)) {
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
  }, [rollNo]);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const rollNo = email.split("@")[0];
      setRollNo(rollNo);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [rollNo, fetchData]);

  const handleDownload = async () => {
    if (data !== undefined) {
      const csvContent = data.map((row: any) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const hiddenLink = document.createElement("a");
      hiddenLink.href = url;
      hiddenLink.download = "export.csv";
      hiddenLink.click();

      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {loading ? (
        <Skeleton variant="rounded" width="100%" height={40} sx={{bgcolor:"white" }}/>
      ) : (
        <Button
          fullWidth
          variant="contained"
          onClick={handleDownload}
          sx={{ mb: 2 }}
        >
          Download Attendance Record as Excel
        </Button>
      )}

      {loading ? (
        <Skeleton variant="rounded" width="100%" height={"92px"} sx={{ mt: 2, bgcolor:"white" }} />
      ) : (
        <Paper sx={{ borderRadius: "6px" }}>
          <TableContainer
            sx={{ maxHeight: 440, width: "100%", borderRadius: "6px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#1976d2", color: "white", py: 1 }}>
                    <Typography variant="subtitle1">Date</Typography>
                  </TableCell>
                  {data?.at(0)?.map((date: string, index) => (
                    <TableCell
                      key={index}
                      sx={{ bgcolor: "#65a5e5", color: "white", py: 1 }}
                    >
                      <Typography variant="subtitle1">{date}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#1976d2", color: "white", py: 1 }}>
                    <Typography variant="subtitle1">Status</Typography>
                  </TableCell>
                  {data?.at(1)?.map((status: string, index) => (
                    <TableCell key={index} sx={{ py: 1 }}>
                      <Typography variant="subtitle1">{status}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};

export default DownloadButton;
