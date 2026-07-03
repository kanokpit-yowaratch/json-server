export const downloadPDF = async (data: any, api: string, fileName: string) => {
	try {
		const response = await fetch(`/api/admin/${api}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error('Failed to generate PDF');
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	} catch (error) {
		console.log('เกิดข้อผิดพลาดในการสร้าง PDF', error);
	}
};
