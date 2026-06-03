import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const COOKIE = 'atlas_auth';

function secret() {
  const raw = process.env.JWT_SECRET ?? 'atlas-dev-secret-change-in-production-!!32';
  return new TextEncoder().encode(raw);
}

export interface SessionUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

const SEVEN_DAYS  = 7  * 24 * 60 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

export async function signToken(payload: SessionUser, rememberMe = false): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + (rememberMe ? THIRTY_DAYS : SEVEN_DAYS);
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

/** Read session from request cookies (server components / route handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Attach the auth cookie to a NextResponse. */
export function attachCookie(res: NextResponse, token: string, rememberMe = false) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? THIRTY_DAYS : SEVEN_DAYS,
    path: '/',
  });
}

/** Remove the auth cookie from a NextResponse. */
export function clearCookie(res: NextResponse) {
  res.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
}
