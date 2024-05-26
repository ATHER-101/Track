import connectToDB from '../../../../utils/connectDB';
import Course from '../../../../models/Courses';
import { NextResponse } from 'next/server';
import { course_id } from '@/components/courseCard';

export async function GET() {
    try {
        await connectToDB();
        const data = await Course.find();
        return new NextResponse(JSON.stringify(data));
    } catch (error) {
        return new NextResponse(error);
    }
}

export async function POST(request) {
    const body = await request.json();
    try {
        await connectToDB();
        const data= new Course(body);
        data.save();
        return new NextResponse(JSON.stringify(data));
    } catch (error) {
        return new NextResponse(error);
    }
}

export async function PUT(request) {
    try {
        const data = await request.json(); // parse the JSON body of the request
        const courseId = data.courseId;
        const date = data.date;
        const rollNo = data.rollNo;

        console.log(courseId,date,rollNo);

        await connectToDB();

        const course = await Course.findById(courseId);
        if (!course) {
            return new NextResponse(JSON.stringify({ message: 'Course not found' }), { status: 404 });
        }

        let attendanceUpdated = false;

        // Loop through the attendance array to find the matching date
        course.attendance.forEach((element) => {
            if (element.date === date) {
                element.present.push(rollNo); // Push rollNo to the present array
                attendanceUpdated = true;
            }
        });

        if (attendanceUpdated) {
            // Save the updated course document
            await course.save();
        } else {
            // Add a new attendance record
            course.attendance.push({ date: date, present: [rollNo] });
            await course.save();
        }

        return new NextResponse(JSON.stringify(course.attendance), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 501 });
    }
}



// import {courseDetails} from "../data";


// export async function GET() {
//     return Response.json(courseDetails);
// }

// export async function POST(request) {
//     const data = await request.json();
//     courseDetails.push({name:data.name,schedule:data.schedule,students:data.students})

//     return Response.json(courseDetails);
// }