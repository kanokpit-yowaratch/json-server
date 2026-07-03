import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const isLoggedIn = !!req.auth;

	if (!isLoggedIn && pathname !== '/login') {
		const loginUrl = new URL('/login', req.url);
		loginUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (isLoggedIn && pathname.startsWith('/admin')) {
		const role = req.auth?.user?.role;
		if (role !== 'admin') {
			return NextResponse.redirect(new URL('/resumes', req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
