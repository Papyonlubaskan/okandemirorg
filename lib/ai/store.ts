import { randomUUID } from 'crypto'
import type { RowDataPacket } from 'mysql2/promise'
import pool, { execute, query, queryOne, type QueryParam } from '@/lib/mysql'
import type { ModelCallRecord } from '@/lib/ai/fallback'
import type { UsageSnapshot } from '@/lib/ai/router'
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { RATE_LIMIT_EXHAUST_THRESHOLD, usageKey } from '@/lib/ai/usage'
import type { WorkspaceRole } from '@/lib/agents/policies'
import type { TaskStatus } from '@/lib/agents/types'
import { redact } from '@/lib/security/secrets'
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

/* Zaman karşılaştırmaları DAİMA MySQL NOW(3) ile yapılır (Node / DB saat dilimi farkından bağımsız). */

type Row = RowDataPacket & Record<string, unknown>

function json<T>(v: unknown): T | null {
  if (v == null) return null
  if (typeof v === 'string') {
    try {
      return JSON.parse(v) as T
    } catch {
      return null
    }
  }
  return v as T
}

function toTask(r: Row): TaskRow {
  return {
    id: String(r.id),
    workspaceId: String(r.workspace_id),
    createdBy: (r.created_by as string) ?? null,
    taskType: String(r.task_type),
    status: r.status as TaskStatus,
    input: json<Record<string, unknown>>(r.input_json) ?? {},
    plan: json(r.plan_json),
    result: json(r.result_json),
    errorCode: (r.error_code as string) ?? null,
    errorMessage: (r.error_message as string) ?? null,
    attemptCount: Number(r.attempt_count),
    maxAttempts: Number(r.max_attempts),
    idempotencyKey: (r.idempotency_key as string) ?? null,
    leaseOwner: (r.lease_owner as string) ?? null,
    budgetUsd: Number(r.budget_usd),
    costUsd: Number(r.cost_usd),
    modelCalls: Number(r.model_calls),
    creditsCharged: Number(r.credits_charged ?? 0),
    createdAt: r.created_at as Date,
    updatedAt: r.updated_at as Date,
    startedAt: (r.started_at as Date) ?? null,
    finishedAt: (r.finished_at as Date) ?? null,
    nextRunAt: r.next_run_at as Date,
  }
}

function toApproval(r: Row): ApprovalRow {
  return {
    id: String(r.id),
    workspaceId: String(r.workspace_id),
    taskId: String(r.task_id),
    stepKey: String(r.step_key),
    actionType: String(r.action_type),
    payloadHash: String(r.payload_hash),
    payloadVersion: Number(r.payload_version),
    summary: json(r.summary_json) ?? { tool: String(r.action_type), summary: '' },
    status: r.status as ApprovalRow['status'],
    expiresAt: r.expires_at as Date,
    approvedBy: (r.approved_by as string) ?? null,
    approvedAt: (r.approved_at as Date) ?? null,
    createdAt: r.created_at as Date,
  }
}

const limit = (n: number) => Math.max(1, Math.min(200, Math.floor(n)))
const placeholders = (n: number) => Array.from({ length: n }, () => '?').join(', ')

export class MysqlTaskStore implements TaskStore {
  // --- Workspace
  async getWorkspace(workspaceId: string): Promise<WorkspaceRow | null> {
    const r = await queryOne<Row>(
      'SELECT id, name, owner_user_id, plan, status, monthly_budget_usd FROM workspaces WHERE id = ? LIMIT 1',
      [workspaceId]
    )
    if (!r) return null
    return {
      id: String(r.id),
      name: String(r.name),
      ownerUserId: String(r.owner_user_id),
      plan: r.plan as WorkspaceRow['plan'],
      status: r.status as WorkspaceRow['status'],
      monthlyBudgetUsd: Number(r.monthly_budget_usd),
    }
  }

  async getMembership(userId: string, workspaceId: string) {
    const r = await queryOne<Row>('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1', [
      workspaceId,
      userId,
    ])
    return r ? { role: r.role as WorkspaceRole } : null
  }

