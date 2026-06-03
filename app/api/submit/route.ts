import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      diocese: body.diocese ?? '',
      nameRole: body.nameRole ?? '',
      email: body.email ?? '',
      rating: body.rating ?? 0,
      topFeature: body.topFeature ?? '',
      changeOrAdd: body.changeOrAdd ?? '',
      interests: body.interests ?? [],
    };

    // Read existing submissions
    let submissions: unknown[] = [];
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, 'utf-8');
      try { submissions = JSON.parse(raw); } catch { submissions = []; }
    }

    submissions.push(entry);
    fs.writeFileSync(FILE, JSON.stringify(submissions, null, 2), 'utf-8');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[submit]', err);
    return NextResponse.json({ ok: false, error: 'Failed to save submission' }, { status: 500 });
  }
}
