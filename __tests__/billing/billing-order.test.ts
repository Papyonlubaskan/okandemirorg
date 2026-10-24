/**
 * @jest-environment node
 */
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { getBillingSku } from '@/lib/billing/catalog'
import { applyBillingOrder, workspaceFromNotes } from '@/lib/billing/fulfill'
import { PLAN_MONTHLY_CREDITS, PLAN_PERIOD_MS } from '@/lib/billing/plans'

const WS = '11111111-1111-4111-8111-111111111111'

describe('panel siparişi onayı', () => {
  let store: MemoryTaskStore
  beforeEach(async () => {
    store = new MemoryTaskStore()
    await store.createWorkspace({ id: WS, name: 'A', ownerUserId: 'u1' })
  })

  it('notlardan workspace okur; sahte/eksik notu reddeder', () => {
    expect(workspaceFromNotes(`source:panel\nws:${WS}`)).toBe(WS)
    expect(workspaceFromNotes('ws:abc')).toBeNull()
    expect(workspaceFromNotes(null)).toBeNull()
  })

  it('kredi paketi tek sefer yüklenir (aynı ONAY iki kez)', async () => {
    const order = { order_code: 'OD-T1', product_slug: 'kredi-150', notes: `ws:${WS}` }
    expect(await applyBillingOrder(order, store)).toMatchObject({ credits: 150, alreadyApplied: false })
    expect(await applyBillingOrder(order, store)).toMatchObject({ alreadyApplied: true })
    expect(await store.getCreditBalance(WS)).toBe(150)
  })

  it('plan: krediyi yükler ve 30 gün uzatır; tekrar onay ikinci kez uzatmaz', async () => {
    const order = { order_code: 'OD-P1', product_slug: 'plan-pro', notes: `ws:${WS}` }
    await applyBillingOrder(order, store)
    const first = store.workspaces.get(WS)!.planExpiresAt!.getTime()
    await applyBillingOrder(order, store)
    expect(store.workspaces.get(WS)!.planExpiresAt!.getTime()).toBe(first)
    expect(store.workspaces.get(WS)!.plan).toBe('pro')
    expect(await store.getCreditBalance(WS)).toBe(PLAN_MONTHLY_CREDITS.pro)

    await applyBillingOrder({ ...order, order_code: 'OD-P2' }, store)
    expect(store.workspaces.get(WS)!.planExpiresAt!.getTime()).toBeGreaterThanOrEqual(first + PLAN_PERIOD_MS - 1000)
  })

  it('bilinmeyen ürün veya workspace yoksa uygulanmaz', async () => {
    expect(await applyBillingOrder({ order_code: 'X', product_slug: 'kobi-dijital-baslangic-kiti', notes: `ws:${WS}` }, store)).toBeNull()
    expect(await applyBillingOrder({ order_code: 'Y', product_slug: 'kredi-50', notes: 'ws:22222222-2222-4222-8222-222222222222' }, store)).toBeNull()
    expect(getBillingSku('plan-pro')?.priceTry).toBeGreaterThan(0)
  })
})
