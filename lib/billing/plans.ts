import type { WorkspaceRow } from '@/lib/ai/store-types'

/** Abonelik planı başına aylık kredi hibesi (ay başında bir kez, idempotent) */
export const PLAN_MONTHLY_CREDITS: Record<WorkspaceRow['plan'], number> = {
  free: 0,
  starter: 5,
  pro: 20,
  agency: 100,
}

/** Tek seferlik ürün satın alımında claim ile yüklenen kredi */
export const PRODUCT_CREDITS: Record<string, number> = {
  'ai-seo-denetim': 3,
  'ai-landing-sayfa': 3,
}

export const CLAIM_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function isPlan(v: unknown): v is WorkspaceRow['plan'] {
  return typeof v === 'string' && v in PLAN_MONTHLY_CREDITS
}