  async listMemberships(userId: string): Promise<MembershipRow[]> {
    const rows = await query<Row>(
      `SELECT w.id, w.name, w.plan, m.role FROM workspace_members m
       JOIN workspaces w ON w.id = m.workspace_id
       WHERE m.user_id = ? AND w.status = 'active' ORDER BY m.created_at ASC`,
      [userId]
    )
    return rows.map((r) => ({ workspaceId: String(r.id), name: String(r.name), plan: r.plan as WorkspaceRow['plan'], role: r.role as WorkspaceRole }))
  }

  async createWorkspace(ws: { id: string; name: string; ownerUserId: string }) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.execute('INSERT INTO workspaces (id, name, owner_user_id) VALUES (?, ?, ?)', [ws.id, ws.name.slice(0, 255), ws.ownerUserId])
      await conn.execute("INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'owner')", [ws.id, ws.ownerUserId])
      await conn.commit()
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  }

  // --- Görevler
  async createTask(t: NewTask) {
    try {
      const credits = t.creditsCharged ?? 0
      // credits_charged kolonu migration 005 ile gelir; kredisiz görevler 005 öncesi de çalışır
      await execute(
        credits > 0
          ? `INSERT INTO ai_tasks (id, workspace_id, created_by, task_type, input_json, idempotency_key, budget_usd, max_attempts, credits_charged)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          : `INSERT INTO ai_tasks (id, workspace_id, created_by, task_type, input_json, idempotency_key, budget_usd, max_attempts)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.workspaceId,
          t.createdBy,
          t.taskType,
          JSON.stringify(t.input),
          t.idempotencyKey,
          t.budgetUsd,
          t.maxAttempts,
          ...(credits > 0 ? [credits] : []),
        ]
      )
      return { task: (await this.getTask(t.id, t.workspaceId))!, created: true }
    } catch (e) {
      if ((e as { errno?: number }).errno === 1062 && t.idempotencyKey) {
        const r = await queryOne<Row>('SELECT * FROM ai_tasks WHERE workspace_id = ? AND idempotency_key = ? LIMIT 1', [
          t.workspaceId,
          t.idempotencyKey,
        ])
        if (r) return { task: toTask(r), created: false }
      }
      throw e
    }
  }

  async getTask(taskId: string, workspaceId: string) {
    const r = await queryOne<Row>('SELECT * FROM ai_tasks WHERE id = ? AND workspace_id = ? LIMIT 1', [taskId, workspaceId])
    return r ? toTask(r) : null
  }

  async findTaskByIdempotencyKey(workspaceId: string, key: string) {
    const r = await queryOne<Row>('SELECT * FROM ai_tasks WHERE workspace_id = ? AND idempotency_key = ? LIMIT 1', [workspaceId, key])
    return r ? toTask(r) : null
  }

  async listTasks(workspaceId: string, n: number) {
    const rows = await query<Row>(`SELECT * FROM ai_tasks WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ${limit(n)}`, [workspaceId])
    return rows.map(toTask)
  }

  async cancelTask(taskId: string, workspaceId: string, from: TaskStatus[]) {
    const res = await execute(
      `UPDATE ai_tasks SET status = 'cancelled', lease_owner = NULL, lease_until = NULL, finished_at = NOW(3)
       WHERE id = ? AND workspace_id = ? AND status IN (${placeholders(from.length)})`,
      [taskId, workspaceId, ...from]
    )
    return res.affectedRows === 1
  }

  // --- Worker
  async getTaskById(taskId: string) {
    const r = await queryOne<Row>('SELECT * FROM ai_tasks WHERE id = ? LIMIT 1', [taskId])
    return r ? toTask(r) : null
  }

  /** Atomik alma: tek UPDATE ... ORDER BY ... LIMIT 1; her sürümde çalışır (SKIP LOCKED gerekmez) */
  async claimNextTask(leaseMs: number) {
    const token = randomUUID()
    const res = await execute(
      `UPDATE ai_tasks
       SET status = 'planning', lease_owner = ?, lease_until = DATE_ADD(NOW(3), INTERVAL ? MICROSECOND),
           started_at = COALESCE(started_at, NOW(3))
       WHERE status = 'queued' AND next_run_at <= NOW(3)
       ORDER BY next_run_at ASC LIMIT 1`,
      [token, leaseMs * 1000]
    )
    if (res.affectedRows !== 1) return null
    const r = await queryOne<Row>("SELECT * FROM ai_tasks WHERE lease_owner = ? AND status = 'planning' LIMIT 1", [token])
    return r ? toTask(r) : null
  }

  async transition(taskId: string, leaseOwner: string | null, from: TaskStatus[], to: TaskStatus, patch: TaskPatch = {}) {
    const sets: string[] = ['status = ?']
    const params: QueryParam[] = [to]
    const set = (sql: string, ...v: QueryParam[]) => {
      sets.push(sql)
      params.push(...v)
    }
    if (patch.plan !== undefined) set('plan_json = ?', JSON.stringify(patch.plan))
    if (patch.result !== undefined) set('result_json = ?', JSON.stringify(patch.result ?? null))
    if (patch.errorCode !== undefined) set('error_code = ?', patch.errorCode)
    if (patch.errorMessage !== undefined) set('error_message = ?', patch.errorMessage?.slice(0, 1000) ?? null)
    if (patch.costUsd !== undefined) set('cost_usd = ?', patch.costUsd)
    if (patch.modelCalls !== undefined) set('model_calls = ?', patch.modelCalls)
    if (patch.startedAt) sets.push('started_at = COALESCE(started_at, NOW(3))')
    if (patch.finishedAt) sets.push('finished_at = NOW(3)')
    if (patch.incrementAttempt) sets.push('attempt_count = attempt_count + 1')
    if (patch.nextRunInMs !== undefined) set('next_run_at = DATE_ADD(NOW(3), INTERVAL ? MICROSECOND)', patch.nextRunInMs * 1000)
    if (patch.clearLease) sets.push('lease_owner = NULL', 'lease_until = NULL')

    let where = `id = ? AND status IN (${placeholders(from.length)})`
    params.push(taskId, ...from)
    if (leaseOwner !== null) {
      where += ' AND lease_owner = ?'
      params.push(leaseOwner)
    }
    const res = await execute(`UPDATE ai_tasks SET ${sets.join(', ')} WHERE ${where}`, params)
    return res.affectedRows === 1
  }

  async extendLease(taskId: string, leaseOwner: string, leaseMs: number) {
    const res = await execute(
      'UPDATE ai_tasks SET lease_until = DATE_ADD(NOW(3), INTERVAL ? MICROSECOND) WHERE id = ? AND lease_owner = ?',
      [leaseMs * 1000, taskId, leaseOwner]
    )
    return res.affectedRows === 1
  }

  async recoverExpiredLeases() {
    // SET sırası önemli: status/error/finished önce eski attempt_count ile hesaplanır
    const res = await execute(
      `UPDATE ai_tasks SET
         status = IF(attempt_count + 1 >= max_attempts, 'failed', 'queued'),
         error_code = IF(attempt_count + 1 >= max_attempts, 'lease_expired', error_code),
         error_message = IF(attempt_count + 1 >= max_attempts, 'Worker yanıt vermedi; deneme sınırı doldu', error_message),
         finished_at = IF(attempt_count + 1 >= max_attempts, NOW(3), finished_at),
         next_run_at = NOW(3),
         lease_owner = NULL, lease_until = NULL,
         attempt_count = attempt_count + 1
       WHERE status IN ('planning', 'running') AND lease_until IS NOT NULL AND lease_until < NOW(3)`
    )
    return res.affectedRows
  }

  async releaseDueRetries() {
    const res = await execute("UPDATE ai_tasks SET status = 'queued' WHERE status = 'retry_wait' AND next_run_at <= NOW(3)")
    return res.affectedRows
  }

  async expireStaleApprovals() {
    const res = await execute(
      `UPDATE ai_tasks t JOIN ai_approvals a ON a.task_id = t.id
       SET t.status = 'expired', t.error_code = 'approval_expired', t.finished_at = NOW(3), a.status = 'expired'
       WHERE t.status = 'awaiting_approval' AND a.status = 'pending' AND a.expires_at <= NOW(3)`
    )
    const res2 = await execute("UPDATE ai_approvals SET status = 'expired' WHERE status IN ('pending', 'approved') AND expires_at <= NOW(3)")
    return res.affectedRows + res2.affectedRows
  }

  // --- Adımlar
  async upsertSteps(taskId: string, steps: { stepKey: string; agentType: string; tool: string; input: Record<string, unknown> }[]) {
    for (const s of steps) {
      await execute(
        `INSERT IGNORE INTO ai_task_steps (task_id, step_key, agent_type, tool, input_json) VALUES (?, ?, ?, ?, ?)`,
        [taskId, s.stepKey, s.agentType, s.tool, JSON.stringify(s.input)]
      )
    }
  }

  async listSteps(taskId: string): Promise<StepRow[]> {
    const rows = await query<Row>('SELECT * FROM ai_task_steps WHERE task_id = ? ORDER BY id ASC', [taskId])
    return rows.map((r) => ({
      taskId: String(r.task_id),
      stepKey: String(r.step_key),
      agentType: String(r.agent_type),
      tool: String(r.tool),
      status: r.status as StepRow['status'],
      input: json(r.input_json),
      output: json(r.output_json),
      errorCode: (r.error_code as string) ?? null,
      startedAt: (r.started_at as Date) ?? null,
      finishedAt: (r.finished_at as Date) ?? null,
    }))
  }

  async updateStep(taskId: string, stepKey: string, patch: { status: StepRow['status']; output?: unknown; errorCode?: string | null }) {
    const sets = ['status = ?']
    const params: QueryParam[] = [patch.status]
    if (patch.output !== undefined) {
      sets.push('output_json = ?')
      params.push(JSON.stringify(patch.output ?? null))
    }
    if (patch.errorCode !== undefined) {
      sets.push('error_code = ?')
      params.push(patch.errorCode)
    }
    if (patch.status === 'running') sets.push('started_at = NOW(3)')
    if (patch.status === 'succeeded' || patch.status === 'failed') sets.push('finished_at = NOW(3)')
    await execute(`UPDATE ai_task_steps SET ${sets.join(', ')} WHERE task_id = ? AND step_key = ?`, [...params, taskId, stepKey])
  }

  // --- Model çağrıları / kullanım
  async recordModelCall(c: ModelCallRecord & { taskId: string | null; workspaceId: string | null }) {
    await execute(
      `INSERT INTO ai_model_calls (task_id, workspace_id, provider, model, purpose, input_tokens, output_tokens,
         estimated_cost, latency_ms, status, error_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.taskId,
        c.workspaceId,
        c.provider,
        c.model.slice(0, 128),
        c.purpose,
        c.inputTokens ?? null,
        c.outputTokens ?? null,
        c.estimatedCost,
        Math.max(0, Math.round(c.latencyMs)),
        c.status,
        c.errorCode ?? null,
      ]
    )
    const isError = c.status === 'ok' ? 0 : 1
    const isRateLimited = c.status === 'rate_limited' ? 1 : 0
    await execute(
      `INSERT INTO provider_usage (provider, model, period, request_count, error_count, rate_limited_count,
         input_tokens, output_tokens, estimated_cost)
       VALUES (?, ?, DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d'), 1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         request_count = request_count + 1,
         error_count = error_count + VALUES(error_count),
         rate_limited_count = rate_limited_count + VALUES(rate_limited_count),
         input_tokens = input_tokens + VALUES(input_tokens),
         output_tokens = output_tokens + VALUES(output_tokens),
         estimated_cost = estimated_cost + VALUES(estimated_cost),
         quota_status = IF(rate_limited_count >= ?, 'exhausted', quota_status)`,
      [c.provider, c.model.slice(0, 128), isError, isRateLimited, c.inputTokens ?? 0, c.outputTokens ?? 0, c.estimatedCost, RATE_LIMIT_EXHAUST_THRESHOLD]
    )
  }

  async getUsageSnapshot(): Promise<UsageSnapshot> {
    const rows = await query<Row>(
      "SELECT provider, model, request_count, quota_status FROM provider_usage WHERE period = DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d')"
    )
    const out: UsageSnapshot = {}
    for (const r of rows) {
      out[usageKey(String(r.provider), String(r.model))] = { requests: Number(r.request_count), exhausted: r.quota_status === 'exhausted' }
    }
    return out
  }

  async workspaceSpendThisMonth(workspaceId: string) {
    const r = await queryOne<Row>(
      "SELECT COALESCE(SUM(estimated_cost), 0) AS total FROM ai_model_calls WHERE workspace_id = ? AND created_at >= DATE_FORMAT(NOW(3), '%Y-%m-01')",
      [workspaceId]
    )
    return Number(r?.total ?? 0)
  }

  async usageReport(workspaceId: string): Promise<UsageReport> {
    const since = "DATE_FORMAT(NOW(3), '%Y-%m-01')"
    const byModel = await query<Row>(
      `SELECT provider, model, COUNT(*) AS calls, COALESCE(SUM(estimated_cost), 0) AS cost, SUM(status <> 'ok') AS errors
       FROM ai_model_calls WHERE workspace_id = ? AND created_at >= ${since} GROUP BY provider, model ORDER BY calls DESC`,
      [workspaceId]
    )
    const tasks = await query<Row>(
      `SELECT status, COUNT(*) AS n FROM ai_tasks WHERE workspace_id = ? AND created_at >= ${since} GROUP BY status`,
      [workspaceId]
    )
    const sinceRow = await queryOne<Row>(`SELECT ${since} AS s`)
    return {
      since: String(sinceRow?.s ?? ''),
      totalCostUsd: byModel.reduce((s, r) => s + Number(r.cost), 0),
      totalCalls: byModel.reduce((s, r) => s + Number(r.calls), 0),
      byModel: byModel.map((r) => ({
        provider: String(r.provider),
        model: String(r.model),
        calls: Number(r.calls),
        costUsd: Number(r.cost),
        errors: Number(r.errors),
      })),
      tasks: tasks.map((r) => ({ status: r.status as TaskStatus, count: Number(r.n) })),
    }
  }

  // --- Onaylar
  async findLatestApproval(taskId: string, stepKey: string) {
    const r = await queryOne<Row>(
      'SELECT * FROM ai_approvals WHERE task_id = ? AND step_key = ? ORDER BY payload_version DESC LIMIT 1',
      [taskId, stepKey]
    )
    return r ? toApproval(r) : null
  }

  async createApproval(a: Omit<ApprovalRow, 'createdAt' | 'expiresAt' | 'approvedBy' | 'approvedAt' | 'status'> & { ttlMs: number }) {
    await execute(
      `INSERT INTO ai_approvals (id, workspace_id, task_id, step_key, action_type, payload_hash, payload_version, summary_json, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(3), INTERVAL ? MICROSECOND))`,
      [a.id, a.workspaceId, a.taskId, a.stepKey, a.actionType, a.payloadHash, a.payloadVersion, JSON.stringify(a.summary), a.ttlMs * 1000]
    )
    return (await this.getApproval(a.id, a.workspaceId))!
  }

  async getApproval(approvalId: string, workspaceId: string) {
    const r = await queryOne<Row>('SELECT * FROM ai_approvals WHERE id = ? AND workspace_id = ? LIMIT 1', [approvalId, workspaceId])
    return r ? toApproval(r) : null
  }

  async listPendingApprovals(workspaceId: string) {
    const rows = await query<Row>(
      "SELECT * FROM ai_approvals WHERE workspace_id = ? AND status = 'pending' AND expires_at > NOW(3) ORDER BY created_at DESC LIMIT 50",
      [workspaceId]
    )
    return rows.map(toApproval)
  }

  async decideApproval(approvalId: string, workspaceId: string, payloadHash: string, decision: 'approved' | 'rejected', userId: string) {
    const res = await execute(
      `UPDATE ai_approvals SET status = ?, approved_by = ?, approved_at = NOW(3)
       WHERE id = ? AND workspace_id = ? AND status = 'pending' AND payload_hash = ? AND expires_at > NOW(3)`,
      [decision, userId, approvalId, workspaceId, payloadHash]
    )
    return res.affectedRows === 1
  }

  async consumeApproval(approvalId: string, payloadHash: string) {
    const res = await execute(
      "UPDATE ai_approvals SET status = 'consumed' WHERE id = ? AND status = 'approved' AND payload_hash = ? AND expires_at > NOW(3)",
      [approvalId, payloadHash]
    )
    return res.affectedRows === 1
  }

  async audit(e: AuditEntry) {
    await execute(
      `INSERT INTO audit_logs (workspace_id, actor_type, actor_id, action, target_type, target_id, outcome, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.workspaceId,
        e.actorType,
        e.actorId,
        e.action.slice(0, 64),
        e.targetType.slice(0, 64),
        e.targetId?.slice(0, 64) ?? null,
        e.outcome,
        e.metadata ? JSON.stringify(redact(e.metadata)) : null,
      ]
    )
  }

  // --- Kredi / plan
  async getCreditBalance(workspaceId: string) {
    const r = await queryOne<Row>('SELECT COALESCE(SUM(delta), 0) AS balance FROM credit_ledger WHERE workspace_id = ?', [workspaceId])
    return Number(r?.balance ?? 0)
  }

  /** Workspace satırı FOR UPDATE ile kilitlenir: eşzamanlı düşümler bakiyeyi eksiye çekemez */
  async debitCredits(workspaceId: string, amount: number, ref: string) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.execute('SELECT id FROM workspaces WHERE id = ? FOR UPDATE', [workspaceId])
      const [rows] = await conn.execute<Row[]>('SELECT COALESCE(SUM(delta), 0) AS balance FROM credit_ledger WHERE workspace_id = ?', [workspaceId])
      if (Number(rows[0]?.balance ?? 0) < amount) {
        await conn.rollback()
        return false
      }
      await conn.execute("INSERT INTO credit_ledger (workspace_id, delta, reason, ref) VALUES (?, ?, 'task', ?)", [workspaceId, -amount, ref])
      await conn.commit()
      return true
    } catch (e) {
      await conn.rollback()
      if ((e as { errno?: number }).errno === 1062) return false
      throw e
    } finally {
      conn.release()
    }
  }

  async addCredits(workspaceId: string, delta: number, reason: 'refund' | 'plan_grant' | 'claim' | 'admin', ref: string) {
    const res = await execute('INSERT IGNORE INTO credit_ledger (workspace_id, delta, reason, ref) VALUES (?, ?, ?, ?)', [
      workspaceId,
      delta,
      reason,
      ref.slice(0, 128),
    ])
    return res.affectedRows === 1
  }

  async refundFailedTasks() {
    const res = await execute(
      `INSERT IGNORE INTO credit_ledger (workspace_id, delta, reason, ref)
       SELECT workspace_id, credits_charged, 'refund', CONCAT('refund:', id) FROM ai_tasks
       WHERE status IN ('failed', 'cancelled', 'expired') AND credits_charged > 0
         AND updated_at >= DATE_SUB(NOW(3), INTERVAL 30 DAY)`
    )
    return res.affectedRows
  }

  async grantMonthlyPlanCredits(grants: Record<WorkspaceRow['plan'], number>) {
    const res = await execute(
      `INSERT IGNORE INTO credit_ledger (workspace_id, delta, reason, ref)
       SELECT id, CASE plan WHEN 'starter' THEN ? WHEN 'pro' THEN ? WHEN 'agency' THEN ? ELSE 0 END, 'plan_grant',
              CONCAT('plan:', id, ':', DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m'))
       FROM workspaces WHERE status = 'active' AND plan IN ('starter', 'pro', 'agency')`,
      [grants.starter, grants.pro, grants.agency]
    )
    return res.affectedRows
  }

  async setWorkspacePlan(workspaceId: string, plan: WorkspaceRow['plan'], monthlyBudgetUsd?: number) {
    const res =
      monthlyBudgetUsd === undefined
        ? await execute('UPDATE workspaces SET plan = ? WHERE id = ?', [plan, workspaceId])
        : await execute('UPDATE workspaces SET plan = ?, monthly_budget_usd = ? WHERE id = ?', [plan, monthlyBudgetUsd, workspaceId])
    return res.affectedRows === 1
  }

  async findWorkspaceIdByOwnerEmail(email: string) {
    const r = await queryOne<Row>(
      `SELECT w.id FROM workspaces w JOIN users u ON u.id = w.owner_user_id
       WHERE u.email = ? ORDER BY w.created_at ASC LIMIT 1`,
      [email.trim().toLowerCase()]
    )
    return r ? String(r.id) : null
  }

  // --- Claim
  async upsertClaim(c: { id: string; tokenHash: string; orderCode: string; productSlug: string; credits: number; ttlMs: number }) {
    const existing = await queryOne<Row>('SELECT status FROM workspace_claims WHERE order_code = ? LIMIT 1', [c.orderCode])
    if (existing?.status === 'claimed') return 'already_claimed' as const
    if (existing) {
      await execute(
        `UPDATE workspace_claims SET token_hash = ?, status = 'pending', expires_at = DATE_ADD(NOW(3), INTERVAL ? MICROSECOND)
         WHERE order_code = ? AND status <> 'claimed'`,
        [c.tokenHash, c.ttlMs * 1000, c.orderCode]
      )
      return 'rotated' as const
    }
    await execute(
      `INSERT INTO workspace_claims (id, token_hash, order_code, product_slug, credits, expires_at)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(3), INTERVAL ? MICROSECOND))`,
      [c.id, c.tokenHash, c.orderCode, c.productSlug, c.credits, c.ttlMs * 1000]
    )
    return 'created' as const
  }

  // --- Site taslakları
  private toDraft(r: Row): DraftRow {
    return {
      id: String(r.id),
      workspaceId: String(r.workspace_id),
      taskId: (r.task_id as string) ?? null,
      slug: String(r.slug),
      title: String(r.title),
      html: String(r.html),
      contentHash: String(r.content_hash),
      status: r.status as DraftRow['status'],
      publishedHash: (r.published_hash as string) ?? null,
      publishedAt: (r.published_at as Date) ?? null,
    }
  }

  async createDraft(d: Omit<DraftRow, 'status' | 'publishedHash' | 'publishedAt'>) {
    if (d.taskId) {
      const existing = await queryOne<Row>('SELECT * FROM site_drafts WHERE task_id = ? LIMIT 1', [d.taskId])
      if (existing) return this.toDraft(existing)
    }
    await execute(
      'INSERT INTO site_drafts (id, workspace_id, task_id, slug, title, html, content_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [d.id, d.workspaceId, d.taskId, d.slug, d.title.slice(0, 255), d.html, d.contentHash]
    )
    return (await this.getDraft(d.id, d.workspaceId))!
  }

  async getDraft(draftId: string, workspaceId: string) {
    const r = await queryOne<Row>('SELECT * FROM site_drafts WHERE id = ? AND workspace_id = ? LIMIT 1', [draftId, workspaceId])
    return r ? this.toDraft(r) : null
  }

  async getPublishedDraftBySlug(slug: string) {
    const r = await queryOne<Row>(
      "SELECT * FROM site_drafts WHERE slug = ? AND status = 'published' AND published_hash = content_hash LIMIT 1",
      [slug]
    )
    return r ? this.toDraft(r) : null
  }

  async publishDraft(draftId: string, workspaceId: string, contentHash: string) {
    await execute(
      `UPDATE site_drafts SET status = 'published', published_hash = content_hash, published_at = COALESCE(published_at, NOW(3))
       WHERE id = ? AND workspace_id = ? AND content_hash = ?`,
      [draftId, workspaceId, contentHash]
    )
    const r = await queryOne<Row>(
      "SELECT id FROM site_drafts WHERE id = ? AND workspace_id = ? AND status = 'published' AND published_hash = ? LIMIT 1",
      [draftId, workspaceId, contentHash]
    )
    return Boolean(r)
  }

  async redeemClaim(tokenHash: string, workspaceId: string) {
    const claim = await queryOne<Row>('SELECT id, credits FROM workspace_claims WHERE token_hash = ? LIMIT 1', [tokenHash])
    if (!claim) return null
    const res = await execute(
      `UPDATE workspace_claims SET status = 'claimed', claimed_workspace_id = ?, claimed_at = NOW(3)
       WHERE id = ? AND status = 'pending' AND expires_at > NOW(3)`,
      [workspaceId, claim.id]
    )
    if (res.affectedRows !== 1) return null
    await this.addCredits(workspaceId, Number(claim.credits), 'claim', `claim:${claim.id}`)
    return { claimId: String(claim.id), credits: Number(claim.credits) }
  }
}

let instance: TaskStore | null = null

/** AI_STORE=memory yalnızca production dışında (geliştirme/test) */
export function getStore(): TaskStore {
  if (!instance) {
    instance =
      process.env.AI_STORE === 'memory' && process.env.NODE_ENV !== 'production' ? new MemoryTaskStore() : new MysqlTaskStore()
  }
  return instance
}

/** Test: store'u değiştir */
export function setStoreForTests(store: TaskStore | null): void {
  instance = store
}
