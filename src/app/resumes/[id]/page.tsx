'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ResumeBuilder from '@/components/ResumeBuilder';
import { ArrowLeft } from 'lucide-react';

export default function EditResumePage() {
	const params = useParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	const [resumeData, setResumeData] = useState<Record<string, unknown> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (status === 'loading') return;
		if (!session) {
			router.push('/login');
			return;
		}

		const fetchResume = async () => {
			try {
				const res = await fetch(`/api/resumes/${params.id}`);
				if (!res.ok) {
					if (res.status === 404) setError('Resume not found');
					else setError('Failed to load resume');
					return;
				}
				const json = await res.json();
				if (json.success) setResumeData(json.data);
			} catch {
				setError('Failed to load resume');
			} finally {
				setLoading(false);
			}
		};

		fetchResume();
	}, [params.id, session, status, router]);

	if (status === 'loading' || loading) {
		return (
			<div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
				<p className="text-slate-400">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
				<p className="text-red-500">{error}</p>
				<button
					onClick={() => router.push('/resumes')}
					className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm cursor-pointer">
					<ArrowLeft className="h-4 w-4" />
					Back to Dashboard
				</button>
			</div>
		);
	}

	if (!resumeData) return null;

	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
			<div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2 flex items-center gap-3">
				<button
					onClick={() => router.push('/resumes')}
					className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
					<ArrowLeft className="h-5 w-5" />
				</button>
				<input
					type="text"
					value={resumeData.title as string}
					onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
					className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 py-0.5 flex-1 min-w-0"
				/>
			</div>
			<div className="flex-1">
				<ResumeBuilder
					resumeId={params.id as string}
					initialData={resumeData}
					title={resumeData.title as string}
					onTitleChange={(newTitle) => setResumeData({ ...resumeData, title: newTitle })}
				/>
			</div>
		</div>
	);
}
