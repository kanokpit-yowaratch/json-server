import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { db } = await connectToDatabase();
		const resumes = await db
			.collection('resumes')
			.find(
				{ userId: session.user.id },
				{
					projection: {
						title: 1,
						language: 1,
						updatedAt: 1,
						createdAt: 1,
					},
				},
			)
			.sort({ updatedAt: -1 })
			.toArray();

		const serialized = resumes.map((r) => ({
			_id: r._id.toString(),
			title: r.title,
			language: r.language,
			updatedAt: r.updatedAt,
			createdAt: r.createdAt,
		}));

		return NextResponse.json({ success: true, data: serialized });
	} catch {
		return NextResponse.json({ success: false, error: 'Failed to fetch resumes' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { db } = await connectToDatabase();

		const resume = {
			userId: session.user.id,
			title: body.title || 'Untitled Resume',
			language: body.language || 'th',
			thaiData: body.thaiData || null,
			englishData: body.englishData || null,
			designConfig: body.designConfig || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db.collection('resumes').insertOne(resume);

		return NextResponse.json({
			success: true,
			data: { _id: result.insertedId.toString(), ...resume },
		});
	} catch {
		return NextResponse.json({ success: false, error: 'Failed to create resume' }, { status: 500 });
	}
}
