import { NextRequest, NextResponse } from 'next/server';
import { userQ, tokenQ } from '@/lib/db';
import { generateToken, expiresAt } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));

  if (!email?.trim()) {
    return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
  }

  const user = userQ.byEmail.get(email.trim());

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Purge old expired tokens
  tokenQ.purgeExpired.run();

  const token = generateToken();
  tokenQ.create.run({ user_id: user.id, token, expires_at: expiresAt(60) }); // 1 hour

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:3000`;
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // ── In production: send email here via your email service ──────────────────
  // Example (nodemailer, SendGrid, Resend, etc.):
  //   await sendResetEmail({ to: user.email, name: user.first_name, url: resetUrl });

  // ── Dev: expose token in response body so you can test without email ────────
  const isDev = process.env.NODE_ENV !== 'production';
  return NextResponse.json({ ok: true, ...(isDev ? { _devResetUrl: resetUrl } : {}) });
}
