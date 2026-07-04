interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function rateLimit(identifier: string): { success: boolean; remaining: number } {
	const now = Date.now();
	const entry = store.get(identifier);

	if (!entry || now > entry.resetAt) {
		store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
		return { success: true, remaining: MAX_ATTEMPTS - 1 };
	}

	if (entry.count >= MAX_ATTEMPTS) {
		return { success: false, remaining: 0 };
	}

	entry.count++;
	return { success: true, remaining: MAX_ATTEMPTS - entry.count };
}

export function getClientIp(request?: Request): string {
	if (!request) return 'unknown';
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();
	return request.headers.get('x-real-ip') || 'unknown';
}
