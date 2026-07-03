import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';

export async function GET() {
	try {
		const { db } = await connectToDatabase();
		const collection = db.collection('resumes');
		const data = await collection.findOne({}, { sort: { _id: -1 } });
		return NextResponse.json({ success: true, data: data || null });
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { db } = await connectToDatabase();
		const collection = db.collection('resumes');
		await collection.updateOne({}, { $set: body }, { upsert: true });
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
	}
}
