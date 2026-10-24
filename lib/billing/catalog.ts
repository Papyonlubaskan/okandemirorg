import { PLAN_LABELS, PLAN_MONTHLY_CREDITS, PLAN_SITE_LIMITS, PRODUCT_CREDITS, PRODUCT_PLANS, type PlanKey } from './plans'

export type BillingSku = {
  sku: string
  name: string
  priceTry: number
  kind: 'credits' | 'plan'
  credits: number
  plan?: PlanKey
  description: string
  features: string[]
  highlighted?: boolean
}

/** Panelden satın alınan kredi paketleri ve aylık planlar (KDV hariç; fiyatlar buradan güncellenir) */
export const BILLING_SKUS: BillingSku[] = [
  {
    sku: 'plan-baslangic',
    name: `${PLAN_LABELS.starter} Plan`,
    priceTry: 499,
    kind: 'plan',
    plan: 'starter',
    credits: PLAN_MONTHLY_CREDITS.starter,
    description: 'Tek işletme için site + temel pazarlama',
    features: [`${PLAN_SITE_LIMITS.starter} yayında site`, `Aylık ${PLAN_MONTHLY_CREDITS.starter} kredi`, 'Form ve WhatsApp ile müşteri toplama', 'SEO denetimi'],
  },
  {
    sku: 'plan-pro',
    name: `${PLAN_LABELS.pro} Plan`,
    priceTry: 999,
    kind: 'plan',
    plan: 'pro',
    credits: PLAN_MONTHLY_CREDITS.pro,
    description: 'Büyüyen işletmeler için otopilot pazarlama',
    features: [`${PLAN_SITE_LIMITS.pro} yayında site`, `Aylık ${PLAN_MONTHLY_CREDITS.pro} kredi`, 'Haftalık otomatik SEO raporu', 'İçerik ve blog taslakları'],
    highlighted: true,
  },
  {
    sku: 'plan-ajans',
    name: `${PLAN_LABELS.agency} Plan`,
    priceTry: 2490,
    kind: 'plan',
    plan: 'agency',
    credits: PLAN_MONTHLY_CREDITS.agency,
    description: 'Çok müşterili ajanslar için',
    features: [`${PLAN_SITE_LIMITS.agency} yayında site`, `Aylık ${PLAN_MONTHLY_CREDITS.agency} kredi`, 'Ekip üyeleri', 'Öncelikli destek'],
  },
  { sku: 'kredi-50', name: '50 Kredi', priceTry: 249, kind: 'credits', credits: PRODUCT_CREDITS['kredi-50'], description: 'Ek kredi paketi', features: ['Süresiz geçerli'] },
  { sku: 'kredi-150', name: '150 Kredi', priceTry: 599, kind: 'credits', credits: PRODUCT_CREDITS['kredi-150'], description: 'Ek kredi paketi', features: ['Süresiz geçerli', '%20 avantajlı'] },
  { sku: 'kredi-500', name: '500 Kredi', priceTry: 1490, kind: 'credits', credits: PRODUCT_CREDITS['kredi-500'], description: 'Ek kredi paketi', features: ['Süresiz geçerli', '%40 avantajlı'] },
]

export function getBillingSku(sku: string): BillingSku | undefined {
  const s = BILLING_SKUS.find((x) => x.sku === sku)
  if (!s) return undefined
  if (s.kind === 'plan' && PRODUCT_PLANS[s.sku] !== s.plan) return undefined
  return s
}
