import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimitResponse } from '@/lib/api-security'
import { isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { SANDBOX_HEADERS } from '@/lib/security/sanitize-html'

export const dynamic = 'force-dynamic'

/**
 * GET /s/:slug — onaylı yayınlanmış landing. Sandbox CSP (script yok, opak origin) + noindex:
 * müşteri sayfaları ana alan adının SEO'sunu etkilemez. Özel alan adı sonraki aşamada.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isOrchestratorEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { slug } = await params
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!(await checkDbRateLimit(`site:${getClientIp(request)}`, 120, 60 * 1000))) return rateLimitResponse()

  const draft = await getStore().getPublishedDraftBySlug(slug)
  if (!draft) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(draft.html, { status: 200, headers: { ...SANDBOX_HEADERS, 'Cache-Control': 'public, max-age=300' } })
}
