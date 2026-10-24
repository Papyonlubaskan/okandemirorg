import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { findPage, renderSitePage, siteHeaders } from '@/lib/sites/render'

export const dynamic = 'force-dynamic'

/** GET /api/sites/:id/preview?workspaceId=&v=&page= — yalnızca workspace üyeleri, noindex, form pasif */
export async function GET(request: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { siteId } = await params
  const sp = request.nextUrl.searchParams
  const ctx = await requireWorkspace(sp.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const site = await ctx.store.getSite(siteId, ctx.workspaceId)
  if (!site) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  const version = await ctx.store.getSiteVersion(site.id, Number(sp.get('v')) || site.currentVersion)
  if (!version) return NextResponse.json({ error: 'Sürüm yok' }, { status: 404 })
  const page = findPage(version.schema, sp.get('page') || '') ?? version.schema.pages[0]

  const ws = encodeURIComponent(ctx.workspaceId)
  const html = renderSitePage(version.schema, page, {
    basePath: `/api/sites/${site.id}/preview?workspaceId=${ws}&v=${version.version}&page=`,
    preview: true,
  })
  // Önizlemede sayfa linkleri query ile çalışsın diye "/slug" → "slug"
  const fixed = html.replace(/(href="\/api\/sites\/[^"]*?page=)\//g, '$1')
  return new NextResponse(fixed, { status: 200, headers: siteHeaders({ preview: true, indexable: false }) })
}
