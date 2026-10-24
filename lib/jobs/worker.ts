import { getAiMode } from '@/lib/ai/catalog'
import { getDefaultProviders, paidModelsAllowed } from '@/lib/ai/gateway'
import type { TaskStore } from '@/lib/ai/store-types'
import { runTask, type OrchestratorDeps, type RunOutcome } from '@/lib/agents/orchestrator'
import { TASK_LIMITS } from '@/lib/agents/policies'
import { getToolRegistry } from '@/lib/agents/registry'
import { PLAN_MONTHLY_CREDITS } from '@/lib/billing/plans'

export type TickResult = {
  recovered: number
  released: number
  expired: number
  processed: { taskId: string; outcome: RunOutcome }[]
}

export function defaultOrchestratorDeps(store: TaskStore): OrchestratorDeps {
  return {
    store,
    registry: getToolRegistry(),
    aiMode: getAiMode(),
    providers: getDefaultProviders(),
    allowPaid: async (task) => paidModelsAllowed(task.budgetUsd - task.costUsd),
  }
}

/**
 * Bir worker turu: süresi dolan lease'leri kurtar, bekleyen retry'ları kuyruğa al, eski onayları düşür,
 * ardından zaman bütçesi içinde en fazla `maxTasks` görev işle. n8n cron veya ayrı worker döngüsü çağırır.
 * Aynı anda birden fazla tick güvenlidir: görev alma atomik lease ile yapılır.
 */
export async function runWorkerTick(
  store: TaskStore,
  opts: { maxTasks?: number; timeBudgetMs?: number; deps?: OrchestratorDeps } = {}
): Promise<TickResult> {
  const maxTasks = opts.maxTasks ?? 3
  const timeBudget = opts.timeBudgetMs ?? 40_000
  const started = Date.now()
  const deps = opts.deps ?? defaultOrchestratorDeps(store)

  const recovered = await store.recoverExpiredLeases()
  const released = await store.releaseDueRetries()
  const expired = await store.expireStaleApprovals().catch(() => 0)
  // Kredi tabloları (migration 005) yoksa görev işlemeyi engellemez
  await store.grantMonthlyPlanCredits(PLAN_MONTHLY_CREDITS).catch(() => 0)

  const processed: TickResult['processed'] = []
  while (processed.length < maxTasks && Date.now() - started < timeBudget) {
    const task = await store.claimNextTask(TASK_LIMITS.leaseMs)
    if (!task) break
    const outcome = await runTask(task, deps)
    processed.push({ taskId: task.id, outcome })
  }
  await store.refundFailedTasks().catch(() => 0)
  return { recovered, released, expired, processed }
}
