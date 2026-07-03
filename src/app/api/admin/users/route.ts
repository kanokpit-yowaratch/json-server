import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { auth } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function GET() {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { db } = await connectToDatabase();
		const users = await db
			.collection('users')
			.find({}, { projection: { password: 0 } })
			.sort({ createdAt: -1 })
			.toArray();

		const serialized = users.map((u) => ({
			_id: u._id.toString(),
			email: u.email,
			name: u.name,
			role: u.role,
			createdAt: u.createdAt,
		}));

		return NextResponse.json({ success: true, data: serialized });
	} catch {
		return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { email, name, password } = await request.json();

		if (!email || !name || !password) {
			return NextResponse.json({ error: 'Email, name, and password are required' }, { status: 400 });
		}

		const { db } = await connectToDatabase();
		const existing = await db.collection('users').findOne({ email });
		if (existing) {
			return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
		}

		const hashedPassword = await hash(password, 12);
		const result = await db.collection('users').insertOne({
			email,
			name,
			password: hashedPassword,
			role: 'user',
			createdAt: new Date(),
		});

		return NextResponse.json({
			success: true,
			data: {
				_id: result.insertedId.toString(),
				email,
				name,
				role: 'user',
			},
		});
	} catch {
		return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const session = await auth();
	if (!session?.user || session.user.role !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();
		if (!id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		const { db } = await connectToDatabase();
		await db.collection('users').deleteOne({ _id: new ObjectId(id) });
		await db.collection('resumes').deleteMany({ userId: id });

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
	}
}
