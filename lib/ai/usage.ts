import { MODEL_CATALOG, type ModelEntry } from '@/lib/ai/catalog'
import type { UsageSnapshot } from '@/lib/ai/router'

/** Store'dan gelen `provider|model` anahtarlı sayaçları katalog entry anahtarına çevirir */
export function toEntryUsage(raw: UsageSnapshot, catalog: ModelEntry[] = MODEL_CATALOG): UsageSnapshot {
  const out: UsageSnapshot = {}
  for (const entry of catalog) {
    const u = raw[usageKey(entry.provider, entry.model())]
    if (u) out[entry.key] = u
  }
  return out
}

export function usageKey(provider: string, model: string): string {
  return `${provider}|${model}`
}

/** Gün içinde bu kadar 429 alınırsa model o gün için tükenmiş sayılır */
export const RATE_LIMIT_EXHAUST_THRESHOLD = 3
