import { checkRateLimit } from '@/lib/api-security'
import { execute } from '@/lib/mysql'

/**
 * Çok instance'ta tutarlı, MySQL tabanlı sabit pencereli rate limit (tablo: rate_limits, migration 004).
 * DB erişilemezse süreç içi sınırlayıcıya düşer — asla sınırsız olmaz.
 */
export async function checkDbRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (process.env.AI_STORE === 'memory') return checkRateLimit(key, limit, windowMs)

  const windowSec = Math.max(1, Math.round(windowMs / 1000))
  const windowStart = Math.floor(Date.now() / 1000 / windowSec) * windowSec
  try {
    // Yeni satırda insertId=0 (hits=1); var olan satırda LAST_INSERT_ID(hits+1) döner
    const res = await execute(
      `INSERT INTO rate_limits (bucket_key, window_start, hits, expires_at)
       VALUES (?, ?, 1, DATE_ADD(NOW(3), INTERVAL ? SECOND))
       ON DUPLICATE KEY UPDATE hits = LAST_INSERT_ID(hits + 1)`,
      [key.slice(0, 191), windowStart, windowSec * 2]
    )
    const hits = Number(res.insertId) || 1
    if (Math.random() < 0.01) {
      execute('DELETE FROM rate_limits WHERE expires_at < NOW(3) LIMIT 500').catch(() => {})
    }
    return hits <= limit
  } catch {
    return checkRateLimit(key, limit, windowMs)
  }
}

/** Birden fazla kapsamı (kullanıcı, workspace, IP) birlikte kontrol eder; biri doluysa reddeder */
export async function checkRateLimits(
  buckets: { key: string; limit: number; windowMs: number }[]
): Promise<boolean> {
  for (const b of buckets) {
    if (!(await checkDbRateLimit(b.key, b.limit, b.windowMs))) return false
  }
  return true
}
