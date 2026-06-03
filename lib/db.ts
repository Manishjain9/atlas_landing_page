/**
 * Cloudflare KV-based storage layer.
 * Replaces the previous fs/JSON implementation which doesn't work on
 * Cloudflare Workers (read-only filesystem, no write persistence).
 *
 * KV key schema:
 *   user:email:{email}   → UserRow JSON
 *   user:id:{id}         → UserRow JSON
 *   users:nextid         → string (auto-increment counter)
 *   token:{hash}         → ResetTokenRow JSON  (with KV TTL)
 *   tokens:nextid        → string
 *   sub:{timestamp}      → Submission JSON
 */
import { getCloudflareContext } from '@opennextjs/cloudflare';

// ─── Row types ────────────────────────────────────────────────────────────────
export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  password_hash: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface ResetTokenRow {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

// ─── KV accessor ─────────────────────────────────────────────────────────────
function getKV(): KVNamespace {
  const { env } = getCloudflareContext();
  const kv = (env as Record<string, unknown>).ATLAS_KV as KVNamespace | undefined;
  if (!kv) throw new Error('ATLAS_KV binding not found. Check wrangler.toml KV namespace configuration.');
  return kv;
}

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

// ─── User store ───────────────────────────────────────────────────────────────
export const userQ = {
  byEmail: {
    get: async (email: string): Promise<UserRow | undefined> => {
      const data = await getKV().get(`user:email:${email.toLowerCase().trim()}`, 'json');
      return (data as UserRow) ?? undefined;
    },
  },
  byId: {
    get: async (id: number): Promise<UserRow | undefined> => {
      const data = await getKV().get(`user:id:${id}`, 'json');
      return (data as UserRow) ?? undefined;
    },
  },
  create: {
    run: async (data: {
      first_name: string; last_name: string; email: string;
      phone: string; organization: string; password_hash: string;
    }): Promise<{ lastInsertRowid: number }> => {
      const kv = getKV();
      const currentId = await kv.get('users:nextid');
      const id = currentId ? parseInt(currentId) + 1 : 1;
      await kv.put('users:nextid', String(id));
      const ts = now();
      const user: UserRow = { id, ...data, status: 'active', created_at: ts, updated_at: ts, last_login: null };
      await kv.put(`user:email:${data.email.toLowerCase()}`, JSON.stringify(user));
      await kv.put(`user:id:${id}`, JSON.stringify(user));
      return { lastInsertRowid: id };
    },
  },
  touchLogin: {
    run: async (id: number) => {
      const kv = getKV();
      const raw = await kv.get(`user:id:${id}`, 'json') as UserRow | null;
      if (raw) {
        raw.last_login = now();
        await kv.put(`user:id:${id}`, JSON.stringify(raw));
        await kv.put(`user:email:${raw.email.toLowerCase()}`, JSON.stringify(raw));
      }
    },
  },
  updatePassword: {
    run: async (hash: string, id: number) => {
      const kv = getKV();
      const raw = await kv.get(`user:id:${id}`, 'json') as UserRow | null;
      if (raw) {
        raw.password_hash = hash;
        raw.updated_at = now();
        await kv.put(`user:id:${id}`, JSON.stringify(raw));
        await kv.put(`user:email:${raw.email.toLowerCase()}`, JSON.stringify(raw));
      }
    },
  },
};

// ─── Reset-token store ────────────────────────────────────────────────────────
export const tokenQ = {
  create: {
    run: async (data: { user_id: number; token: string; expires_at: string }) => {
      const kv = getKV();
      const ttlMs = new Date(data.expires_at.replace(' ', 'T') + 'Z').getTime() - Date.now();
      const ttlSec = Math.max(60, Math.floor(ttlMs / 1000));
      const currentId = await kv.get('tokens:nextid');
      const id = currentId ? parseInt(currentId) + 1 : 1;
      await kv.put('tokens:nextid', String(id));
      const row: ResetTokenRow = { id, ...data, used: 0, created_at: now() };
      await kv.put(`token:${data.token}`, JSON.stringify(row), { expirationTtl: ttlSec });
    },
  },
  findValid: {
    get: async (token: string): Promise<ResetTokenRow | undefined> => {
      const row = await getKV().get(`token:${token}`, 'json') as ResetTokenRow | null;
      if (!row || row.used) return undefined;
      return row;
    },
  },
  markUsed: {
    run: async (token: string) => {
      const kv = getKV();
      const row = await kv.get(`token:${token}`, 'json') as ResetTokenRow | null;
      if (row) {
        row.used = 1;
        await kv.put(`token:${token}`, JSON.stringify(row));
      }
    },
  },
  purgeExpired: {
    // KV TTL handles expiration automatically — no-op
    run: async () => {},
  },
};
