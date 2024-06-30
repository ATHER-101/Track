import connectToDB from '../../../../utils/connectDB';
import Course from '../../../../models/Courses';
import Student from '../../../../models/Students'
import Professor from '../../../../models/Professor'
import { NextResponse } from 'next/server';

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

        const data = new Course(body);
        data.save();

        const students = data.students;
        const bulkOps = students.map((rollNo) => ({
            updateOne: {
                filter: { rollNo },
                update: { $addToSet: { courses: data._id } },
                upsert: true
            }
        }));

        try {
            const result = await Student.bulkWrite(bulkOps, { ordered: false });
            console.log(result);
        } catch (err) {
            console.error('Error during bulkWrite:', err);
        }

        const emailId = data.professor;
        try {
            const result = await Professor.updateOne(
                { emailId },
                { $addToSet: { courses: data._id } },
                { upsert: true }
            );
            console.log(result);
        } catch (err) {
            console.error('Error during updateOne:', err);
        }

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

        console.log(courseId, date, rollNo);

        await connectToDB();

        let updateResult = await Course.findOneAndUpdate(
            { _id: courseId, 'attendance.date': date },
            {
                $addToSet: { 'attendance.$.present': rollNo }
            },
            { new: true }
        );

        if (!updateResult) {
            updateResult = await Course.findByIdAndUpdate(
                {_id: courseId},
                { $push: { attendance: { date, present: [rollNo] } } },
                { new: true }
            );
        }

        return new NextResponse(JSON.stringify(updateResult), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 501 });
    }
}

export async function DELETE(request) {
    const body = await request.json();
    const courseId = body.courseId;
    try {
        await connectToDB();
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return new NextResponse(JSON.stringify({ message: 'Course not found' }), { status: 404 });
        }

        const students = deletedCourse.students;
        const bulkOps = students.map((rollNo) => ({
            updateOne: {
                filter: { rollNo },
                update: { $pull: { courses: courseId } }
            }
        }));

        try {
            const result = await Student.bulkWrite(bulkOps, { ordered: false });
            console.log(result);
        } catch (err) {
            console.error('Error during bulkWrite:', err);
        }

        const emailId = deletedCourse.professor;
        try {
            const result = await Professor.updateOne(
                { emailId },
                { $pull: { courses: courseId } }
            );
            console.log(result);
        } catch (err) {
            console.error('Error during updateOne:', err);
        }

        return new NextResponse(JSON.stringify(deletedCourse), { status: 200 });
    } catch (error) {
        return new NextResponse(error);
    }
}