import Link from "next/link";

interface Props {
  courseName: String;
  courseId: String;
}

const courseCard = ({ courseName, courseId }: Props) => {
  return (
    <div className="bg-blue-500 p-2 my-3 mr-3 flex flex-col h-[140px] w-[170px]">
      <div className="font-bold">{courseName}</div>
      <div className="text-sm">total classes</div>
      <Link
        href={`/dashboard/${courseId}/attendance`}
        className="bg-blue-300 hover:bg-blue-700 text-sm py-1 px-3 my-1 rounded"
      >
        Attendance
      </Link>
      <Link
        href={`/dashboard/${courseName}/edit-course`}
        className="bg-blue-300 hover:bg-blue-700 text-sm py-1 px-3 my-1 rounded"
      >
        Edit course details
      </Link>
    </div>
  );
};

export default courseCard;
