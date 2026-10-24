import type { ModelCallRecord } from '@/lib/ai/fallback'
import type { UsageSnapshot } from '@/lib/ai/router'
import type { WorkspaceRole } from '@/lib/agents/policies'
import type { Plan, StepStatus, TaskStatus } from '@/lib/agents/types'

export type WorkspaceRow = {
  id: string
  name: string
  ownerUserId: string
  plan: 'free' | 'starter' | 'pro' | 'agency'
  status: 'active' | 'suspended' | 'cancelled'
  monthlyBudgetUsd: number
}

export type MembershipRow = { workspaceId: string; name: string; role: WorkspaceRole; plan: WorkspaceRow['plan'] }

export type TaskRow = {
  id: string
  workspaceId: string
  createdBy: string | null
  taskType: string
  status: TaskStatus
  input: Record<string, unknown>
  plan: Plan | null
  result: unknown
  errorCode: string | null
  errorMessage: string | null
  /** Başarısız deneme sayısı (lease kurtarma ve retry_wait'te artar) */
  attemptCount: number
  maxAttempts: number
  idempotencyKey: string | null
  leaseOwner: string | null
  budgetUsd: number
  costUsd: number
  modelCalls: number
  creditsCharged: number
  createdAt: Date
  updatedAt: Date
  startedAt: Date | null
  finishedAt: Date | null
  nextRunAt: Date
}

export type NewTask = {
  id: string
  workspaceId: string
  createdBy: string | null
  taskType: string
  input: Record<string, unknown>
  idempotencyKey: string | null
  budgetUsd: number
  maxAttempts: number
  creditsCharged?: number
}

export type ClaimUpsertResult = 'created' | 'rotated' | 'already_claimed'

export type TaskPatch = Partial<{
  plan: Plan
  result: unknown
  errorCode: string | null
  errorMessage: string | null
  costUsd: number
  modelCalls: number
  startedAt: boolean
  finishedAt: boolean
  /** retry_wait için: şimdiden itibaren ms */
  nextRunInMs: number
  incrementAttempt: boolean
  clearLease: boolean
}>

