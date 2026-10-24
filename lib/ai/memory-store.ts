import { randomUUID } from 'crypto'
import type { ModelCallRecord } from '@/lib/ai/fallback'
import type { UsageSnapshot } from '@/lib/ai/router'
import { RATE_LIMIT_EXHAUST_THRESHOLD, usageKey } from '@/lib/ai/usage'
import type { WorkspaceRole } from '@/lib/agents/policies'
import type { TaskStatus } from '@/lib/agents/types'
import type {
  ApprovalRow,
  AuditEntry,
  DraftRow,
  MembershipRow,
  NewTask,
  StepRow,
  TaskPatch,
  TaskRow,
  TaskStore,
  UsageReport,
  WorkspaceRow,
} from './store-types'

type Clock = { now: () => Date }

/** Bellek içi TaskStore: testler ve AI_STORE=memory geliştirme modu. Üretimde kullanılmaz. */
export class MemoryTaskStore implements TaskStore {
  workspaces = new Map<string, WorkspaceRow>()
  members = new Map<string, WorkspaceRole>() // `${ws}|${user}`
  tasks = new Map<string, TaskRow & { leaseUntil: number | null }>()
  steps = new Map<string, StepRow>() // `${task}|${key}`
  calls: (ModelCallRecord & { taskId: string | null; workspaceId: string | null; at: Date })[] = []
  usage = new Map<string, { requests: number; rateLimited: number }>()
  approvals = new Map<string, ApprovalRow>()
  audits: AuditEntry[] = []
  ledger: { workspaceId: string; delta: number; reason: string; ref: string }[] = []
  claims = new Map<string, { id: string; tokenHash: string; orderCode: string; productSlug: string; credits: number; status: 'pending' | 'claimed' | 'expired'; expiresAt: number; workspaceId: string | null }>()

  constructor(private clock: Clock = { now: () => new Date() }) {}

  private now() {
    return this.clock.now()
  }

  // --- Workspace
  async getWorkspace(id: string) {
    return this.workspaces.get(id) ?? null
  }
  async getMembership(userId: string, workspaceId: string) {
    const role = this.members.get(`${workspaceId}|${userId}`)
    return role ? { role } : null
  }
  async listMemberships(userId: string): Promise<MembershipRow[]> {
    const out: MembershipRow[] = []
    for (const [k, role] of this.members) {
      const [ws, u] = k.split('|')
      const w = this.workspaces.get(ws)
      if (u === userId && w) out.push({ workspaceId: ws, name: w.name, role, plan: w.plan })
    }
    return out
  }
  async createWorkspace(ws: { id: string; name: string; ownerUserId: string }) {
    this.workspaces.set(ws.id, { ...ws, plan: 'free', status: 'active', monthlyBudgetUsd: 0.5 })
    this.members.set(`${ws.id}|${ws.ownerUserId}`, 'owner')
  }
  addMember(workspaceId: string, userId: string, role: WorkspaceRole) {
    this.members.set(`${workspaceId}|${userId}`, role)
  }

