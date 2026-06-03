import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { BrevoClient } from '@getbrevo/brevo';

async function appendToFile(entry: object) {
  try {
    const fs   = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'submissions.json');
    const dir  = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, 'utf-8'))
      : [];
    existing.push(entry);
    fs.writeFileSync(file, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (e) {
    console.error('[submit] file write failed', e);
  }
}

const NOTIFY_TO = [
  { email: 'mj90155@gmail.com',               name: 'Manish' },
  { email: 'info@givecentral.org',             name: 'GiveCentral' },
  { email: 'info@nuclaysolutions.com',         name: 'Nuclay' },
  { email: 'manishjain@nuclaysolutions.com',   name: 'Manish Jain' },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, any>;

    let kv: KVNamespace | undefined;
    let brevoKey = process.env.BREVO_API_KEY ?? '';
    let senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@nuclaysolutions.com';
    let senderName  = process.env.BREVO_SENDER_NAME  ?? 'Atlas CRM';

    try {
      const { env } = getCloudflareContext();
      kv = (env as Record<string, unknown>).ATLAS_KV as KVNamespace;
      brevoKey    = ((env as Record<string, unknown>).BREVO_API_KEY     as string) || brevoKey;
      senderEmail = ((env as Record<string, unknown>).BREVO_SENDER_EMAIL as string) || senderEmail;
      senderName  = ((env as Record<string, unknown>).BREVO_SENDER_NAME  as string) || senderName;
    } catch {
      // local Next.js dev — env vars come from process.env
    }

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      diocese:     body.diocese     ?? '',
      nameRole:    body.nameRole    ?? '',
      email:       body.email       ?? '',
      rating:      body.rating      ?? 0,
      topFeature:  body.topFeature  ?? '',
      changeOrAdd: body.changeOrAdd ?? '',
      interests:   body.interests   ?? [],
    };

    if (kv) {
      await kv.put(`sub:${entry.id}`, JSON.stringify(entry));
    } else {
      appendToFile(entry);
    }

    if (brevoKey) {
      try {
        const brevo = new BrevoClient({ apiKey: brevoKey });
        await brevo.transactionalEmails.sendTransacEmail({
          sender:  { email: senderEmail, name: senderName },
          to:      NOTIFY_TO,
          subject: 'New Atlas CRM Form Submission',
          htmlContent: `
            <h2 style="font-family:sans-serif;">New Atlas CRM Form Submission</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Submitted At</td><td style="padding:8px;border:1px solid #ddd;">${entry.submittedAt}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Diocese</td><td style="padding:8px;border:1px solid #ddd;">${entry.diocese}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name / Role</td><td style="padding:8px;border:1px solid #ddd;">${entry.nameRole}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${entry.email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Rating</td><td style="padding:8px;border:1px solid #ddd;">${entry.rating} / 5</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Top Feature</td><td style="padding:8px;border:1px solid #ddd;">${entry.topFeature}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Change / Add</td><td style="padding:8px;border:1px solid #ddd;">${entry.changeOrAdd}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Interests</td><td style="padding:8px;border:1px solid #ddd;">${Array.isArray(entry.interests) ? entry.interests.join(', ') : entry.interests}</td></tr>
            </table>
          `,
        });
      } catch (emailErr) {
        console.error('[submit] email failed (submission still saved)', emailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[submit]', err);
    return NextResponse.json({ ok: false, error: 'Failed to save submission' }, { status: 500 });
  }
}
