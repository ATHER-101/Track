import Box from "@mui/material/Box";
import { Button, Paper, Typography } from "@mui/material";

import Link from "next/link";

interface Props {
  courseName: String;
  courseId: String;
  totalClasses:Number;
  onDelete: () => void;
}

const CourseCard = ({ courseName, courseId, totalClasses, onDelete }: Props) => {

  return (
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
          onClick={onDelete}
          sx={{ mb:2,mt:1,width:"85%" }}
        >Delete Course</Button>
      </Paper>
  );
};

export default CourseCard;
