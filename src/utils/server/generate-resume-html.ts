import React from 'react';
import { ResumeData, DesignConfig } from '@/types';

const TAILWIND_FALLBACK_CSS = `/* Static Tailwind utility classes for PDF rendering */
.bg-white { background-color: #ffffff; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-200 { background-color: #e5e7eb; }
.text-gray-900 { color: #111827; }
.text-gray-800 { color: #1f2937; }
.text-gray-700 { color: #374151; }
.text-gray-600 { color: #4b5563; }
.text-gray-500 { color: #6b7280; }
.text-gray-400 { color: #9ca3af; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-\\[11px\\] { font-size: 0.6875rem; }
.text-\\[10px\\] { font-size: 0.625rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
.font-normal { font-weight: 400; }
.font-sans { font-family: 'Inter', 'Sarabun', ui-sans-serif, system-ui, sans-serif; }
.font-serif { font-family: 'Lora', 'Sarabun', ui-serif, Georgia, serif; }
.font-mono { font-family: 'JetBrains Mono', 'Sarabun', ui-monospace, monospace; }
.uppercase { text-transform: uppercase; }
.italic { font-style: italic; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
.leading-relaxed { line-height: 1.625; }
.leading-tight { line-height: 1.25; }
.leading-normal { line-height: 1.5; }
.leading-none { line-height: 1; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.whitespace-nowrap { white-space: nowrap; }
.break-all { word-break: break-all; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.justify-start { justify-content: flex-start; }
.flex-1 { flex: 1 1 0%; }
.shrink-0 { flex-shrink: 0; }
.gap-1 { gap: 0.25rem; }
.gap-1\\.5 { gap: 0.375rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-5 { gap: 1.25rem; }
.gap-6 { gap: 1.5rem; }
.space-y-0 > * + * { margin-top: 0; }
.space-y-1 > * + * { margin-top: 0.25rem; }
.space-y-1\\.5 > * + * { margin-top: 0.375rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-2\\.5 > * + * { margin-top: 0.625rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-5 > * + * { margin-top: 1.25rem; }
.space-y-7 > * + * { margin-top: 1.75rem; }
.p-5 { padding: 1.25rem; }
.p-6 { padding: 1.5rem; }
.py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
.pl-1 { padding-left: 0.25rem; }
.pt-1 { padding-top: 0.25rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-4 { padding-top: 1rem; }
.pt-5 { padding-top: 1.25rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-4 { padding-bottom: 1rem; }
.pb-5 { padding-bottom: 1.25rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.mt-0\\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-1\\.5 { margin-bottom: 0.375rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-6 { margin-bottom: 1.5rem; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-8 { grid-column: span 8 / span 8; }
.order-1 { order: 1; }
.order-2 { order: 2; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-16 { height: 4rem; }
.h-20 { height: 5rem; }
.h-24 { height: 6rem; }
.h-px { height: 1px; }
.w-3 { width: 0.75rem; }
.w-4 { width: 1rem; }
.w-6 { width: 1.5rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-\\[800px\\] { max-width: 800px; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }
.object-cover { object-fit: cover; }
.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-b { border-bottom-width: 1px; }
.border-t { border-top-width: 1px; }
.border-l-4 { border-left-width: 4px; }
.border-r { border-right-width: 1px; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.list-disc { list-style-type: disc; }
.list-inside { list-style-position: inside; }
.overflow-hidden { overflow: hidden; }
.group:hover .group-hover\\:opacity-100 { opacity: 1; }
`;

export async function generateResumeHTML(data: ResumeData, config: DesignConfig): Promise<string> {
	try {
		const { renderToStaticMarkup } = await import('react-dom/server');
		const { default: ResumePreview } = await import('@/components/ResumePreview');
		const componentHTML = renderToStaticMarkup(React.createElement(ResumePreview, { data, config }));

		return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-sans: 'Inter', 'Sarabun', ui-sans-serif, system-ui, sans-serif;
      --font-serif: 'Lora', 'Sarabun', ui-serif, Georgia, serif;
      --font-mono: 'JetBrains Mono', 'Sarabun', ui-monospace, monospace;
    }
    @page {
      size: A4;
      margin: 22mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: 'Inter', 'Sarabun', ui-sans-serif, system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: #111827;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
    }
    ${TAILWIND_FALLBACK_CSS}
  </style>
</head>
<body>
  <div id="resume-print-area" style="width:100%;background:#fff;">
    ${componentHTML}
  </div>
</body>
</html>`;
	} catch (error) {
		console.error('Failed to generate resume HTML:', error);
		const escaped = String(error)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
		return (
			'<html><body style="background:white;color:black;padding:20px;font-family:sans-serif;"><h1>Error generating resume</h1><p>' +
			escaped +
			'</p></body></html>'
		);
	}
}
