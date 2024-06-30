// import { NextResponse } from 'next/server';
// import connectToDB from '../../../../../utils/connectDB';
// import Student from '../../../../../models/Students';

// export async function GET(request, { params }) {
//   const { studentId } = params;

//   try {
//     await connectToDB();
//     const data = await Student.findOne({rollNo:studentId});
//     if (!data) {
//       return NextResponse.json({ error: 'Student not found' }, { status: 404 });
//     }
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectToDB from '../../../../../utils/connectDB';
import Student from '../../../../../models/Students';
import Course from '../../../../../models/Courses';

export async function GET(request, { params }) {
  const { studentId } = params;

  try {
    await connectToDB();

    const student = await Student.findOne({ rollNo: studentId });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const courses = await Course.find({
      _id: {
        "$in": student.courses
      }
    });

    return NextResponse.json({ student, courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // try {
  //   await connectToDB();
  //   const data = await Student.findOne({rollNo:studentId});
  //   if (!data) {
  //     return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  //   }
  //   return NextResponse.json(data, { status: 200 });
  // } catch (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
}