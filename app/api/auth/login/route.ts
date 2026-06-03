import { NextRequest, NextResponse } from 'next/server';
import { userQ } from '@/lib/db';
import { verifyPassword } from '@/lib/auth-utils';
import { signToken, attachCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email, password, rememberMe } = await req.json().catch(() => ({}));

  if (!email?.trim() || !password) {
    return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 });
  }

  const user = await userQ.byEmail.get(email.trim());
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
  }

  if (user.status !== 'active') {
    return NextResponse.json({ ok: false, error: 'This account has been suspended' }, { status: 403 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
  }

  await userQ.touchLogin.run(user.id);

  const token = await signToken(
    { userId: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name },
    !!rememberMe
  );

  const res = NextResponse.json({ ok: true });
  attachCookie(res, token, !!rememberMe);
  return res;
}
