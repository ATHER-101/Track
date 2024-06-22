"use client";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

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

  const [data, setData] = useState<any[any[any]] | undefined>(undefined);

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
      const csvContent = data.map((row:any) => row.join(",")).join("\n");
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

  const wait = () => {
    console.log(data);
  };

  return (
    <>
      <Button onClick={data!==undefined?handleDownload:wait}>Download Attendance Record as Excel</Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* {data?[0].map((date) => (
                  <TableCell
                    key={date}
                    // align={column.align}
                    // style={{ minWidth: column.minWidth }}
                  >
                    {date}
                  </TableCell>
                ))} */}
                {data ? data[0].map((date:any)=>{
                  <TableCell
                  key={date}
                  // align={column.align}
                  // style={{ minWidth: column.minWidth }}
                >
                  {date}
                </TableCell>
                }) : false}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </>
  );
  // <button onClick={data!==undefined?handleDownload:wait}>Download Excel</button>;
};

export default DownloadButton;
