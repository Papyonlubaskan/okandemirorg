import { getStore } from '@/lib/ai/store'
import type { TaskStore } from '@/lib/ai/store-types'
import { getBillingSku } from './catalog'
import { PLAN_LABELS, PLAN_PERIOD_MS } from './plans'

export type BillingApplied = { workspaceId: string; credits: number; plan?: string; alreadyApplied: boolean }

const WS_NOTE = /(?:^|\n)ws:([0-9a-f-]{36})(?:\n|$)/

export function workspaceFromNotes(notes: string | null | undefined): string | null {
  return notes?.match(WS_NOTE)?.[1] ?? null
}

/**
 * Panelden verilen kredi/plan siparişini ödeme onayında workspace'e uygular.
 * Idempotent: aynı sipariş (ref order:<kod>) ikinci kez kredi yüklemez, planı ikinci kez uzatmaz.
 */
export async function applyBillingOrder(
  order: { order_code: string; product_slug: string; notes: string | null },
  store: TaskStore = getStore()
): Promise<BillingApplied | null> {
  const sku = getBillingSku(order.product_slug)
  const workspaceId = workspaceFromNotes(order.notes)
  if (!sku || !workspaceId) return null
  if (!(await store.getWorkspace(workspaceId))) return null

  const inserted = await store.addCredits(workspaceId, sku.credits, sku.kind === 'plan' ? 'plan_grant' : 'claim', `order:${order.order_code}`)
  if (inserted && sku.kind === 'plan' && sku.plan) {
    await store.extendWorkspacePlan(workspaceId, sku.plan, PLAN_PERIOD_MS)
  }
  await store
    .audit({
      workspaceId,
      actorType: 'system',
      actorId: null,
      action: 'billing.order_applied',
      targetType: 'digital_order',
      targetId: order.order_code,
      outcome: 'ok',
      metadata: { sku: sku.sku, credits: sku.credits, plan: sku.plan, duplicate: !inserted },
    })
    .catch(() => {})
  return { workspaceId, credits: sku.credits, plan: sku.plan ? PLAN_LABELS[sku.plan] : undefined, alreadyApplied: !inserted }
}