export type StepRow = {
  taskId: string
  stepKey: string
  agentType: string
  tool: string
  status: StepStatus
  input: Record<string, unknown> | null
  output: unknown
  errorCode: string | null
  startedAt: Date | null
  finishedAt: Date | null
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'consumed'

export type ApprovalSummary = { tool: string; summary: string; target?: string; budget?: string; effects?: string[] }

export type ApprovalRow = {
  id: string
  workspaceId: string
  taskId: string
  stepKey: string
  actionType: string
  payloadHash: string
  payloadVersion: number
  summary: ApprovalSummary
  status: ApprovalStatus
  expiresAt: Date
  approvedBy: string | null
  approvedAt: Date | null
  createdAt: Date
}

export type AuditEntry = {
  workspaceId: string | null
  actorType: 'user' | 'system' | 'worker'
  actorId: string | null
  action: string
  targetType: string
  targetId: string | null
  outcome: 'ok' | 'denied' | 'error'
  /** Sır içermemeli; kayıt öncesi redact edilir */
  metadata?: Record<string, unknown>
}

export type UsageReport = {
  since: string
  totalCostUsd: number
  totalCalls: number
  byModel: { provider: string; model: string; calls: number; costUsd: number; errors: number }[]
  tasks: { status: TaskStatus; count: number }[]
}

export interface TaskStore {
  // Workspace
  getWorkspace(workspaceId: string): Promise<WorkspaceRow | null>
  getMembership(userId: string, workspaceId: string): Promise<{ role: WorkspaceRole } | null>
  listMemberships(userId: string): Promise<MembershipRow[]>
  createWorkspace(ws: { id: string; name: string; ownerUserId: string }): Promise<void>

  // Görevler (kullanıcı tarafı sorgular DAİMA workspace ile kapsamlı)
  createTask(task: NewTask): Promise<{ task: TaskRow; created: boolean }>
  getTask(taskId: string, workspaceId: string): Promise<TaskRow | null>
  findTaskByIdempotencyKey(workspaceId: string, key: string): Promise<TaskRow | null>
  listTasks(workspaceId: string, limit: number): Promise<TaskRow[]>
  cancelTask(taskId: string, workspaceId: string, from: TaskStatus[]): Promise<boolean>

  // Worker
  getTaskById(taskId: string): Promise<TaskRow | null>
  claimNextTask(leaseMs: number): Promise<TaskRow | null>
  transition(taskId: string, leaseOwner: string | null, from: TaskStatus[], to: TaskStatus, patch?: TaskPatch): Promise<boolean>
  extendLease(taskId: string, leaseOwner: string, leaseMs: number): Promise<boolean>
  recoverExpiredLeases(): Promise<number>
  releaseDueRetries(): Promise<number>
  expireStaleApprovals(): Promise<number>

  // Adımlar
  upsertSteps(taskId: string, steps: { stepKey: string; agentType: string; tool: string; input: Record<string, unknown> }[]): Promise<void>
  listSteps(taskId: string): Promise<StepRow[]>
  updateStep(taskId: string, stepKey: string, patch: { status: StepStatus; output?: unknown; errorCode?: string | null }): Promise<void>

  // Model çağrıları / kullanım
  recordModelCall(call: ModelCallRecord & { taskId: string | null; workspaceId: string | null }): Promise<void>
  getUsageSnapshot(): Promise<UsageSnapshot>
  workspaceSpendThisMonth(workspaceId: string): Promise<number>
  usageReport(workspaceId: string): Promise<UsageReport>

  // Onaylar
  findLatestApproval(taskId: string, stepKey: string): Promise<ApprovalRow | null>
  createApproval(a: Omit<ApprovalRow, 'createdAt' | 'expiresAt' | 'approvedBy' | 'approvedAt' | 'status'> & { ttlMs: number }): Promise<ApprovalRow>
  getApproval(approvalId: string, workspaceId: string): Promise<ApprovalRow | null>
  listPendingApprovals(workspaceId: string): Promise<ApprovalRow[]>
  /** pending + süresi dolmamış + hash eşleşiyorsa karar verir */
  decideApproval(approvalId: string, workspaceId: string, payloadHash: string, decision: 'approved' | 'rejected', userId: string): Promise<boolean>
  /** approved + süresi dolmamış + hash eşleşiyorsa tek seferlik tüketir */
  consumeApproval(approvalId: string, payloadHash: string): Promise<boolean>

  // Denetim kaydı
  audit(entry: AuditEntry): Promise<void>

  // Kredi / plan (migration 005)
  getCreditBalance(workspaceId: string): Promise<number>
  /** Bakiye yeterliyse düşer; ref benzersiz (aynı ref ikinci kez düşmez) */
  debitCredits(workspaceId: string, amount: number, ref: string): Promise<boolean>
  /** ref daha önce yazıldıysa false */
  addCredits(workspaceId: string, delta: number, reason: 'refund' | 'plan_grant' | 'claim' | 'admin', ref: string): Promise<boolean>
  /** Başarısız/iptal/süresi dolmuş görevlerin kredisini bir kez iade eder */
  refundFailedTasks(): Promise<number>
  /** Aktif ücretli planlara bu ayın hibesini bir kez yazar */
  grantMonthlyPlanCredits(grants: Record<WorkspaceRow['plan'], number>): Promise<number>
  setWorkspacePlan(workspaceId: string, plan: WorkspaceRow['plan'], monthlyBudgetUsd?: number): Promise<boolean>
  /** Yönetim: sahibin e-postasından ilk (kişisel) workspace */
  findWorkspaceIdByOwnerEmail(email: string): Promise<string | null>

  // Claim (ödeme sonrası kredi linki)
  upsertClaim(c: { id: string; tokenHash: string; orderCode: string; productSlug: string; credits: number; ttlMs: number }): Promise<ClaimUpsertResult>
  /** pending + süresi dolmamışsa atomik olarak claimed yapar ve krediyi yükler */
  redeemClaim(tokenHash: string, workspaceId: string): Promise<{ claimId: string; credits: number } | null>
}
