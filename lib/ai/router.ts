import { MODEL_CATALOG, unknownQuotaDailyCap, type ModelEntry } from '@/lib/ai/catalog'
import type { ModelProvider } from '@/lib/ai/providers/provider'
import type { ModelPurpose, ProviderId } from '@/lib/ai/types'

export type ProviderRegistry = Partial<Record<ProviderId, ModelProvider>>

/** Bugünkü (UTC) kullanım; anahtar: catalog entry key */
export type UsageSnapshot = Record<string, { requests: number; exhausted?: boolean }>

export type RouteContext = {
  purpose: ModelPurpose
  json?: boolean
  allowPaid: boolean
  remainingBudgetUsd: number
  estimatedInputTokens: number
  maxOutputTokens: number
  usage: UsageSnapshot
  providers: ProviderRegistry
  catalog?: ModelEntry[]
}

export type RejectReason = 'disabled' | 'purpose' | 'not_configured' | 'json' | 'quota' | 'paid_not_allowed' | 'budget'

export type RouteResult = {
  candidates: ModelEntry[]
  rejected: { key: string; reason: RejectReason }[]
}

export function estimateCostUsd(entry: ModelEntry, inputTokens: number, outputTokens: number): number {
  return (inputTokens * entry.pricing.inputPer1M + outputTokens * entry.pricing.outputPer1M) / 1_000_000
}

function quotaAllows(entry: ModelEntry, usage: UsageSnapshot): boolean {
  const u = usage[entry.key]
  if (u?.exhausted) return false
  const used = u?.requests ?? 0
  const limit = entry.quota.status === 'known' ? entry.quota.requestsPerDay : unknownQuotaDailyCap()
  return used < limit
}

/** Görev türü / yetenek / kota / maliyet bazlı aday listesi. Önce ücretsiz, sonra ucuzdan pahalıya ücretli. */
export function selectCandidates(ctx: RouteContext): RouteResult {
  const catalog = ctx.catalog ?? MODEL_CATALOG
  const candidates: ModelEntry[] = []
  const rejected: RouteResult['rejected'] = []

  for (const entry of catalog) {
    const reject = (reason: RejectReason) => rejected.push({ key: entry.key, reason })
    if (!entry.enabled()) { reject('disabled'); continue }
    if (!entry.purposes.includes(ctx.purpose)) { reject('purpose'); continue }
    const provider = ctx.providers[entry.provider]
    if (!provider || !provider.isConfigured()) { reject('not_configured'); continue }
    if (ctx.json && !entry.jsonMode) { reject('json'); continue }
    if (!quotaAllows(entry, ctx.usage)) { reject('quota'); continue }
    if (entry.tier === 'paid') {
      if (!ctx.allowPaid) { reject('paid_not_allowed'); continue }
      const worst = estimateCostUsd(entry, ctx.estimatedInputTokens, ctx.maxOutputTokens)
      if (worst > ctx.remainingBudgetUsd) { reject('budget'); continue }
    }
    candidates.push(entry)
  }

  const free = candidates.filter((c) => c.tier === 'free')
  const paid = candidates
    .filter((c) => c.tier === 'paid')
    .sort((a, b) => a.pricing.outputPer1M - b.pricing.outputPer1M)
  return { candidates: [...free, ...paid], rejected }
}
