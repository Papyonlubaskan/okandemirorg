import { z } from 'zod'
import type { Plan } from './types'

export type TaskTypeDef = {
  type: string
  label: string
  /** static: plan kodla üretilir (model çağrısı yok). model: plan modelden alınır, doğrulanır */
  planner: 'static' | 'model'
  allowedTools: string[]
  inputSchema: z.ZodType<Record<string, unknown>>
  staticPlan?: (input: Record<string, unknown>) => Plan
  /** Faz 5: görev başına düşülen kredi (0 = ücretsiz) */
  creditCost: number
}

const echoInput = z.object({ message: z.string().trim().min(1).max(500) }).strict()
const auditInput = z.object({ url: z.string().trim().min(4).max(2048) }).strict()
const autoInput = z.object({ request: z.string().trim().min(3).max(2000) }).strict()

export const TASK_TYPES: Record<string, TaskTypeDef> = {
  'echo.test': {
    type: 'echo.test',
    label: 'Test görevi (etkisiz)',
    planner: 'static',
    allowedTools: ['echo.test'],
    inputSchema: echoInput,
    staticPlan: (input) => ({ version: 1, taskType: 'echo.test', steps: [{ key: 'echo', tool: 'echo.test', input }] }),
    creditCost: 0,
  },
  'seo.audit': {
    type: 'seo.audit',
    label: 'AI SEO Denetim',
    planner: 'static',
    allowedTools: ['seo.audit'],
    inputSchema: auditInput,
    staticPlan: (input) => ({ version: 1, taskType: 'seo.audit', steps: [{ key: 'audit', tool: 'seo.audit', input }] }),
    creditCost: 1,
  },
  auto: {
    type: 'auto',
    label: 'Serbest istek (AI sınıflandırır)',
    planner: 'model',
    allowedTools: ['echo.test', 'seo.audit'],
    inputSchema: autoInput,
    creditCost: 1,
  },
}

export function getTaskType(type: string): TaskTypeDef | undefined {
  return Object.prototype.hasOwnProperty.call(TASK_TYPES, type) ? TASK_TYPES[type] : undefined
}
