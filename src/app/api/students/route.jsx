import connectToDB from '../../../../utils/connectDB';
import Student from '../../../../models/Students';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();
        const data = await Student.find();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const body = await request.json();
    console.log("Request body:", body);
    
    try {

        await connectToDB();

        const data = new Student(body);
        await data.save();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error:", error); // Log the error
        return NextResponse.json({ error: error.message }, { status: 501 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json(); // parse the JSON body of the request
        const courseId = body.courseId;
        const rollNo = body.rollNo;

        console.log(courseId, rollNo);

        await connectToDB();

        const student = await Student.findOne({ "rollNo": rollNo });
        console.log("resut____:",student);
        if (!student) {
            const data = new Student({rollNo:rollNo,courses:[courseId]});
            await data.save();
            return NextResponse.json(data);
        }else{
            student.courses.push(courseId);
            await student.save();
        }

        return new NextResponse(JSON.stringify(student), { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 501 });
    }
}

export async function DELETE(request) {
    const body = await request.json();
    const rollNo = body.rollNo;
    const courseId = body.courseId;

    try {
        await connectToDB();

        const updatedCourse = await Student.findOneAndUpdate(
            { "rollNo": rollNo },
            { $pull: { courses: courseId } },
            { new: true }
        );

        if (!updatedCourse) {
            return new NextResponse(JSON.stringify({ message: 'Student not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(updatedCourse), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Error deleting Course', error: error.message }), { status: 500 });
    }
}
