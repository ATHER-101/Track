import { NextResponse } from 'next/server';
import connectToDB from '../../../../../utils/connectDB';
import Professor from '../../../../../models/Professor';

export async function GET(request, { params }) {
  const { professorId } = params;

  try {
    await connectToDB();
    const data = await Professor.findOne({emailId:professorId});
    if (!data) {
      return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}