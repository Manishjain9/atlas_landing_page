import { NextRequest, NextResponse } from 'next/server';
import { tokenQ, userQ } from '@/lib/db';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json().catch(() => ({}));

  if (!token)    return NextResponse.json({ ok: false, error: 'Reset token is required' }, { status: 400 });
  if (!password) return NextResponse.json({ ok: false, error: 'Password is required' }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ ok: false, error: 'Password must be at least 8 characters' }, { status: 400 });
  if (password !== confirmPassword)
    return NextResponse.json({ ok: false, error: 'Passwords do not match' }, { status: 400 });

  const row = tokenQ.findValid.get(token);
  if (!row) {
    return NextResponse.json({ ok: false, error: 'This reset link has expired or is invalid' }, { status: 400 });
  }

  const hash = await hashPassword(password);
  userQ.updatePassword.run(hash, row.user_id);
  tokenQ.markUsed.run(token);

  return NextResponse.json({ ok: true });
}
