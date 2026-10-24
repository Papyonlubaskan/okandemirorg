import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { publicApproval, publicStep, publicTask } from '@/lib/ai/serialize'
import { CANCELLABLE_STATUSES } from '@/lib/agents/state'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ taskId: string }> }

/** GET /api/ai/tasks/:taskId?workspaceId= — durum, adımlar, bekleyen onaylar */
export async function GET(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { taskId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const task = await ctx.store.getTask(taskId, ctx.workspaceId)
  if (!task) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const [steps, approvals] = await Promise.all([
    ctx.store.listSteps(task.id),
    ctx.store.listPendingApprovals(ctx.workspaceId),
  ])
  return NextResponse.json({
    task: publicTask(task),
    steps: steps.map(publicStep),
    approvals: approvals.filter((a) => a.taskId === task.id).map(publicApproval),
    role: ctx.role,
  })
}

/** DELETE /api/ai/tasks/:taskId?workspaceId= — görevi iptal et */
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { taskId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const cancelled = await ctx.store.cancelTask(taskId, ctx.workspaceId, [...CANCELLABLE_STATUSES])
  if (!cancelled) return NextResponse.json({ error: 'Görev bulunamadı veya iptal edilemez' }, { status: 409 })

  await ctx.store
    .audit({ workspaceId: ctx.workspaceId, actorType: 'user', actorId: ctx.user.id, action: 'task.cancelled', targetType: 'ai_task', targetId: taskId, outcome: 'ok' })
    .catch(() => {})
  return NextResponse.json({ ok: true })
}
