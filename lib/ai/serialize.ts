import type { ApprovalRow, StepRow, TaskRow } from './store-types'

/** İstemciye giden görev görünümü: lease, idempotency ve iç alanlar dışarıda */
export function publicTask(t: TaskRow) {
  return {
    id: t.id,
    workspaceId: t.workspaceId,
    taskType: t.taskType,
    status: t.status,
    input: t.input,
    result: t.result,
    errorCode: t.errorCode,
    errorMessage: t.errorMessage,
    attemptCount: t.attemptCount,
    costUsd: t.costUsd,
    modelCalls: t.modelCalls,
    createdAt: t.createdAt,
    finishedAt: t.finishedAt,
  }
}

export function publicStep(s: StepRow) {
  return { stepKey: s.stepKey, tool: s.tool, status: s.status, errorCode: s.errorCode, startedAt: s.startedAt, finishedAt: s.finishedAt }
}

export function publicApproval(a: ApprovalRow) {
  return {
    id: a.id,
    taskId: a.taskId,
    stepKey: a.stepKey,
    actionType: a.actionType,
    payloadHash: a.payloadHash,
    payloadVersion: a.payloadVersion,
    summary: a.summary,
    status: a.status,
    expiresAt: a.expiresAt,
    createdAt: a.createdAt,
  }
}
