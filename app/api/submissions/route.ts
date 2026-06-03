import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const kv = (env as Record<string, unknown>).ATLAS_KV as KVNamespace;

  const list = await kv.list({ prefix: 'sub:' });
  const submissions = await Promise.all(
    list.keys.map((k) => kv.get(k.name, 'json'))
  );

  return NextResponse.json({
    ok: true,
    count: submissions.length,
    submissions: submissions.filter(Boolean),
  });
}
