import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'atlas-dev-secret-change-in-production-!!32'
);

const PUBLIC = new Set(['/login', '/register', '/forgot-password', '/reset-password']);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/favicon') ||
    PUBLIC.has(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('atlas_auth')?.value;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      const res = NextResponse.redirect(url);
      res.cookies.set('atlas_auth', '', { maxAge: 0, path: '/' });
      return res;
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  if (pathname !== '/') url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
