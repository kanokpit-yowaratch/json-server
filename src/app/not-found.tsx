'use client';

import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-sm text-center space-y-6">
				<div className="inline-flex p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
					<FileText className="h-8 w-8" />
				</div>
				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-slate-900 dark:text-white">404</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">Page not found</p>
				</div>
				<button
					onClick={() => router.push('/')}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer">
					<ArrowLeft className="h-4 w-4" />
					Back to Home
				</button>
			</div>
		</div>
	);
}
