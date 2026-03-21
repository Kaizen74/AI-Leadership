import { SessionState, TeamState, PitStopResult } from './types';

// ---------------------------------------------------------------------------
// Session Store – dual-mode
//
// Production (Vercel):  Uses Upstash Redis.
//                       Supports ALL Vercel integration naming conventions:
//                         • UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//                         • KV_REST_API_URL + KV_REST_API_TOKEN
//                         • REDIS_URL + REDIS_TOKEN
//                       (auto-injected when you connect a Redis / KV store
//                       in the Vercel dashboard → Storage tab)
//
// Local dev / fallback: Uses an in-memory Map (works without any setup)
// ---------------------------------------------------------------------------

const SESSION_TTL = 60 * 60 * 4; // 4 hours – sessions auto-expire

// ---- In-memory fallback ---------------------------------------------------

const memoryStore = new Map<string, SessionState>();

// ---- Redis helpers --------------------------------------------------------

/**
 * Resolve Redis credentials from environment variables.
 * Vercel names them differently depending on how the store was created:
 *   - "Upstash Redis" integration → UPSTASH_REDIS_REST_URL / TOKEN
 *   - "KV" integration           → KV_REST_API_URL / TOKEN
 *   - Manual env vars             → REDIS_URL / REDIS_TOKEN
 */
function getRedisCredentials(): { url: string; token: string } | null {
  const pairs: [string | undefined, string | undefined][] = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
    [process.env.REDIS_URL, process.env.REDIS_TOKEN],
  ];
  for (const [url, token] of pairs) {
    if (url && token) return { url, token };
  }
  return null;
}

let redisClient: import('@upstash/redis').Redis | null = null;
let _credentialsChecked = false;

async function redis(): Promise<import('@upstash/redis').Redis | null> {
  if (redisClient) return redisClient;

  const creds = getRedisCredentials();

  // Log once per cold start so operators can diagnose
  if (!_credentialsChecked) {
    _credentialsChecked = true;
    if (!creds) {
      console.warn(
        '[sessionStore] ⚠ No Redis credentials found. ' +
          'Falling back to in-memory store. ' +
          'Sessions will NOT persist across serverless invocations. ' +
          'To fix: connect an Upstash Redis database in your Vercel project → Storage tab, then redeploy.'
      );
    } else {
      console.log('[sessionStore] ✓ Redis credentials detected – using persistent store.');
    }
  }

  if (!creds) return null;

  try {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({ url: creds.url, token: creds.token });
    return redisClient;
  } catch (err) {
    console.error('[sessionStore] Failed to initialise Redis client:', err);
    return null;
  }
}

function sessionKey(code: string) {
  return `session:${code}`;
}

// ---- Diagnostics ----------------------------------------------------------

export async function storeHealth(): Promise<{
  mode: 'redis' | 'memory';
  connected: boolean;
  envVarsFound: string[];
}> {
  const envVarsFound: string[] = [];
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    envVarsFound.push('UPSTASH_REDIS_REST_*');
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
    envVarsFound.push('KV_REST_API_*');
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN)
    envVarsFound.push('REDIS_*');

  const r = await redis();
  if (!r) return { mode: 'memory', connected: false, envVarsFound };

  try {
    await r.ping();
    return { mode: 'redis', connected: true, envVarsFound };
  } catch {
    return { mode: 'memory', connected: false, envVarsFound };
  }
}

// ---- Public API -----------------------------------------------------------

export async function getSession(code: string): Promise<SessionState | null> {
  const r = await redis();
  if (!r) {
    return memoryStore.get(code) ?? null;
  }
  try {
    const data = await r.get<SessionState>(sessionKey(code));
    return data ?? null;
  } catch (err) {
    console.error('[sessionStore] Redis GET error, falling back to memory:', err);
    return memoryStore.get(code) ?? null;
  }
}

export async function saveSession(session: SessionState): Promise<void> {
  // Always write to memory as a backup
  memoryStore.set(session.code, session);

  const r = await redis();
  if (!r) return;
  try {
    await r.set(sessionKey(session.code), session, { ex: SESSION_TTL });
  } catch (err) {
    console.error('[sessionStore] Redis SET error:', err);
  }
}

export async function deleteSession(code: string): Promise<void> {
  memoryStore.delete(code);

  const r = await redis();
  if (!r) return;
  try {
    await r.del(sessionKey(code));
  } catch (err) {
    console.error('[sessionStore] Redis DEL error:', err);
  }
}
