import NextAuth, { NextAuthConfig, Session, User } from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
// import prisma from '@/lib/prisma';
import { JWT } from 'next-auth/jwt';
// import { ApiError } from '@/lib/errors';
// import { rateLimit } from '@/lib/rate-limit';

import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise, { connectToDatabase } from './db';
import { compare } from 'bcryptjs';

const authOptions: NextAuthConfig = {
	adapter: MongoDBAdapter(clientPromise),
	// adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile(profile) {
				return {
					id: profile.sub,
					name: `${profile.name}`,
					email: profile.email,
					username: profile.email,
					image: profile.picture,
					role: 'customer', // Force customer role for OAuth users
				};
			},
		}),
		CredentialsProvider({
			id: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, request): Promise<User | null> {
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