  // --- Görevler
  async createTask(t: NewTask) {
    if (t.idempotencyKey) {
      for (const existing of this.tasks.values()) {
        if (existing.workspaceId === t.workspaceId && existing.idempotencyKey === t.idempotencyKey) {
          return { task: this.public(existing), created: false }
        }
      }
    }
    const now = this.now()
    const row = {
      ...t,
      creditsCharged: t.creditsCharged ?? 0,
      status: 'queued' as TaskStatus,
      plan: null,
      result: null,
      errorCode: null,
      errorMessage: null,
      attemptCount: 0,
      leaseOwner: null,
      leaseUntil: null,
      costUsd: 0,
      modelCalls: 0,
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      finishedAt: null,
      nextRunAt: now,
    }
    this.tasks.set(t.id, row)
    return { task: this.public(row), created: true }
  }
  private public(t: TaskRow & { leaseUntil: number | null }): TaskRow {
    const { leaseUntil: _l, ...rest } = t
    return structuredClone(rest)
  }
  async getTask(taskId: string, workspaceId: string) {
    const t = this.tasks.get(taskId)
    return t && t.workspaceId === workspaceId ? this.public(t) : null
  }
  async findTaskByIdempotencyKey(workspaceId: string, key: string) {
    const t = [...this.tasks.values()].find((x) => x.workspaceId === workspaceId && x.idempotencyKey === key)
    return t ? this.public(t) : null
  }
  async listTasks(workspaceId: string, limit: number) {
    return [...this.tasks.values()]
      .filter((t) => t.workspaceId === workspaceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map((t) => this.public(t))
  }
  async cancelTask(taskId: string, workspaceId: string, from: TaskStatus[]) {
    const t = this.tasks.get(taskId)
    if (!t || t.workspaceId !== workspaceId || !from.includes(t.status)) return false
    Object.assign(t, { status: 'cancelled', leaseOwner: null, leaseUntil: null, finishedAt: this.now(), updatedAt: this.now() })
    return true
  }

  // --- Worker
  async getTaskById(taskId: string) {
    const t = this.tasks.get(taskId)
    return t ? this.public(t) : null
  }
  async claimNextTask(leaseMs: number) {
    const now = this.now().getTime()
    const next = [...this.tasks.values()]
      .filter((t) => t.status === 'queued' && t.nextRunAt.getTime() <= now)
      .sort((a, b) => a.nextRunAt.getTime() - b.nextRunAt.getTime())[0]
    if (!next) return null
    Object.assign(next, {
      status: 'planning',
      leaseOwner: randomUUID(),
      leaseUntil: now + leaseMs,
      startedAt: next.startedAt ?? this.now(),
      updatedAt: this.now(),
    })
    return this.public(next)
  }
  async transition(taskId: string, leaseOwner: string | null, from: TaskStatus[], to: TaskStatus, patch: TaskPatch = {}) {
    const t = this.tasks.get(taskId)
    if (!t || !from.includes(t.status)) return false
    if (leaseOwner !== null && t.leaseOwner !== leaseOwner) return false
    t.status = to
    if (patch.plan !== undefined) t.plan = structuredClone(patch.plan)
    if (patch.result !== undefined) t.result = structuredClone(patch.result)
    if (patch.errorCode !== undefined) t.errorCode = patch.errorCode
    if (patch.errorMessage !== undefined) t.errorMessage = patch.errorMessage
    if (patch.costUsd !== undefined) t.costUsd = patch.costUsd
    if (patch.modelCalls !== undefined) t.modelCalls = patch.modelCalls
    if (patch.startedAt) t.startedAt = t.startedAt ?? this.now()
    if (patch.finishedAt) t.finishedAt = this.now()
    if (patch.incrementAttempt) t.attemptCount++
    if (patch.nextRunInMs !== undefined) t.nextRunAt = new Date(this.now().getTime() + patch.nextRunInMs)
    if (patch.clearLease) {
      t.leaseOwner = null
      t.leaseUntil = null
    }
    t.updatedAt = this.now()
    return true
  }
  async extendLease(taskId: string, leaseOwner: string, leaseMs: number) {
    const t = this.tasks.get(taskId)
    if (!t || t.leaseOwner !== leaseOwner) return false
    t.leaseUntil = this.now().getTime() + leaseMs
    return true
  }
  async recoverExpiredLeases() {
    const now = this.now().getTime()
    let n = 0
    for (const t of this.tasks.values()) {
      if ((t.status === 'planning' || t.status === 'running') && t.leaseUntil !== null && t.leaseUntil < now) {
        t.attemptCount++
        if (t.attemptCount >= t.maxAttempts) {
          Object.assign(t, { status: 'failed', errorCode: 'lease_expired', errorMessage: 'Worker yanıt vermedi; deneme sınırı doldu', finishedAt: this.now() })
        } else {
          Object.assign(t, { status: 'queued', nextRunAt: this.now() })
        }
        t.leaseOwner = null
        t.leaseUntil = null
        n++
      }
    }
    return n
  }
  async releaseDueRetries() {
    const now = this.now().getTime()
    let n = 0
    for (const t of this.tasks.values()) {
      if (t.status === 'retry_wait' && t.nextRunAt.getTime() <= now) {
        t.status = 'queued'
        n++
      }
    }
    return n
  }
  async expireStaleApprovals() {
    const now = this.now().getTime()
    let n = 0
    for (const a of this.approvals.values()) {
      if ((a.status === 'pending' || a.status === 'approved') && a.expiresAt.getTime() <= now) {
        a.status = 'expired'
        const t = this.tasks.get(a.taskId)
        if (t && t.status === 'awaiting_approval') Object.assign(t, { status: 'expired', errorCode: 'approval_expired', finishedAt: this.now() })
        n++
      }
    }
    return n
  }

  // --- Adımlar
  async upsertSteps(taskId: string, steps: { stepKey: string; agentType: string; tool: string; input: Record<string, unknown> }[]) {
    for (const s of steps) {
      const k = `${taskId}|${s.stepKey}`
      if (!this.steps.has(k)) {
        this.steps.set(k, { taskId, ...s, input: structuredClone(s.input), status: 'pending', output: null, errorCode: null, startedAt: null, finishedAt: null })
      }
    }
  }
  async listSteps(taskId: string) {
    return [...this.steps.values()].filter((s) => s.taskId === taskId).map((s) => structuredClone(s))
  }
  async updateStep(taskId: string, stepKey: string, patch: { status: StepRow['status']; output?: unknown; errorCode?: string | null }) {
    const s = this.steps.get(`${taskId}|${stepKey}`)
    if (!s) return
    s.status = patch.status
    if (patch.output !== undefined) s.output = structuredClone(patch.output)
    if (patch.errorCode !== undefined) s.errorCode = patch.errorCode
    if (patch.status === 'running') s.startedAt = this.now()
    if (patch.status === 'succeeded' || patch.status === 'failed') s.finishedAt = this.now()
  }

  // --- Kullanım
  async recordModelCall(call: ModelCallRecord & { taskId: string | null; workspaceId: string | null }) {
    this.calls.push({ ...call, at: this.now() })
    const k = usageKey(call.provider, call.model)
    const u = this.usage.get(k) ?? { requests: 0, rateLimited: 0 }
    u.requests++
    if (call.status === 'rate_limited') u.rateLimited++
    this.usage.set(k, u)
  }
  async getUsageSnapshot(): Promise<UsageSnapshot> {
    const out: UsageSnapshot = {}
    for (const [k, u] of this.usage) out[k] = { requests: u.requests, exhausted: u.rateLimited >= RATE_LIMIT_EXHAUST_THRESHOLD }
    return out
  }
  async workspaceSpendThisMonth(workspaceId: string) {
    return this.calls.filter((c) => c.workspaceId === workspaceId).reduce((s, c) => s + c.estimatedCost, 0)
  }
  async usageReport(workspaceId: string): Promise<UsageReport> {
    const calls = this.calls.filter((c) => c.workspaceId === workspaceId)
    const byModel = new Map<string, UsageReport['byModel'][number]>()
    for (const c of calls) {
      const k = usageKey(c.provider, c.model)
      const m = byModel.get(k) ?? { provider: c.provider, model: c.model, calls: 0, costUsd: 0, errors: 0 }
      m.calls++
      m.costUsd += c.estimatedCost
      if (c.status !== 'ok') m.errors++
      byModel.set(k, m)
    }
    const counts = new Map<TaskStatus, number>()
    for (const t of this.tasks.values()) if (t.workspaceId === workspaceId) counts.set(t.status, (counts.get(t.status) ?? 0) + 1)
    return {
      since: new Date(this.now().getFullYear(), this.now().getMonth(), 1).toISOString(),
      totalCostUsd: calls.reduce((s, c) => s + c.estimatedCost, 0),
      totalCalls: calls.length,
      byModel: [...byModel.values()],
      tasks: [...counts].map(([status, count]) => ({ status, count })),
    }
  }

  // --- Onaylar
  async findLatestApproval(taskId: string, stepKey: string) {
    const list = [...this.approvals.values()].filter((a) => a.taskId === taskId && a.stepKey === stepKey)
    list.sort((a, b) => b.payloadVersion - a.payloadVersion)
    return list[0] ? structuredClone(list[0]) : null
  }
  async createApproval(a: Omit<ApprovalRow, 'createdAt' | 'expiresAt' | 'approvedBy' | 'approvedAt' | 'status'> & { ttlMs: number }) {
    const { ttlMs, ...rest } = a
    const row: ApprovalRow = {
      ...rest,
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      createdAt: this.now(),
      expiresAt: new Date(this.now().getTime() + ttlMs),
    }
    this.approvals.set(row.id, row)
    return structuredClone(row)
  }
  async getApproval(approvalId: string, workspaceId: string) {
    const a = this.approvals.get(approvalId)
    return a && a.workspaceId === workspaceId ? structuredClone(a) : null
  }
  async listPendingApprovals(workspaceId: string) {
    return [...this.approvals.values()].filter((a) => a.workspaceId === workspaceId && a.status === 'pending').map((a) => structuredClone(a))
  }
  async decideApproval(approvalId: string, workspaceId: string, payloadHash: string, decision: 'approved' | 'rejected', userId: string) {
    const a = this.approvals.get(approvalId)
    if (!a || a.workspaceId !== workspaceId || a.status !== 'pending' || a.payloadHash !== payloadHash) return false
    if (a.expiresAt.getTime() <= this.now().getTime()) return false
    Object.assign(a, { status: decision, approvedBy: userId, approvedAt: this.now() })
    return true
  }
  async consumeApproval(approvalId: string, payloadHash: string) {
    const a = this.approvals.get(approvalId)
    if (!a || a.status !== 'approved' || a.payloadHash !== payloadHash) return false
    if (a.expiresAt.getTime() <= this.now().getTime()) return false
    a.status = 'consumed'
    return true
  }

  async audit(entry: AuditEntry) {
    this.audits.push(structuredClone(entry))
  }

  // --- Kredi / plan
  async getCreditBalance(workspaceId: string) {
    return this.ledger.filter((l) => l.workspaceId === workspaceId).reduce((s, l) => s + l.delta, 0)
  }
  async debitCredits(workspaceId: string, amount: number, ref: string) {
    if (this.ledger.some((l) => l.ref === ref)) return false
    if ((await this.getCreditBalance(workspaceId)) < amount) return false
    this.ledger.push({ workspaceId, delta: -amount, reason: 'task', ref })
    return true
  }
  async addCredits(workspaceId: string, delta: number, reason: 'refund' | 'plan_grant' | 'claim' | 'admin', ref: string) {
    if (this.ledger.some((l) => l.ref === ref)) return false
    this.ledger.push({ workspaceId, delta, reason, ref })
    return true
  }
  async refundFailedTasks() {
    let n = 0
    for (const t of this.tasks.values()) {
      if (['failed', 'cancelled', 'expired'].includes(t.status) && t.creditsCharged > 0) {
        if (await this.addCredits(t.workspaceId, t.creditsCharged, 'refund', `refund:${t.id}`)) n++
      }
    }
    return n
  }
  async grantMonthlyPlanCredits(grants: Record<WorkspaceRow['plan'], number>) {
    const month = this.now().toISOString().slice(0, 7)
    let n = 0
    for (const w of this.workspaces.values()) {
      const amount = grants[w.plan] ?? 0
      if (w.status === 'active' && amount > 0 && (await this.addCredits(w.id, amount, 'plan_grant', `plan:${w.id}:${month}`))) n++
    }
    return n
  }
  async setWorkspacePlan(workspaceId: string, plan: WorkspaceRow['plan'], monthlyBudgetUsd?: number) {
    const w = this.workspaces.get(workspaceId)
    if (!w) return false
    w.plan = plan
    if (monthlyBudgetUsd !== undefined) w.monthlyBudgetUsd = monthlyBudgetUsd
    return true
  }

  drafts = new Map<string, DraftRow>()
  async createDraft(d: Omit<DraftRow, 'status' | 'publishedHash' | 'publishedAt'>) {
    const existing = [...this.drafts.values()].find((x) => d.taskId && x.taskId === d.taskId)
    if (existing) return structuredClone(existing)
    const row: DraftRow = { ...d, status: 'draft', publishedHash: null, publishedAt: null }
    this.drafts.set(d.id, row)
    return structuredClone(row)
  }
  async getDraft(draftId: string, workspaceId: string) {
    const d = this.drafts.get(draftId)
    return d && d.workspaceId === workspaceId ? structuredClone(d) : null
  }
  async getPublishedDraftBySlug(slug: string) {
    const d = [...this.drafts.values()].find((x) => x.slug === slug && x.status === 'published' && x.publishedHash === x.contentHash)
    return d ? structuredClone(d) : null
  }
  async publishDraft(draftId: string, workspaceId: string, contentHash: string) {
    const d = this.drafts.get(draftId)
    if (!d || d.workspaceId !== workspaceId || d.contentHash !== contentHash) return false
    if (d.status !== 'published') Object.assign(d, { status: 'published', publishedHash: contentHash, publishedAt: this.now() })
    return true
  }

  ownerEmails = new Map<string, string>() // email → userId (test)
  async findWorkspaceIdByOwnerEmail(email: string) {
    const userId = this.ownerEmails.get(email.trim().toLowerCase())
    const w = [...this.workspaces.values()].find((x) => x.ownerUserId === userId)
    return w?.id ?? null
  }

  // --- Claim
  async upsertClaim(c: { id: string; tokenHash: string; orderCode: string; productSlug: string; credits: number; ttlMs: number }) {
    const existing = [...this.claims.values()].find((x) => x.orderCode === c.orderCode)
    const expiresAt = this.now().getTime() + c.ttlMs
    if (existing) {
      if (existing.status === 'claimed') return 'already_claimed' as const
      Object.assign(existing, { tokenHash: c.tokenHash, status: 'pending', expiresAt })
      return 'rotated' as const
    }
    this.claims.set(c.id, { ...c, status: 'pending', expiresAt, workspaceId: null })
    return 'created' as const
  }
  async redeemClaim(tokenHash: string, workspaceId: string) {
    const c = [...this.claims.values()].find((x) => x.tokenHash === tokenHash)
    if (!c || c.status !== 'pending' || c.expiresAt <= this.now().getTime()) return null
    c.status = 'claimed'
    c.workspaceId = workspaceId
    await this.addCredits(workspaceId, c.credits, 'claim', `claim:${c.id}`)
    return { claimId: c.id, credits: c.credits }
  }
}
