import type { RowDataPacket } from 'mysql2/promise'
import { crawlUrl, scoreSignals } from '@/lib/ai-audit'
import { execute, queryOne } from '@/lib/mysql'
import { sha256Hex } from '@/lib/security/secrets'

export type MiniAuditResult = {
  url: string
  finalUrl: string
  status: number
  score: number
  topIssues: string[]
  issueCount: number
  cached: boolean
}

export function normalizeAuditUrl(input: string): string | null {
  let u = input.trim()
  if (!u || u.length > 2048 || /\s/.test(u)) return null
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  try {
    const url = new URL(u)
    url.hash = ''
    return url.toString()
  } catch {
    return null
  }
}

/**
 * Ücretsiz mini denetim: model çağrısı YOK (sıfır maliyet), yalnız kural tabanlı skor + ilk 3 sorun.
 * Aynı URL 24 saat önbellekten döner. Tam rapor ücretli üründe.
 */
export async function runMiniAudit(url: string): Promise<MiniAuditResult> {
  const urlHash = sha256Hex(url)
  const cached = await queryOne<RowDataPacket>(
    'SELECT result_json FROM mini_audit_cache WHERE url_hash = ? AND created_at > DATE_SUB(NOW(3), INTERVAL 24 HOUR) LIMIT 1',
    [urlHash]
  ).catch(() => undefined)
  if (cached?.result_json) {
    const r = typeof cached.result_json === 'string' ? JSON.parse(cached.result_json) : cached.result_json
    return { ...(r as MiniAuditResult), cached: true }
  }

  const signals = await crawlUrl(url)
  const { score, issues } = scoreSignals(signals)
  const result: MiniAuditResult = {
    url,
    finalUrl: signals.finalUrl,
    status: signals.status,
    score,
    topIssues: issues.slice(0, 3),
    issueCount: issues.length,
    cached: false,
  }
  await execute(
    `INSERT INTO mini_audit_cache (url_hash, url, result_json) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE result_json = VALUES(result_json), created_at = NOW(3)`,
    [urlHash, url.slice(0, 2048), JSON.stringify(result)]
  ).catch(() => {})
  return result
}

export async function logMiniAuditRequest(email: string, url: string, ip: string, score: number | null): Promise<void> {
  await execute('INSERT INTO mini_audit_requests (email, url, ip_hash, score) VALUES (?, ?, ?, ?)', [
    email.slice(0, 255),
    url.slice(0, 2048),
    sha256Hex(`${process.env.AUTH_SECRET || 'okd'}:${ip}`),
    score,
  ]).catch(() => {})
}
