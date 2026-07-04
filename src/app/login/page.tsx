'use client';

import { Suspense, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FileText, AlertTriangle } from 'lucide-react';

function LoginForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/resumes';
	const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);

	useEffect(() => {
		fetch('/api/auth/config')
			.then((r) => r.json())
			.then((data) => setGoogleAvailable(!!data.google))
			.catch(() => setGoogleAvailable(false));
	}, []);

	return (
		<div className="w-full max-w-sm space-y-6">
			<div className="text-center space-y-2">
				<div className="inline-flex p-3 bg-amber-500 rounded-2xl text-slate-950 shadow-md shadow-amber-500/10 mb-2">
					<FileText className="h-8 w-8" />
				</div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Builder</h1>
				<p className="text-sm text-slate-500 dark:text-slate-400">Sign in to manage your resumes</p>
			</div>

			{googleAvailable === false && (
				<div className="p-3 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2">
					<AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
					<span>
						Google sign-in is not configured. Please set{' '}
						<code className="text-xs bg-amber-100 dark:bg-amber-900/40 px-1 rounded">GOOGLE_CLIENT_ID</code>{' '}
						and{' '}
						<code className="text-xs bg-amber-100 dark:bg-amber-900/40 px-1 rounded">
							GOOGLE_CLIENT_SECRET
						</code>{' '}
						in your environment variables.
					</span>
				</div>
			)}

			{googleAvailable === null ? (
				<div className="text-center text-sm text-slate-400 py-2">Loading...</div>
			) : googleAvailable ? (
				<button
					onClick={() => signIn('google', { callbackUrl })}
					className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
					<svg className="h-5 w-5" viewBox="0 0 24 24">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					Sign in with Google
				</button>
			) : (
				<div className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
					No authentication method is available. Please contact the administrator.
				</div>
			)}
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
			<Suspense fallback={<div className="text-slate-400">Loading...</div>}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
