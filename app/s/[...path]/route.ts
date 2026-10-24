import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimitResponse } from '@/lib/api-security'
import { isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { SANDBOX_HEADERS } from '@/lib/security/sanitize-html'
import { servePublishedSite } from '@/lib/sites/serve'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 })

/**
 * GET /s/:slug[/:page] — yayındaki müşteri sitesi (site oluşturucu).
 * Geriye uyum: eski onaylı landing taslakları (/s/:slug) da buradan sunulur.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (!isOrchestratorEnabled()) return notFound()
  const { path } = await params
  const [slug, page = '', ...rest] = path
  if (!slug || rest.length || !/^[a-z0-9-]{3,60}$/.test(slug) || !/^$|^[a-z0-9-]{1,40}$/.test(page)) return notFound()
  if (!(await checkDbRateLimit(`site:${getClientIp(request)}`, 240, 60 * 1000))) return rateLimitResponse()

  const store = getStore()
  const notice = request.nextUrl.searchParams.get('gonderildi') === '1' ? 'Mesajınız alındı, teşekkürler!' : undefined
  const res = await servePublishedSite(store, slug, page, notice)
  if (res) return res

  if (!page) {
    const draft = await store.getPublishedDraftBySlug(slug).catch(() => null)
    if (draft) return new NextResponse(draft.html, { status: 200, headers: { ...SANDBOX_HEADERS, 'Cache-Control': 'public, max-age=300' } })
  }
  return notFound()
}
