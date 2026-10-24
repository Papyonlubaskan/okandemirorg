import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'

export const dynamic = 'force-dynamic'

/** POST /api/sites/:id/unpublish — yayından kaldır (geri alınabilir; owner/admin) */
export async function POST(request: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { siteId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'), { roles: ['owner', 'admin'] })
  if (isResponse(ctx)) return ctx
  const ok = await ctx.store.unpublishSite(siteId, ctx.workspaceId)
  if (!ok) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  await ctx.store
    .audit({ workspaceId: ctx.workspaceId, actorType: 'user', actorId: ctx.user.id, action: 'site.unpublished', targetType: 'site', targetId: siteId, outcome: 'ok' })
    .catch(() => {})
  return NextResponse.json({ ok: true })
}
