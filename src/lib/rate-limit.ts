import { connectToDatabase } from './db';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const RATE_LIMIT_COLLECTION = 'rate_limits';

let indexEnsured = false;

export async function rateLimit(
	identifier: string,
): Promise<{ success: boolean; remaining: number }> {
	try {
		const { db } = await connectToDatabase();
		const collection = db.collection<{
			_id: string;
			count: number;
			resetAt: Date;
		}>(RATE_LIMIT_COLLECTION);

		if (!indexEnsured) {
			await collection.createIndex({ resetAt: 1 }, { expireAfterSeconds: 0 });
			indexEnsured = true;
		}

		const now = new Date();
		const entry = await collection.findOne({ _id: identifier });

		if (!entry || now > entry.resetAt) {
			await collection.updateOne(
				{ _id: identifier },
				{ $set: { count: 1, resetAt: new Date(now.getTime() + WINDOW_MS) } },
				{ upsert: true },
			);
			return { success: true, remaining: MAX_ATTEMPTS - 1 };
		}

		if (entry.count >= MAX_ATTEMPTS) {
			return { success: false, remaining: 0 };
		}

		await collection.updateOne({ _id: identifier }, { $inc: { count: 1 } });
		return { success: true, remaining: MAX_ATTEMPTS - entry.count - 1 };
	} catch {
		return { success: true, remaining: MAX_ATTEMPTS - 1 };
	}
}

export function getClientIp(request?: Request): string {
	if (!request) return 'unknown';
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();
	return request.headers.get('x-real-ip') || 'unknown';
}
