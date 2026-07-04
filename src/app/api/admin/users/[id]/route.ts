import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await params;
		const { name, password } = await request.json();
		const { db } = await connectToDatabase();

		const update: Record<string, unknown> = {};
		if (name !== undefined) update.name = name;
		if (password) update.password = await hash(password, 12);

		await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: update });

		return NextResponse.json({ success: true });
	} catch (err) {
		const message =
			err instanceof Error && err.message.includes('MONGODB_URI')
				? 'Database not configured'
				: 'Failed to update user';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}
