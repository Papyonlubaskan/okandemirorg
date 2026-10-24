import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimitResponse } from '@/lib/api-security'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { publicTask } from '@/lib/ai/serialize'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { enqueueTask } from '@/lib/jobs/queue'
import { checkRateLimits } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

/** GET /api/ai/tasks?workspaceId= — kullanıcının workspace'indeki son görevler */
export async function GET(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const tasks = await ctx.store.listTasks(ctx.workspaceId, 50)
  return NextResponse.json({ workspaceId: ctx.workspaceId, role: ctx.role, tasks: tasks.map(publicTask) })
}

/** POST /api/ai/tasks — { workspaceId?, taskType, input, idempotencyKey? } → 202 */
export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const ctx = await requireWorkspace(typeof body.workspaceId === 'string' ? body.workspaceId : null)
  if (isResponse(ctx)) return ctx

  const ok = await checkRateLimits([
    { key: `ai-task:user:${ctx.user.id}`, limit: 20, windowMs: 60 * 60 * 1000 },
    { key: `ai-task:ws:${ctx.workspaceId}`, limit: 60, windowMs: 60 * 60 * 1000 },
    { key: `ai-task:ip:${getClientIp(request)}`, limit: 30, windowMs: 60 * 60 * 1000 },
  ])
  if (!ok) return rateLimitResponse()

  const headerKey = request.headers.get('idempotency-key')
  const result = await enqueueTask({
    store: ctx.store,
    workspaceId: ctx.workspaceId,
    userId: ctx.user.id,
    role: ctx.role,
    taskType: String(body.taskType ?? ''),
    input: body.input,
    idempotencyKey: headerKey ?? (typeof body.idempotencyKey === 'string' ? body.idempotencyKey : null),
  })

  if ('code' in result) return NextResponse.json({ error: result.message, code: result.code }, { status: result.status })
  return NextResponse.json({ task: publicTask(result.task), created: result.created }, { status: result.created ? 202 : 200 })
}
