import { NextRequest, NextResponse } from 'next/server';
import { userQ } from '@/lib/db';
import { hashPassword } from '@/lib/auth-utils';
import { signToken, attachCookie } from '@/lib/session';

function err(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, organization, password, confirmPassword } =
    await req.json().catch(() => ({}));

  if (!firstName?.trim())  return err('First name is required');
  if (!lastName?.trim())   return err('Last name is required');
  if (!email?.trim())      return err('Email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Invalid email address');
  if (!password)           return err('Password is required');
  if (password.length < 8) return err('Password must be at least 8 characters');
  if (password !== confirmPassword) return err('Passwords do not match');

  const existing = await userQ.byEmail.get(email.trim());
  if (existing) return err('An account with this email already exists', 409);

  const password_hash = await hashPassword(password);
  const result = await userQ.create.run({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone ?? '').trim(),
    organization: (organization ?? '').trim(),
    password_hash,
  });

  const userId = result.lastInsertRowid as number;

  const token = await signToken({
    userId,
    email: email.trim().toLowerCase(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  });

  const res = NextResponse.json({ ok: true });
  attachCookie(res, token, false);
  return res;
}
