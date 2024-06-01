import Link from "next/link";

const StudentCourseCard = ({ courseName,courseId }: { courseName: String, courseId: String }) => {
  return (
    <div className="bg-blue-500 p-2 my-3 mr-3 flex flex-col h-[140px] w-[170px]">
      <div className="font-bold">{courseName}</div>
      <div className="text-sm">total classes</div>
      <Link
        href={`/student/${courseId}/attendance`}
        className="bg-blue-300 hover:bg-blue-700 text-sm py-1 px-3 my-2 rounded"
      >
        Attendance
      </Link>
    </div>
  );
};

export default StudentCourseCard;
