import NextAuth, { NextAuthConfig, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise, { connectToDatabase } from './db';
import { compare } from 'bcryptjs';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

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

const authOptions: NextAuthConfig = {
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
	providers: [
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
			? [
					GoogleProvider({
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
						profile(profile) {
							return {
								id: profile.sub,
								name: `${profile.name}`,
								email: profile.email,
								username: profile.email,
								image: profile.picture,
								role: 'customer',
							};
						},
					}),
				]
			: []),
		CredentialsProvider({
			id: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, request): Promise<User | null> {
				if (!credentials?.email || !credentials?.password) return null;

				const ip = getClientIp(request as Request);
				const { success } = await rateLimit(`login:${ip}`);
				if (!success) return null;

				const { db } = await connectToDatabase();
				const user = await db.collection('users').findOne({
					email: credentials.email as string,
				});
				if (!user?.password) return null;
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
		async jwt({ token, user }: { token: JWT; user?: User }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				session.user.role = (token as Record<string, string>).role;
				session.user.id = (token as Record<string, string>).id;
			}
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export async function getSession() {
	const session = await auth();
	return session;
}

export function isSessionExpired(session: { expires?: string | Date } | null | undefined): boolean {
	if (!session?.expires) return true;
	return new Date() > new Date(session.expires);
}
