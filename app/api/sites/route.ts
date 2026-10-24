import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'

export const dynamic = 'force-dynamic'

/** GET /api/sites?workspaceId= — workspace siteleri */
export async function GET(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx
  const sites = await ctx.store.listSites(ctx.workspaceId)
  return NextResponse.json({ sites })
}
