import type { z } from 'zod'
import type { AiMode } from '@/lib/ai/catalog'
import type { TaskLlm } from '@/lib/ai/fallback'

export type TaskStatus =
  | 'queued'
  | 'planning'
  | 'running'
  | 'awaiting_approval'
  | 'retry_wait'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'expired'

export type StepStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped' | 'awaiting_approval'

/** safe: okuma/taslak · side_effect: geri alınabilir yazma · publish/spend/destructive: onay zorunlu */
export type ToolRisk = 'safe' | 'side_effect' | 'publish' | 'spend' | 'destructive'

export type PlanStep = { key: string; tool: string; input: Record<string, unknown> }

export type Plan = { version: 1; taskType: string; steps: PlanStep[]; notes?: string }

export type ToolContext = {
  taskId: string
  workspaceId: string
  stepKey: string
  /** Aynı adım tekrar çalışsa bile tek etki için: `${taskId}:${stepKey}` */
  idempotencyKey: string
  signal: AbortSignal
  aiMode: AiMode
  /** Model çağrısı (bütçe/limit kontrollü). aiMode=off ise null */
  llm: TaskLlm | null
  /** Önceki adımların çıktıları (step key → output) */
  previous: Record<string, unknown>
}

export type ToolDef<I = Record<string, unknown>, O = unknown> = {
  name: string
  description: string
  risk: ToolRisk
  inputSchema: z.ZodType<I>
  timeoutMs: number
  /** Onay ekranında gösterilecek özet (hedef, bütçe, etki) */
  describeAction?: (input: I) => { summary: string; target?: string; budget?: string; effects?: string[] }
  run: (input: I, ctx: ToolContext) => Promise<O>
}
