import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createResumePDF } from '@/utils/server/pdf-generator';
import { ResumeData, DesignConfig } from '@/types';

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { thaiData, englishData, designConfig, currentLanguage } = body as {
			thaiData: ResumeData;
			englishData: ResumeData;
			designConfig: DesignConfig;
			currentLanguage: 'th' | 'en';
		};

		if (!designConfig) {
			return NextResponse.json({ error: 'Missing designConfig' }, { status: 400 });
		}

		const data = currentLanguage === 'th' ? thaiData : englishData;
		if (!data) {
			return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
		}

		const pdfBuffer = await createResumePDF(data, designConfig);
		if (pdfBuffer) {
			const pdf = Buffer.from(pdfBuffer);
			return new NextResponse(pdf, {
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Disposition': 'attachment; filename="Resume.pdf"',
				},
			});
		} else {
			return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
		}
	} catch (error) {
		console.error('PDF generation error:', error);
		return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
	}
}
