import connectToDB from '../../../../utils/connectDB';
import Professor from '../../../../models/Professor';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();
        const data = await Professor.find();
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

        const data = new Professor(body);
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
        const emailId = body.emailId;

        console.log(courseId, emailId);

        await connectToDB();

        const professor = await Professor.findOne({ "emailId": emailId });
        console.log("resut____:",professor);
        if (!professor) {
            const data = new Professor({emailid:emailId,courses:[courseId]});
            await data.save();
            return NextResponse.json(data);
        }else{
            professor.courses.push(courseId);
            await professor.save();
        }

        return new NextResponse(JSON.stringify(professor), { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 501 });
    }
}