import { z } from 'zod'
import type { TaskStore } from '@/lib/ai/store-types'
import { CREDIT_COSTS } from '@/lib/billing/plans'
import { landingBriefSchema } from './tools/landing'
import { checkPublishAllowed, siteBriefSchema } from './tools/site'
import type { Plan } from './types'

export type TaskTypeDef = {
  type: string
  label: string
  /** static: plan kodla üretilir (model çağrısı yok). model: plan modelden alınır, doğrulanır */
  planner: 'static' | 'model'
  allowedTools: string[]
  inputSchema: z.ZodType<Record<string, unknown>>
  staticPlan?: (input: Record<string, unknown>) => Plan
  /** Görev başına düşülen kredi */
  creditCost: number
  /** Panelde doğrudan oluşturulabilir mi (ör. yayın yalnızca site ekranından) */
  userCreatable: boolean
  /** Kuyruğa almadan önce iş kuralı kontrolü; hata mesajı döndürürse görev oluşmaz */
  precheck?: (store: TaskStore, workspaceId: string, input: Record<string, unknown>) => Promise<string | null>
}

const single = (type: string, tool: string, key: string) => (input: Record<string, unknown>): Plan => ({
  version: 1,
  taskType: type,
  steps: [{ key, tool, input }],
})

const echoInput = z.object({ message: z.string().trim().min(1).max(500) }).strict()
const auditInput = z.object({ url: z.string().trim().min(4).max(2048) }).strict()
const autoInput = z.object({ request: z.string().trim().min(3).max(2000) }).strict()
const siteEditInput = z.object({ siteId: z.string().uuid(), instruction: z.string().trim().min(3).max(1000) }).strict()
const sitePublishInput = z
  .object({ siteId: z.string().uuid(), version: z.number().int().positive(), contentHash: z.string().regex(/^[a-f0-9]{64}$/) })
  .strict()

export const TASK_TYPES: Record<string, TaskTypeDef> = {
  'site.generate': {
    type: 'site.generate',
    label: 'AI ile site oluştur',
    planner: 'static',
    allowedTools: ['site.generate'],
    inputSchema: siteBriefSchema,
    staticPlan: single('site.generate', 'site.generate', 'generate'),
    creditCost: CREDIT_COSTS['site.generate'],
    userCreatable: true,
  },
  'site.edit': {
    type: 'site.edit',
    label: 'AI ile siteyi düzenle',
    planner: 'static',
    allowedTools: ['site.edit'],
    inputSchema: siteEditInput,
    staticPlan: single('site.edit', 'site.edit', 'edit'),
    creditCost: CREDIT_COSTS['site.edit'],
    userCreatable: false,
    precheck: async (store, ws, input) => ((await store.getSite(String(input.siteId), ws)) ? null : 'Site bulunamadı'),
  },
  'site.publish': {
    type: 'site.publish',
    label: 'Siteyi yayınla (onay gerekir)',
    planner: 'static',
    allowedTools: ['site.publish'],
    inputSchema: sitePublishInput,
    staticPlan: single('site.publish', 'site.publish', 'publish'),
    creditCost: 0,
    userCreatable: false,
    precheck: (store, ws, input) => checkPublishAllowed(store, ws, String(input.siteId)),
  },
  'seo.audit': {
    type: 'seo.audit',
    label: 'AI SEO Denetim',
    planner: 'static',
    allowedTools: ['seo.audit'],
    inputSchema: auditInput,
    staticPlan: single('seo.audit', 'seo.audit', 'audit'),
    creditCost: CREDIT_COSTS['seo.audit'],
    userCreatable: true,
  },
  auto: {
    type: 'auto',
    label: 'Serbest istek (AI sınıflandırır)',
    planner: 'model',
    allowedTools: ['seo.audit'],
    inputSchema: autoInput,
    creditCost: CREDIT_COSTS.auto,
    userCreatable: true,
  },
  'echo.test': {
    type: 'echo.test',
    label: 'Sistem testi (etkisiz)',
    planner: 'static',
    allowedTools: ['echo.test'],
    inputSchema: echoInput,
    staticPlan: single('echo.test', 'echo.test', 'echo'),
    creditCost: 0,
    userCreatable: false,
  },
  'landing.draft': {
    type: 'landing.draft',
    label: 'AI Landing taslağı (eski)',
    planner: 'static',
    allowedTools: ['landing.draft'],
    inputSchema: landingBriefSchema,
    staticPlan: single('landing.draft', 'landing.draft', 'draft'),
    creditCost: CREDIT_COSTS['landing.draft'],
    userCreatable: false,
  },
  'landing.publish': {
    type: 'landing.publish',
    label: 'Landing yayınla (eski)',
    planner: 'static',
    allowedTools: ['landing.publish'],
    inputSchema: z.object({ draftId: z.string().uuid(), contentHash: z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
    staticPlan: single('landing.publish', 'landing.publish', 'publish'),
    creditCost: 0,
    userCreatable: false,
  },
}

export function getTaskType(type: string): TaskTypeDef | undefined {
  return Object.prototype.hasOwnProperty.call(TASK_TYPES, type) ? TASK_TYPES[type] : undefined
}
