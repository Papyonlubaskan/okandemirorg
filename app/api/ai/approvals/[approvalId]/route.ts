import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { publicApproval } from '@/lib/ai/serialize'
import { decideApproval } from '@/lib/agents/approvals'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { rateLimitResponse } from '@/lib/api-security'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ approvalId: string }> }

/** GET /api/ai/approvals/:id?workspaceId= — onay ekranı için özet */
export async function GET(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { approvalId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const approval = await ctx.store.getApproval(approvalId, ctx.workspaceId)
  if (!approval) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json({ approval: publicApproval(approval), canDecide: ctx.role !== 'member' })
}

/** POST /api/ai/approvals/:id — { workspaceId?, decision: 'approve'|'reject', payloadHash } */
export async function POST(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { approvalId } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }
  const decision = body.decision
  const payloadHash = typeof body.payloadHash === 'string' ? body.payloadHash : ''
  if ((decision !== 'approve' && decision !== 'reject') || !/^[a-f0-9]{64}$/.test(payloadHash)) {
    return NextResponse.json({ error: 'decision ve payloadHash gerekli' }, { status: 400 })
  }

  const ctx = await requireWorkspace(typeof body.workspaceId === 'string' ? body.workspaceId : null)
  if (isResponse(ctx)) return ctx
  if (!(await checkDbRateLimit(`ai-approval:user:${ctx.user.id}`, 30, 60 * 60 * 1000))) return rateLimitResponse()

  const result = await decideApproval({
    store: ctx.store,
    approvalId,
    workspaceId: ctx.workspaceId,
    userId: ctx.user.id,
    role: ctx.role,
    decision,
    payloadHash,
  })
  if ('code' in result) {
    const status = result.code === 'forbidden' ? 403 : result.code === 'not_found' ? 404 : 409
    await ctx.store
      .audit({ workspaceId: ctx.workspaceId, actorType: 'user', actorId: ctx.user.id, action: 'approval.decision_denied', targetType: 'ai_approval', targetId: approvalId, outcome: 'denied', metadata: { code: result.code } })
      .catch(() => {})
    return NextResponse.json({ error: result.message, code: result.code }, { status })
  }
  return NextResponse.json({ ok: true, status: result.status })
}
