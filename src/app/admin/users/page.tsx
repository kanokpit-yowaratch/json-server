'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, User, Key } from 'lucide-react';

interface User {
	_id: string;
	email: string;
	name: string;
	role: string;
	createdAt: string;
}

export default function AdminUsersPage() {
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [newEmail, setNewEmail] = useState('');
	const [newName, setNewName] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [error, setError] = useState('');

	const fetchUsers = async () => {
		try {
			const res = await fetch('/api/admin/users');
			if (!res.ok) {
				router.push('/resumes');
				return;
			}
			const json = await res.json();
			if (json.success) setUsers(json.data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const res = await fetch('/api/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: newEmail,
					name: newName,
					password: newPassword,
				}),
			});
			const json = await res.json();
			if (json.success) {
				setUsers((prev) => [...prev, json.data]);
				setShowCreate(false);
				setNewEmail('');
				setNewName('');
				setNewPassword('');
			} else {
				setError(json.error || 'Failed to create user');
			}
		} catch {
			setError('Failed to create user');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this user and all their resumes?')) return;
		try {
			await fetch('/api/admin/users', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});
			setUsers((prev) => prev.filter((u) => u._id !== id));
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
			<header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
				<div className="max-w-4xl mx-auto flex items-center gap-3">
					<button
						onClick={() => router.push('/resumes')}
						className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-lg font-bold">Manage Users</h1>
						<p className="text-xs text-slate-500 dark:text-slate-400">Create and manage user accounts</p>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-6 py-8">
				<div className="flex items-center justify-between mb-6">
					<p className="text-sm text-slate-500 dark:text-slate-400">
						{users.length} user{users.length !== 1 ? 's' : ''}
					</p>
					<button
						onClick={() => setShowCreate(!showCreate)}
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer">
						<Plus className="h-4 w-4" />
						Add User
					</button>
				</div>

				{showCreate && (
					<form
						onSubmit={handleCreate}
						className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
						{error && <p className="text-sm text-red-500">{error}</p>}
						<input
							type="text"
							placeholder="Full name"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							required
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
						/>
						<input
							type="email"
							placeholder="Email address"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							required
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
						/>
						<input
							type="password"
							placeholder="Password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
						/>
						<div className="flex gap-2">
							<button
								type="submit"
								className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer">
								Create User
							</button>
							<button
								type="button"
								onClick={() => setShowCreate(false)}
								className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
								Cancel
							</button>
						</div>
					</form>
				)}

				{loading ? (
					<p className="text-center py-12 text-slate-400">Loading...</p>
				) : (
					<div className="space-y-2">
						{users.map((user) => (
							<div
								key={user._id}
								className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
								<div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
									<User className="h-5 w-5" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm">{user.name}</span>
										{user.role === 'admin' && (
											<span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 uppercase">
												Admin
											</span>
										)}
									</div>
									<p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
								</div>
								{user.role !== 'admin' && (
									<button
										onClick={() => handleDelete(user._id)}
										className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
