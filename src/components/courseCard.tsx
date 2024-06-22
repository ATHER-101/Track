import Box from "@mui/material/Box";
import { Grid, Button, Paper, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import Link from "next/link";

interface Props {
  courseName: String;
  courseId: String;
  totalClasses:Number;
}

const CourseCard = ({ courseName, courseId, totalClasses }: Props) => {
  const deleteCourse = async () => {
    const deletedCourse = await fetch("/api/courses", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
      }),
    });

    const deleteRes = await deletedCourse.json();
    console.log(deleteRes);

    deleteRes.students.map(async (rollNo: String) => {
      await fetch("/api/students", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          rollNo: rollNo,
          courseId: courseId,
        }),
      });
    });

    await fetch("/api/professors", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        emailId: deleteRes.professor,
        courseId: courseId,
      }),
    });

    // router;
  };

  return (
    // <div className="bg-blue-500 p-2 my-3 mr-3 flex flex-col h-[140px] w-[170px]">
    //   <div className="font-bold">{courseName}</div>
    //   <div className="text-sm">{String(totalClasses)} {totalClasses===1?"class":"classes"} till now</div>
    //   <Link
    //     href={`/dashboard/${courseId}`}
    //     className="bg-blue-300 hover:bg-blue-700 text-sm py-1 px-3 my-2 rounded"
    //   >
    //     Attendance
    //   </Link>
    //   <button
    //     className="bg-red-300 hover:bg-red-700 text-sm py-1 px-3 my-1 rounded"
    //     onClick={deleteCourse}
    //   >
    //     Delete Course
    //   </button>
    // </div>
    <Paper sx={{ bgcolor:"#ffffff", width: "100%" }}>
        <Typography variant="h6" sx={{pt:1}}>{courseName}</Typography>
        <Typography variant="body1">
        {String(totalClasses)} {totalClasses===1?"class":"classes"} till now
        </Typography>
        
        <Button
          variant="contained"
          href={`/dashboard/${courseId}`}
          sx={{ mt: 1, width:"85%" }}
        >Attendance</Button>
        <Button
          variant="outlined"
          onClick={deleteCourse}
          sx={{ mb:2,mt:1,width:"85%" }}
        >Delete Course</Button>
      </Paper>
  );
};

export default CourseCard;
