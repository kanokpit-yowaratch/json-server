import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'resume-store.json');

async function readData(): Promise<Record<string, unknown> | null> {
	try {
		const raw = await fs.readFile(DATA_FILE, 'utf-8');
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

async function writeData(data: Record<string, unknown>): Promise<void> {
	await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
	await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
	const data = await readData();
	return NextResponse.json({
		success: true,
		data: data || null,
	});
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		await writeData(body);
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
	}
}
