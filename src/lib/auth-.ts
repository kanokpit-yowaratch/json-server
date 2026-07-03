import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise, { connectToDatabase } from './db';
import { compare } from 'bcryptjs';

declare module 'next-auth' {
	interface User {
		role?: string;
	}
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			role: string;
		};
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	session: { strategy: 'jwt' },
	providers: [
		Google,
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const { db } = await connectToDatabase();
				const user = await db.collection('users').findOne({
					email: credentials.email as string,
				});
				if (!user || !user.password) return null;
				const isValid = await compare(credentials.password as string, user.password);
				if (!isValid) return null;
				return {
					id: user._id.toString(),
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				(token as Record<string, unknown>).role = user.role;
				(token as Record<string, unknown>).id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = (token as Record<string, string>).role;
				session.user.id = (token as Record<string, string>).id;
			}
			return session;
		},
		async signIn({ user, account }) {
			if (account?.provider === 'google') {
				const { db } = await connectToDatabase();
				const existing = await db.collection('users').findOne({ email: user.email });
				if (!existing) {
					const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
					await db.collection('users').updateOne(
						{ email: user.email },
						{
							$set: {
								role: adminCount === 0 ? 'admin' : 'user',
								name: user.name,
							},
						},
						{ upsert: true },
					);
				}
			}
			return true;
		},
	},
	pages: {
		signIn: '/login',
	},
});
