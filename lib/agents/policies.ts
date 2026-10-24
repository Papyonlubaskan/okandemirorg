import type { ToolRisk } from './types'

/** Görev başı sert sınırlar (env ile daraltılabilir, gevşetilemez üst sınırlar kodda) */
export const TASK_LIMITS = {
  maxSteps: 3,
  maxModelCalls: 4,
  maxCostUsd: Math.min(Number(process.env.AI_TASK_MAX_COST_USD || 0.05), 1),
  timeoutMs: 60_000,
  maxOutputBytes: 200_000,
  maxInputBytes: 20_000,
  maxAttempts: 3,
  leaseMs: 90_000,
} as const

export const APPROVAL_TTL_MS = 24 * 60 * 60 * 1000

/** Varsayılan politika: taslak/analiz otomatik; yayın, harcama ve silme açık onay ister */
const APPROVAL_REQUIRED: Record<ToolRisk, boolean> = {
  safe: false,
  side_effect: false,
  publish: true,
  spend: true,
  destructive: true,
}

export function requiresApproval(risk: ToolRisk): boolean {
  return APPROVAL_REQUIRED[risk]
}

export type WorkspaceRole = 'owner' | 'admin' | 'member'

export function canCreateTask(role: WorkspaceRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'member'
}

export function canApprove(role: WorkspaceRole): boolean {
  return role === 'owner' || role === 'admin'
}

export function canViewUsage(role: WorkspaceRole): boolean {
  return role === 'owner' || role === 'admin'
}

/** Yeniden deneme bekleme süresi (üstel, en fazla 10 dk) */
export function retryBackoffMs(attempt: number): number {
  return Math.min(30_000 * 2 ** Math.max(0, attempt - 1), 10 * 60_000)
}
