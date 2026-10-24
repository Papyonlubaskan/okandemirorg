import { z } from 'zod'
import { TASK_LIMITS } from './policies'
import type { ToolRegistry } from './registry'
import type { Plan } from './types'

const planSchema = z
  .object({
    version: z.literal(1),
    taskType: z.string().min(1).max(64),
    steps: z
      .array(
        z
          .object({
            key: z.string().regex(/^[a-z0-9_]{1,32}$/),
            tool: z.string().regex(/^[a-z0-9_.]{1,64}$/),
            input: z.record(z.string(), z.unknown()),
          })
          .strict()
      )
      .min(1),
    notes: z.string().max(500).optional(),
  })
  .strict()

export type PlanValidation = { ok: true; plan: Plan } | { ok: false; errors: string[] }

export type ValidateOptions = {
  registry: ToolRegistry
  allowedTools: string[]
  expectedTaskType?: string
  maxSteps?: number
}

/** Model çıktısını ayrıştırır; ```json bloklarını tolere eder, başka bir şey çalıştırmaz */
export function parsePlanJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    return undefined
  }
}

/**
 * Plan şema + izin kontrolü. Başarısızsa hiçbir araç çalıştırılmamalı.
 * Kontroller: şema, adım sayısı, benzersiz adım anahtarı, allowlist, görev türüne izinli araç, araç girdi şeması.
 */
export function validatePlan(raw: unknown, opts: ValidateOptions): PlanValidation {
  const candidate = typeof raw === 'string' ? parsePlanJson(raw) : raw
  if (candidate === undefined) return { ok: false, errors: ['Plan JSON olarak ayrıştırılamadı'] }

  const parsed = planSchema.safeParse(candidate)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((i) => `${i.path.join('.') || 'plan'}: ${i.message}`) }
  }

  const plan = parsed.data as Plan
  const errors: string[] = []
  const maxSteps = opts.maxSteps ?? TASK_LIMITS.maxSteps

  if (opts.expectedTaskType && plan.taskType !== opts.expectedTaskType) {
    errors.push(`taskType uyuşmuyor: ${plan.taskType}`)
  }
  if (plan.steps.length > maxSteps) errors.push(`En fazla ${maxSteps} adım`)

  const keys = new Set<string>()
  plan.steps.forEach((step, idx) => {
    if (keys.has(step.key)) errors.push(`steps.${idx}.key tekrar ediyor`)
    keys.add(step.key)

    const tool = opts.registry.get(step.tool)
    if (!tool) {
      errors.push(`steps.${idx}.tool izin listesinde değil: ${step.tool}`)
      return
    }
    if (!opts.allowedTools.includes(step.tool)) {
      errors.push(`steps.${idx}.tool bu görev türünde izinli değil: ${step.tool}`)
      return
    }
    const input = tool.inputSchema.safeParse(step.input)
    if (!input.success) {
      errors.push(...input.error.issues.map((i) => `steps.${idx}.input.${i.path.join('.')}: ${i.message}`))
    } else {
      step.input = input.data as Record<string, unknown>
    }
  })

  return errors.length ? { ok: false, errors } : { ok: true, plan }
}
