import type { WorkspaceRow } from '@/lib/ai/store-types'

/**
 * Ücretsiz kredi/plan YOK: her üretim kredi harcar, yayın ücretli plan ister.
 * Fiyatlar TL, KDV hariç tahmini başlangıç fiyatıdır; buradan güncellenir.
 */

export type PlanKey = WorkspaceRow['plan']

/** Plan ödemesi (aylık) onaylandığında yüklenen kredi */
export const PLAN_MONTHLY_CREDITS: Record<PlanKey, number> = {
  free: 0,
  starter: 100,
  pro: 300,
  agency: 1000,
}

/** Aynı anda yayında olabilecek site sayısı */
export const PLAN_SITE_LIMITS: Record<PlanKey, number> = {
  free: 0,
  starter: 1,
  pro: 3,
  agency: 20,
}

export const PLAN_LABELS: Record<PlanKey, string> = {
  free: 'Plansız',
  starter: 'Başlangıç',
  pro: 'Pro',
  agency: 'Ajans',
}

/** Plan süresi dolduktan sonra sitelerin yayında kalacağı ek süre */
export const PLAN_GRACE_MS = 3 * 24 * 60 * 60 * 1000
export const PLAN_PERIOD_MS = 30 * 24 * 60 * 60 * 1000

/** Görev başına kredi (TASK_TYPES.creditCost ile aynı kaynak) */
export const CREDIT_COSTS = {
  'site.generate': 10,
  'site.edit': 2,
  'seo.audit': 3,
  'landing.draft': 3,
  auto: 1,
} as const

/** Ürün kodu → yüklenecek kredi (kredi paketleri ve eski tekil ürünler) */
export const PRODUCT_CREDITS: Record<string, number> = {
  'kredi-50': 50,
  'kredi-150': 150,
  'kredi-500': 500,
  'ai-seo-denetim': 9,
  'ai-landing-sayfa': 10,
}

/** Ürün kodu → plan (aylık abonelik; her onay 30 gün uzatır ve plan kredisini yükler) */
export const PRODUCT_PLANS: Record<string, PlanKey> = {
  'plan-baslangic': 'starter',
  'plan-pro': 'pro',
  'plan-ajans': 'agency',
}

export const CLAIM_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function isPlan(v: unknown): v is PlanKey {
  return typeof v === 'string' && v in PLAN_MONTHLY_CREDITS
}

/** Plan aktif mi (süre + ek süre) */
export function isPlanActive(ws: Pick<WorkspaceRow, 'plan' | 'planExpiresAt'>, now = Date.now(), withGrace = false): boolean {
  if (ws.plan === 'free') return false
  if (!ws.planExpiresAt) return true
  return ws.planExpiresAt.getTime() + (withGrace ? PLAN_GRACE_MS : 0) > now
}
