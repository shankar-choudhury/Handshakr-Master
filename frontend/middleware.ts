import { NextRequest, NextResponse } from 'next/server';

/**
 * Public routes that do not require authentication.
 */
const publicRoutes = ['/', '/register'];

/**
 * Routes that require authentication.
 */
const protectedRoutes = [
  '/dashboard',
  '/initiated-handshakes',
  '/create',
  '/history',
  '/received-handshakes',
  'price-analyzer'
];

/**
 * Middleware function that handles route-based authentication logic.
 * 
 * - Allows static files and API routes to bypass middleware.
 * - Redirects unauthenticated users away from protected routes.
 * - Redirects authenticated users away from public routes (e.g. login/register).
 * 
 * @param req - The incoming Next.js request object.
 * @returns A `NextResponse` to continue or redirect the request.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check cookies
  const jwtCookie = req.cookies.get('jwtCookie')?.value;
  const xsrfToken = req.cookies.get('XSRF-TOKEN')?.value;

  // Protected route: must have valid auth
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log("[MIDDLEWARE] - protected route, checking cookies");

    if (!jwtCookie || !xsrfToken) {
      const loginUrl = new URL('/', req.url);
      
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);

      return res;
    }
  }

  // Public route: already logged in
  if (publicRoutes.includes(pathname) && jwtCookie && xsrfToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

/**
 * Middleware matcher config used by Next.js to determine which routes
 * this middleware applies to.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
