/**
 * Pure-JS JSON-file database — zero native dependencies.
 * Drop-in replacement for the better-sqlite3 version.
 * All operations are synchronous to match the original prepared-statement API.
 */
import fs   from 'fs';
import path from 'path';

const DATA = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });

const USERS_FILE  = path.join(DATA, 'users.json');
const TOKENS_FILE = path.join(DATA, 'reset-tokens.json');

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

// ─── File helpers ─────────────────────────────────────────────────────────────
function readJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  } catch { return fallback; }
}

function writeJson<T>(file: string, data: T) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function now() { return new Date().toISOString().replace('T', ' ').slice(0, 19); }

// ─── Users store ─────────────────────────────────────────────────────────────
function readUsers(): UserRow[] { return readJson<UserRow[]>(USERS_FILE, []); }
function saveUsers(u: UserRow[]) { writeJson(USERS_FILE, u); }

let _userIdSeq = 0;
function nextUserId(): number {
  if (_userIdSeq === 0) {
    const users = readUsers();
    _userIdSeq = users.length ? Math.max(...users.map(u => u.id)) : 0;
  }
  return ++_userIdSeq;
}

// ─── Reset-tokens store ───────────────────────────────────────────────────────
function readTokens(): ResetTokenRow[] { return readJson<ResetTokenRow[]>(TOKENS_FILE, []); }
function saveTokens(t: ResetTokenRow[]) { writeJson(TOKENS_FILE, t); }

let _tokenIdSeq = 0;
function nextTokenId(): number {
  if (_tokenIdSeq === 0) {
    const tokens = readTokens();
    _tokenIdSeq = tokens.length ? Math.max(...tokens.map(t => t.id)) : 0;
  }
  return ++_tokenIdSeq;
}

// ─── Public query objects (same API as the SQLite version) ───────────────────
export const userQ = {
  byEmail: {
    get: (email: string): UserRow | undefined =>
      readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()),
  },
  byId: {
    get: (id: number): UserRow | undefined =>
      readUsers().find(u => u.id === id),
  },
  create: {
    run: (data: {
      first_name: string; last_name: string; email: string;
      phone: string; organization: string; password_hash: string;
    }): { lastInsertRowid: number } => {
      const users = readUsers();
      const id = nextUserId();
      const ts = now();
      users.push({ id, ...data, status: 'active', created_at: ts, updated_at: ts, last_login: null });
      saveUsers(users);
      return { lastInsertRowid: id };
    },
  },
  touchLogin: {
    run: (id: number) => {
      const users = readUsers();
      const u = users.find(u => u.id === id);
      if (u) { u.last_login = now(); saveUsers(users); }
    },
  },
  updatePassword: {
    run: (hash: string, id: number) => {
      const users = readUsers();
      const u = users.find(u => u.id === id);
      if (u) { u.password_hash = hash; u.updated_at = now(); saveUsers(users); }
    },
  },
};

export const tokenQ = {
  create: {
    run: (data: { user_id: number; token: string; expires_at: string }) => {
      const tokens = readTokens();
      tokens.push({ id: nextTokenId(), ...data, used: 0, created_at: now() });
      saveTokens(tokens);
    },
  },
  findValid: {
    get: (token: string): ResetTokenRow | undefined => {
      const t = readTokens().find(t => t.token === token && !t.used);
      if (!t) return undefined;
      // Check expiry (stored as ISO string "YYYY-MM-DD HH:MM:SS")
      return new Date(t.expires_at.replace(' ', 'T') + 'Z') > new Date() ? t : undefined;
    },
  },
  markUsed: {
    run: (token: string) => {
      const tokens = readTokens();
      const t = tokens.find(t => t.token === token);
      if (t) { t.used = 1; saveTokens(tokens); }
    },
  },
  purgeExpired: {
    run: () => {
      const live = readTokens().filter(t =>
        new Date(t.expires_at.replace(' ', 'T') + 'Z') > new Date()
      );
      saveTokens(live);
    },
  },
};
