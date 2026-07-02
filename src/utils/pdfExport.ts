import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPdf(elementId: string, fileName: string = 'Resume.pdf'): Promise<void> {
	const element = document.getElementById(elementId);
	if (!element) {
		throw new Error(`Element with id "${elementId}" not found.`);
	}

	const originalWidth = element.style.width;
	const originalHeight = element.style.height;
	const originalBoxShadow = element.style.boxShadow;
	const originalBorder = element.style.border;
	const originalBorderRadius = element.style.borderRadius;

	element.style.width = '794px';
	element.style.boxShadow = 'none';
	element.style.border = 'none';
	element.style.borderRadius = '0';

	try {
		const canvas = await html2canvas(element, {
			scale: 2,
			useCORS: true,
			logging: false,
			backgroundColor: '#ffffff',
			windowWidth: 794,
		});

		const imgData = canvas.toDataURL('image/png');

		const pdf = new jsPDF('p', 'pt', 'a4');
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();

		const imgWidth = canvas.width;
		const imgHeight = canvas.height;

		const ratio = pdfWidth / imgWidth;
		const renderedHeight = imgHeight * ratio;

		if (renderedHeight <= pdfHeight) {
			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedHeight, undefined, 'FAST');
		} else {
			let heightLeft = renderedHeight;
			let position = 0;

			pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderedHeight, undefined, 'FAST');
			heightLeft -= pdfHeight;

			while (heightLeft > 0) {
				position = heightLeft - renderedHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, renderedHeight, undefined, 'FAST');
				heightLeft -= pdfHeight;
			}
		}

		pdf.save(fileName);
	} catch (error) {
		console.error('Error exporting PDF:', error);
		throw error;
	} finally {
		element.style.width = originalWidth;
		element.style.height = originalHeight;
		element.style.boxShadow = originalBoxShadow;
		element.style.border = originalBorder;
		element.style.borderRadius = originalBorderRadius;
	}
}
