import { randomBytes, randomUUID } from 'crypto'
import { isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import type { TaskStore } from '@/lib/ai/store-types'
import { sha256Hex } from '@/lib/security/secrets'
import { CLAIM_TTL_MS, PRODUCT_CREDITS } from './plans'

/**
 * Ödeme onayı sonrası panel kredisi için tek kullanımlık link üretir.
 * Token yalnızca linkte bulunur; DB'de sha256 saklanır. Tekrar onayda (ONAY) eski link geçersizleşir, yenisi üretilir.
 * Orkestratör kapalıysa veya ürün kredi vermiyorsa null.
 */
export async function issueClaimLink(
  order: { orderCode: string; productSlug: string },
  store: TaskStore = getStore()
): Promise<string | null> {
  if (!isOrchestratorEnabled()) return null
  const credits = PRODUCT_CREDITS[order.productSlug]
  if (!credits) return null

  const token = randomBytes(24).toString('hex')
  const result = await store.upsertClaim({
    id: randomUUID(),
    tokenHash: sha256Hex(token),
    orderCode: order.orderCode,
    productSlug: order.productSlug,
    credits,
    ttlMs: CLAIM_TTL_MS,
  })
  if (result === 'already_claimed') return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
  return `${siteUrl}/panel/claim?token=${token}`
}

export function isValidClaimToken(token: unknown): token is string {
  return typeof token === 'string' && /^[a-f0-9]{48}$/.test(token)
}
