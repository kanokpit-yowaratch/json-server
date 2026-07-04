function isValidAvatarUrl(url: unknown): boolean {
	if (!url || url === '') return true;
	if (typeof url !== 'string') return false;

	if (url.startsWith('http://') || url.startsWith('https://')) return true;

	if (url.startsWith('data:image/')) {
		const semicolon = url.indexOf(';');
		if (semicolon === -1) return false;
		return true;
	}

	return false;
}

export function sanitizeResumeData(data: unknown): unknown {
	if (!data || typeof data !== 'object') return data;

	const sanitized = { ...(data as Record<string, unknown>) };

	if (sanitized.personalInfo && typeof sanitized.personalInfo === 'object') {
		const personalInfo = { ...(sanitized.personalInfo as Record<string, unknown>) };
		if (!isValidAvatarUrl(personalInfo.avatar)) {
			personalInfo.avatar = '';
		}
		sanitized.personalInfo = personalInfo;
	}

	return sanitized;
}
