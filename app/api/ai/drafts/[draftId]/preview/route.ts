import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { SANDBOX_HEADERS } from '@/lib/security/sanitize-html'

export const dynamic = 'force-dynamic'

/** GET /api/ai/drafts/:id/preview?workspaceId= — yalnız workspace üyeleri; sandbox CSP ile (script yok) */
export async function GET(request: NextRequest, { params }: { params: Promise<{ draftId: string }> }) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { draftId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const draft = await ctx.store.getDraft(draftId, ctx.workspaceId)
  if (!draft) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return new NextResponse(draft.html, { status: 200, headers: SANDBOX_HEADERS })
}
