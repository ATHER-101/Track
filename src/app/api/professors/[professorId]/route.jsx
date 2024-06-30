// import { NextResponse } from 'next/server';
// import connectToDB from '../../../../../utils/connectDB';
// import Professor from '../../../../../models/Professor';

// export async function GET(request, { params }) {
//   const { professorId } = params;

//   try {
//     await connectToDB();
//     const data = await Professor.findOne({emailId:professorId});
//     if (!data) {
//       return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
//     }
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectToDB from '../../../../../utils/connectDB';
import Professor from '../../../../../models/Professor';
import Course from '../../../../../models/Courses';

export async function GET(request, { params }) {
  const { professorId } = params;

  try {
    await connectToDB();

    const professor = await Professor.findOne({ emailId: professorId });

    if (!professor) {
      return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
    }

    const courses = await Course.find({
      _id: {
        "$in": professor.courses
      }
    });

    return NextResponse.json({ professor, courses }, { status: 200 });
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