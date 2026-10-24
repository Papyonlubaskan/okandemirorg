import { sha256Hex } from '@/lib/security/secrets'
import type { TaskStore } from '@/lib/ai/store-types'
import { canApprove, type WorkspaceRole } from './policies'
import type { PlanStep } from './types'

/** Anahtar sırasından bağımsız JSON (hash için) */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const obj = value as Record<string, unknown>
  return `{${Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`
}

/** Onay, tam olarak bu görev + adım + araç + girdiye bağlanır. Girdi değişirse hash değişir → onay geçersiz. */
export function computePayloadHash(taskId: string, step: PlanStep): string {
  return sha256Hex(stableStringify({ taskId, stepKey: step.key, tool: step.tool, input: step.input }))
}

export type DecisionResult =
  | { ok: true; status: 'approved' | 'rejected' }
  | { ok: false; code: 'forbidden' | 'not_found' | 'not_pending' | 'hash_mismatch' | 'expired' | 'conflict'; message: string }

/**
 * Kullanıcı kararı. Sunucu tarafında: rol, onay durumu, süre ve payload hash'i (hem istemcinin gördüğü
 * hem görevin güncel planındaki) doğrulanır.
 */
export async function decideApproval(opts: {
  store: TaskStore
  approvalId: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  decision: 'approve' | 'reject'
  payloadHash: string
}): Promise<DecisionResult> {
  const { store } = opts
  if (!canApprove(opts.role)) return { ok: false, code: 'forbidden', message: 'Onay yetkiniz yok' }

  const approval = await store.getApproval(opts.approvalId, opts.workspaceId)
  if (!approval) return { ok: false, code: 'not_found', message: 'Onay bulunamadı' }
  if (approval.status !== 'pending') return { ok: false, code: 'not_pending', message: 'Onay artık beklemede değil' }
  if (approval.payloadHash !== opts.payloadHash) {
    return { ok: false, code: 'hash_mismatch', message: 'İşlem içeriği değişmiş; yeniden onay gerekli' }
  }

  const task = await store.getTask(approval.taskId, opts.workspaceId)
  const step = task?.plan?.steps.find((s) => s.key === approval.stepKey)
  if (!task || !step || computePayloadHash(task.id, step) !== approval.payloadHash) {
    return { ok: false, code: 'hash_mismatch', message: 'Görev planı değişmiş; yeniden onay gerekli' }
  }

  const status = opts.decision === 'approve' ? 'approved' : 'rejected'
  const decided = await store.decideApproval(opts.approvalId, opts.workspaceId, opts.payloadHash, status, opts.userId)
  if (!decided) return { ok: false, code: 'expired', message: 'Onayın süresi dolmuş veya karar verilmiş' }

  if (status === 'approved') {
    await store.transition(task.id, null, ['awaiting_approval'], 'queued', { nextRunInMs: 0, clearLease: true })
  } else {
    await store.transition(task.id, null, ['awaiting_approval'], 'failed', {
      errorCode: 'approval_rejected',
      errorMessage: 'Kullanıcı işlemi reddetti',
      finishedAt: true,
      clearLease: true,
    })
  }

  await store.audit({
    workspaceId: opts.workspaceId,
    actorType: 'user',
    actorId: opts.userId,
    action: `approval.${status}`,
    targetType: 'ai_approval',
    targetId: opts.approvalId,
    outcome: 'ok',
    metadata: { taskId: task.id, stepKey: approval.stepKey, actionType: approval.actionType },
  })
  return { ok: true, status }
}
