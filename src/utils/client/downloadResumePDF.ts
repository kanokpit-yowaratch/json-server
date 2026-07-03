export async function downloadResumePDF(body: {
	thaiData: unknown;
	englishData: unknown;
	designConfig: unknown;
	currentLanguage: 'th' | 'en';
}): Promise<void> {
	try {
		const response = await fetch('/api/generate-resume', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'Resume.pdf';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	} catch (error) {
		console.error('Failed to download PDF:', error);
		throw error;
	}
}
