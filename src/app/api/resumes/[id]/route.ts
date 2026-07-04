import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sanitizeResumeData } from '@/lib/sanitize';
import { ObjectId } from 'mongodb';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const { db } = await connectToDatabase();
		const resume = await db.collection('resumes').findOne({
			_id: new ObjectId(id),
			userId: session.user.id,
		});

		if (!resume) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: {
				...resume,
				_id: resume._id.toString(),
			},
		});
	} catch (err) {
		const message =
			err instanceof Error && err.message.includes('MONGODB_URI')
				? 'Database not configured'
				: 'Failed to fetch resume';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const body = await request.json();
		const { db } = await connectToDatabase();

		const update: Record<string, unknown> = { updatedAt: new Date() };
		if (body.title !== undefined) update.title = body.title;
		if (body.thaiData !== undefined) update.thaiData = sanitizeResumeData(body.thaiData);
		if (body.englishData !== undefined) update.englishData = sanitizeResumeData(body.englishData);
		if (body.designConfig !== undefined) update.designConfig = body.designConfig;

		const result = await db
			.collection('resumes')
			.updateOne({ _id: new ObjectId(id), userId: session.user.id }, { $set: update });

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		const message =
			err instanceof Error && err.message.includes('MONGODB_URI')
				? 'Database not configured'
				: 'Failed to update resume';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const { db } = await connectToDatabase();

		const result = await db.collection('resumes').deleteOne({
			_id: new ObjectId(id),
			userId: session.user.id,
		});

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		const message =
			err instanceof Error && err.message.includes('MONGODB_URI')
				? 'Database not configured'
				: 'Failed to delete resume';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}
