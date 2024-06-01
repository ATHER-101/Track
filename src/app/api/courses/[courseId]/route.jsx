import { NextResponse } from 'next/server';
import connectToDB from '../../../../../utils/connectDB';
import Course from '../../../../../models/Courses';

export async function GET(request, { params }) {
  const { courseId } = params;

  try {
    await connectToDB();
    const data = await Course.findById(courseId); // Ensure `courseId` is correctly used
    if (!data) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
