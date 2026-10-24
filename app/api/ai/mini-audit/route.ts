import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimitResponse } from '@/lib/api-security'
import { isMiniAuditEnabled } from '@/lib/ai/feature'
import { logMiniAuditRequest, normalizeAuditUrl, runMiniAudit } from '@/lib/ai/mini-audit'
import { checkRateLimits } from '@/lib/security/rate-limit'
import { SsrfError, assertPublicUrl } from '@/lib/security/ssrf'

export const dynamic = 'force-dynamic'

const DAY = 24 * 60 * 60 * 1000

/** GET /api/ai/mini-audit — form görünürlüğü (statik sayfa bayrağı çalışma anında öğrenir) */
export async function GET() {
  return NextResponse.json({ enabled: isMiniAuditEnabled() }, { headers: { 'Cache-Control': 'no-store' } })
}

/** POST /api/ai/mini-audit — { url, email } · herkese açık, sıfır model maliyeti, sıkı limitli */
export async function POST(request: NextRequest) {
  if (!isMiniAuditEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }
  const email = String(body.email || '').trim().toLowerCase()
  const url = normalizeAuditUrl(String(body.url || ''))
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return NextResponse.json({ error: 'Geçerli e-posta gerekli' }, { status: 400 })
  }
  if (!url) return NextResponse.json({ error: 'Geçerli URL gerekli' }, { status: 400 })

  const ip = getClientIp(request)
  const ok = await checkRateLimits([
    { key: `mini:ip:${ip}`, limit: 3, windowMs: DAY },
    { key: `mini:email:${email}`, limit: 2, windowMs: DAY },
    { key: 'mini:global', limit: 300, windowMs: DAY },
  ])
  if (!ok) return rateLimitResponse()

  try {
    await assertPublicUrl(url)
  } catch (e) {
    if (e instanceof SsrfError) return NextResponse.json({ error: 'Bu adres denetlenemez' }, { status: 400 })
    throw e
  }

  try {
    const result = await runMiniAudit(url)
    await logMiniAuditRequest(email, url, ip, result.score)
    return NextResponse.json({ success: true, ...result })
  } catch {
    return NextResponse.json({ success: false, error: 'Denetim yapılamadı' }, { status: 500 })
  }
}
