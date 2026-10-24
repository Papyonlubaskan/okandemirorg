import { MODEL_CATALOG, type ModelEntry } from '@/lib/ai/catalog'
import { estimateCostUsd, selectCandidates, type ProviderRegistry, type UsageSnapshot } from '@/lib/ai/router'
import {
  NoModelAvailableError,
  ProviderError,
  type ModelPurpose,
  type ModelRequest,
  type ModelResponse,
  type ProviderId,
} from '@/lib/ai/types'

export type ModelCallStatus = 'ok' | 'error' | 'timeout' | 'rate_limited' | 'skipped'

export type ModelCallRecord = {
  entryKey: string
  provider: ProviderId
  model: string
  purpose: ModelPurpose
  inputTokens?: number
  outputTokens?: number
  estimatedCost: number
  latencyMs: number
  status: ModelCallStatus
  errorCode?: string
}

export type GatewayDeps = {
  providers: ProviderRegistry
  catalog?: ModelEntry[]
  getUsage: () => Promise<UsageSnapshot>
  record: (call: ModelCallRecord) => Promise<void>
  sleep?: (ms: number) => Promise<void>
}

export type TaskLlmOptions = {
  maxCalls: number
  budgetUsd: number
  allowPaid: boolean
  /** Geçici hatalarda aynı modelde ek deneme sayısı */
  retriesPerModel?: number
  backoffMs?: number
}

export type TaskLlm = {
  call: (purpose: ModelPurpose, req: ModelRequest) => Promise<ModelResponse>
  readonly spentUsd: number
  readonly calls: number
}

function approxTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function statusFor(err: unknown): { status: ModelCallStatus; code: string } {
  if (err instanceof ProviderError) {
    if (err.kind === 'rate_limited') return { status: 'rate_limited', code: 'rate_limited' }
    if (err.kind === 'timeout') return { status: 'timeout', code: 'timeout' }
    return { status: 'error', code: err.kind }
  }
  return { status: 'error', code: 'unknown' }
}

/**
 * Görev başına model istemcisi: çağrı sayısı ve bütçe sınırı, sınırlı tekrar, alternatif sağlayıcı.
 * Ücretli modele geçiş yalnızca allowPaid=true ve kalan bütçe yeterliyse.
 */
export function createTaskLlm(deps: GatewayDeps, opts: TaskLlmOptions): TaskLlm {
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)))
  const retries = opts.retriesPerModel ?? 1
  const backoff = opts.backoffMs ?? 500
  let spent = 0
  let calls = 0
  const exhaustedThisTask = new Set<string>()

  async function call(purpose: ModelPurpose, req: ModelRequest): Promise<ModelResponse> {
    if (calls >= opts.maxCalls) throw new NoModelAvailableError('call_limit', 'Görev başına model çağrısı sınırı doldu')

    const usage = await deps.getUsage()
    for (const key of exhaustedThisTask) usage[key] = { requests: usage[key]?.requests ?? 0, exhausted: true }

    const inputTokens = approxTokens(req.messages.map((m) => m.content).join('\n'))
    const maxOutputTokens = req.maxTokens ?? 1024
    const { candidates, rejected } = selectCandidates({
      purpose,
      json: req.json,
      allowPaid: opts.allowPaid,
      remainingBudgetUsd: Math.max(0, opts.budgetUsd - spent),
      estimatedInputTokens: inputTokens,
      maxOutputTokens,
      usage,
      providers: deps.providers,
      catalog: deps.catalog ?? MODEL_CATALOG,
    })

    if (candidates.length === 0) {
      if (rejected.some((r) => r.reason === 'budget')) throw new NoModelAvailableError('budget_exhausted', 'Bütçe yetersiz')
      if (rejected.some((r) => r.reason === 'quota')) throw new NoModelAvailableError('quota_exhausted', 'Ücretsiz kota doldu')
      throw new NoModelAvailableError('no_provider', 'Uygun model sağlayıcısı yok')
    }

    for (const entry of candidates) {
      const provider = deps.providers[entry.provider]!
      const model = entry.model()
      for (let attempt = 0; attempt <= retries; attempt++) {
        if (calls >= opts.maxCalls) throw new NoModelAvailableError('call_limit', 'Görev başına model çağrısı sınırı doldu')
        calls++
        const started = Date.now()
        try {
          const res = await provider.chat(model, req)
          const inTok = res.usage.inputTokens ?? inputTokens
          const outTok = res.usage.outputTokens ?? approxTokens(res.content)
          const cost = estimateCostUsd(entry, inTok, outTok)
          spent += cost
          await deps.record({
            entryKey: entry.key,
            provider: entry.provider,
            model,
            purpose,
            inputTokens: inTok,
            outputTokens: outTok,
            estimatedCost: cost,
            latencyMs: res.latencyMs,
            status: 'ok',
          })
          return res
        } catch (err) {
          const { status, code } = statusFor(err)
          await deps.record({
            entryKey: entry.key,
            provider: entry.provider,
            model,
            purpose,
            estimatedCost: 0,
            latencyMs: Date.now() - started,
            status,
            errorCode: code,
          })
          if (err instanceof ProviderError && err.kind === 'rate_limited') {
            exhaustedThisTask.add(entry.key)
            break
          }
          const retryable = err instanceof ProviderError && err.retryable
          if (!retryable || attempt === retries) break
          await sleep(backoff * 2 ** attempt)
        }
      }
    }
    throw new NoModelAvailableError('all_failed', 'Tüm model sağlayıcıları başarısız oldu')
  }

  return {
    call,
    get spentUsd() {
      return spent
    },
    get calls() {
      return calls
    },
  }
}
