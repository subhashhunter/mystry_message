import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token && 
    (url.pathname.startsWith('/signin') ||
     url.pathname.startsWith('/signup') ||
     url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    !token && 
    (url.pathname.startsWith('/dashboard') ||
     url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  // Allow the request to proceed
  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
