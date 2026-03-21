import { SessionState, TeamState, PitStopResult } from './types';

// ---------------------------------------------------------------------------
// Session Store – dual-mode
//
// Production (Vercel):  Uses Upstash Redis via environment variables
//                       UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//                       (auto-injected when you connect a Redis store in the
//                       Vercel dashboard)
//
// Local dev / fallback: Uses an in-memory Map (works without any setup)
// ---------------------------------------------------------------------------

const SESSION_TTL = 60 * 60 * 4; // 4 hours – sessions auto-expire

// ---- In-memory fallback ---------------------------------------------------

const memoryStore = new Map<string, SessionState>();

// ---- Redis helpers --------------------------------------------------------

function redisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let redisClient: import('@upstash/redis').Redis | null = null;

async function redis() {
  if (redisClient) return redisClient;
  const { Redis } = await import('@upstash/redis');
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return redisClient;
}

function sessionKey(code: string) {
  return `session:${code}`;
}

// ---- Public API -----------------------------------------------------------

export async function getSession(code: string): Promise<SessionState | null> {
  if (!redisConfigured()) {
    return memoryStore.get(code) ?? null;
  }
  const r = await redis();
  const data = await r.get<SessionState>(sessionKey(code));
  return data ?? null;
}

export async function saveSession(session: SessionState): Promise<void> {
  if (!redisConfigured()) {
    memoryStore.set(session.code, session);
    return;
  }
  const r = await redis();
  await r.set(sessionKey(session.code), session, { ex: SESSION_TTL });
}

export async function deleteSession(code: string): Promise<void> {
  if (!redisConfigured()) {
    memoryStore.delete(code);
    return;
  }
  const r = await redis();
  await r.del(sessionKey(code));
}
