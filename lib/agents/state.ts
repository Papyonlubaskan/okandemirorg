import type { TaskStatus } from './types'

/** İzinli durum geçişleri. Burada olmayan geçiş reddedilir. */
export const TASK_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  queued: ['planning', 'cancelled', 'expired'],
  planning: ['running', 'retry_wait', 'failed', 'cancelled', 'queued'],
  running: ['awaiting_approval', 'retry_wait', 'succeeded', 'failed', 'cancelled', 'queued'],
  awaiting_approval: ['queued', 'running', 'cancelled', 'expired', 'failed'],
  retry_wait: ['queued', 'failed', 'cancelled'],
  succeeded: [],
  failed: [],
  cancelled: [],
  expired: [],
}

export const TERMINAL_STATUSES: readonly TaskStatus[] = ['succeeded', 'failed', 'cancelled', 'expired']

/** Kullanıcının iptal edebileceği durumlar */
export const CANCELLABLE_STATUSES: readonly TaskStatus[] = ['queued', 'planning', 'running', 'awaiting_approval', 'retry_wait']

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false
}

export class InvalidTransitionError extends Error {
  constructor(from: TaskStatus, to: TaskStatus) {
    super(`Geçersiz durum geçişi: ${from} → ${to}`)
    this.name = 'InvalidTransitionError'
  }
}

export function assertTransition(from: TaskStatus, to: TaskStatus): void {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to)
}

/** Kaynak durumlar: `to` hedefine hangi durumlardan geçilebilir (guarded UPDATE için) */
export function sourcesFor(to: TaskStatus): TaskStatus[] {
  return (Object.keys(TASK_TRANSITIONS) as TaskStatus[]).filter((from) => canTransition(from, to))
}

export function isTerminal(status: TaskStatus): boolean {
  return TERMINAL_STATUSES.includes(status)
}
