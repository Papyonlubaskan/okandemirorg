import { randomUUID } from 'crypto'
import type { TaskRow, TaskStore } from '@/lib/ai/store-types'
import { canCreateTask, TASK_LIMITS, type WorkspaceRole } from '@/lib/agents/policies'
import { getTaskType } from '@/lib/agents/task-types'

export type EnqueueInput = {
  store: TaskStore
  workspaceId: string
  userId: string
  role: WorkspaceRole
  taskType: string
  input: unknown
  idempotencyKey?: string | null
}

export type EnqueueResult =
  | { ok: true; task: TaskRow; created: boolean }
  | { ok: false; status: number; code: string; message: string }

/**
 * Görevi doğrular, gerekiyorsa krediyi düşer ve kalıcı kuyruğa yazar.
 * Uzun iş HTTP isteği içinde ÇALIŞTIRILMAZ; worker alır.
 * Sıra: idempotency kontrolü → kredi düşümü (ref task:<id>) → kayıt. Kayıt olmazsa kredi iade edilir.
 */
export async function enqueueTask(i: EnqueueInput): Promise<EnqueueResult> {
  if (!canCreateTask(i.role)) return { ok: false, status: 403, code: 'forbidden', message: 'Görev oluşturma yetkiniz yok' }

  const def = getTaskType(i.taskType)
  if (!def) return { ok: false, status: 400, code: 'unknown_task_type', message: 'Bilinmeyen görev türü' }

  const raw = JSON.stringify(i.input ?? {})
  if (Buffer.byteLength(raw) > TASK_LIMITS.maxInputBytes) {
    return { ok: false, status: 413, code: 'input_too_large', message: 'Girdi çok büyük' }
  }
  const parsed = def.inputSchema.safeParse(i.input)
  if (!parsed.success) {
    return { ok: false, status: 400, code: 'invalid_input', message: parsed.error.issues.map((x) => x.message).join('; ').slice(0, 300) }
  }

  const key = i.idempotencyKey?.trim() || null
  if (key && !/^[A-Za-z0-9._:-]{8,128}$/.test(key)) {
    return { ok: false, status: 400, code: 'invalid_idempotency_key', message: 'Idempotency anahtarı 8-128 karakter olmalı' }
  }
  if (key) {
    const existing = await i.store.findTaskByIdempotencyKey(i.workspaceId, key)
    if (existing) return { ok: true, task: existing, created: false }
  }

  const ws = await i.store.getWorkspace(i.workspaceId)
  if (!ws || ws.status !== 'active') return { ok: false, status: 403, code: 'workspace_inactive', message: 'Workspace aktif değil' }

  // Aylık bütçe yalnızca ücretli model harcamasını sınırlar; ücretsiz/şablon yol her zaman açık
  const spent = await i.store.workspaceSpendThisMonth(i.workspaceId)
  const remaining = Math.max(0, ws.monthlyBudgetUsd - spent)
  const budgetUsd = Number(Math.min(TASK_LIMITS.maxCostUsd, remaining).toFixed(6))

  const id = randomUUID()
  const cost = def.creditCost
  if (cost > 0 && !(await i.store.debitCredits(i.workspaceId, cost, `task:${id}`))) {
    return { ok: false, status: 402, code: 'insufficient_credits', message: 'Yetersiz kredi. Paket satın alın veya planınızı yükseltin.' }
  }
  const refund = () => (cost > 0 ? i.store.addCredits(i.workspaceId, cost, 'refund', `refund:${id}`) : Promise.resolve(false))

  let result: { task: TaskRow; created: boolean }
  try {
    result = await i.store.createTask({
      id,
      workspaceId: i.workspaceId,
      createdBy: i.userId,
      taskType: def.type,
      input: parsed.data,
      idempotencyKey: key,
      budgetUsd,
      maxAttempts: TASK_LIMITS.maxAttempts,
      creditsCharged: cost,
    })
  } catch (e) {
    await refund()
    throw e
  }

  // Eşzamanlı aynı anahtar: diğer istek kazandı → bu düşümü iade et
  if (!result.created) {
    await refund()
    return { ok: true, task: result.task, created: false }
  }

  await i.store
    .audit({
      workspaceId: i.workspaceId,
      actorType: 'user',
      actorId: i.userId,
      action: 'task.created',
      targetType: 'ai_task',
      targetId: id,
      outcome: 'ok',
      metadata: { taskType: def.type, budgetUsd, credits: cost },
    })
    .catch(() => {})
  return { ok: true, task: result.task, created: true }
}
