import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { ResumeData, DesignConfig } from '@/types';
import { generateResumeHTML } from './generate-resume-html';

export async function generateResumePDF(data: ResumeData, config: DesignConfig) {
	let browser;
	try {
		const executablePath =
			process.env.NODE_ENV === 'development'
				? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
				: await chromium.executablePath();

		browser = await puppeteer.launch({
			headless: true,
			args: [
				...chromium.args,
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--disable-gpu',
				'--no-first-run',
				'--no-zygote',
				'--single-process',
				'--disable-extensions',
			],
			defaultViewport: {
				width: 1200,
				height: 800,
				deviceScaleFactor: 1,
				isMobile: false,
				hasTouch: false,
				isLandscape: false,
			},
			executablePath,
		});

		const page = await browser.newPage();
		const htmlContent = await generateResumeHTML(data, config);

		console.log('Generated HTML length:', htmlContent.length);

		await page.setContent(htmlContent, {
			waitUntil: 'load',
		});

		// Wait for fonts and Tailwind CDN to finish processing
		await page.evaluate(() => document.fonts.ready);
		await new Promise((r) => setTimeout(r, 2000));

		// Verify something rendered
		const bodyText = await page.evaluate(() => document.body.innerText.length);
		console.log('Page body text length:', bodyText);

		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			displayHeaderFooter: true,
			headerTemplate: '<div></div>',
			footerTemplate: `
        <div style="width:100%;text-align:center;font-size:9px;color:#9ca3af;font-family:Inter,'Sarabun',sans-serif;padding:0 18mm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
		});

		return pdf;
	} catch (error) {
		console.error('Failed to generate PDF:', error);
		return null;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

export async function createResumePDF(data: ResumeData, config: DesignConfig) {
	try {
		const pdfBuffer = await generateResumePDF(data, config);
		return pdfBuffer;
	} catch (error) {
		console.error(error);
		return null;
	}
}
