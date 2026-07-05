'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FileText, Plus, Trash2, LogOut, Edit } from 'lucide-react';

interface Resume {
	_id: string;
	title: string;
	language: string;
	updatedAt: string;
	createdAt: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [resumes, setResumes] = useState<Resume[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [titleInput, setTitleInput] = useState('');
	const [showTitleDialog, setShowTitleDialog] = useState(false);

	const fetchResumes = async () => {
		try {
			const res = await fetch('/api/resumes');
			const json = await res.json();
			if (json.success) setResumes(json.data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (status === 'loading') return;
		if (!session) {
			router.push('/login');
			return;
		}
		fetchResumes();
	}, [session, status, router]);

	const handleCreate = async () => {
		setTitleInput('');
		setShowTitleDialog(true);
	};

	const handleCreateSubmit = async () => {
		const title = titleInput.trim() || 'Untitled Resume';
		setShowTitleDialog(false);
		try {
			const res = await fetch('/api/resumes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					language: 'th',
				}),
			});
			const json = await res.json();
			if (json.success) {
				router.push(`/resumes/${json.data._id}`);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this resume?')) return;
		setDeleting(id);
		try {
			await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
			setResumes((prev) => prev.filter((r) => r._id !== id));
		} catch (e) {
			console.error(e);
		} finally {
			setDeleting(null);
		}
	};

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
			<header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-amber-500 rounded-xl text-slate-950 shadow-md">
							<FileText className="h-5 w-5" />
						</div>
						<h1 className="text-lg font-bold">Resume Builder</h1>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
							{session?.user?.name || session?.user?.email}
						</span>
						<button
							onClick={() => signOut({ callbackUrl: '/login' })}
							className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
							<LogOut className="h-4 w-4" />
							<span className="hidden sm:inline">Sign out</span>
						</button>
					</div>
				</div>
			</header>

			{status === 'loading' ? (
				<main className="max-w-4xl mx-auto px-6 py-8">
					<div className="text-center py-12 text-slate-400">Loading...</div>
				</main>
			) : (
				<main className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-xl font-bold">My Resumes</h2>
							<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
								{resumes.length} resume{resumes.length !== 1 ? 's' : ''}
							</p>
						</div>
						<button
							onClick={handleCreate}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer">
							<Plus className="h-4 w-4" />
							New Resume
						</button>
					</div>

					{loading ? (
						<div className="text-center py-12 text-slate-400">Loading...</div>
					) : resumes.length === 0 ? (
						<div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
							<FileText className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
							<p className="text-slate-500 dark:text-slate-400 font-medium">No resumes yet</p>
							<p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
								Click "New Resume" to get started
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{resumes.map((resume) => (
								<div
									key={resume._id}
									className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors bg-white dark:bg-slate-950">
									<div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
										<FileText className="h-5 w-5" />
									</div>
									<div
										className="flex-1 min-w-0 cursor-pointer"
										onClick={() => router.push(`/resumes/${resume._id}`)}>
										<h3 className="font-semibold text-sm truncate">{resume.title}</h3>
										<p className="text-xs text-slate-400 mt-0.5">
											{resume.language === 'th' ? 'Thai / English' : 'English / Thai'} &middot; Updated{' '}
											{formatDate(resume.updatedAt)}
										</p>
									</div>
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											onClick={() => router.push(`/resumes/${resume._id}`)}
											className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer">
											<Edit className="h-4 w-4" />
										</button>
										<button
											onClick={() => handleDelete(resume._id)}
											disabled={deleting === resume._id}
											className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-50">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</main>
			)}

			{showTitleDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
						<h3 className="text-base font-bold mb-1">New Resume</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Enter a name for your resume</p>
						<input
							autoFocus
							type="text"
							value={titleInput}
							onChange={(e) => setTitleInput(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
							placeholder="Untitled Resume"
							className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
						/>
						<div className="flex justify-end gap-2 mt-4">
							<button
								onClick={() => setShowTitleDialog(false)}
								className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
								Cancel
							</button>
							<button
								onClick={handleCreateSubmit}
								className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer">
								Create
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
