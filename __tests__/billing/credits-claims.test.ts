/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { setStoreForTests } from '@/lib/ai/store'
import { issueClaimLink } from '@/lib/billing/claims'
import { PLAN_MONTHLY_CREDITS } from '@/lib/billing/plans'
import { enqueueTask } from '@/lib/jobs/queue'
import { runWorkerTick } from '@/lib/jobs/worker'
import { sha256Hex } from '@/lib/security/secrets'
import { POST as setPlan } from '@/app/api/ai/admin/plan/route'
import type { AnyTool } from '@/lib/agents/registry'
import { createRegistry } from '@/lib/agents/registry'
import { TASK_TYPES } from '@/lib/agents/task-types'

const env = process.env as Record<string, string | undefined>

let store: MemoryTaskStore
beforeEach(async () => {
  env.AI_ORCHESTRATOR_ENABLED = '1'
  env.AI_STORE = 'memory'
  store = new MemoryTaskStore()
  setStoreForTests(store)
  await store.createWorkspace({ id: 'ws1', name: 'A', ownerUserId: 'u1' })
})
afterAll(() => {
  setStoreForTests(null)
  delete env.AI_ORCHESTRATOR_ENABLED
  delete env.AI_STORE
})

const audit = (key?: string) =>
  enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType: 'seo.audit', input: { url: 'example.com' }, idempotencyKey: key })

describe('krediler', () => {
  it('kredi yoksa ücretli görev 402 döner ve görev oluþmaz', async () => {
    expect(await audit()).toMatchObject({ ok: false, status: 402, code: 'insufficient_credits' })
    expect(store.tasks.size).toBe(0)
  })

  it('kredi düþer; ayný idempotency anahtarý ikinci kez düþmez', async () => {
    await store.addCredits('ws1', 4, 'admin', 'seed')
    await audit('same-key-123')
    await audit('same-key-123')
    expect(await store.getCreditBalance('ws1')).toBe(1)
    expect(store.tasks.size).toBe(1)
  })

  it('baþarýsýz görevin kredisi tek sefer iade edilir', async () => {
    await store.addCredits('ws1', 3, 'admin', 'seed')
    const r = await audit()
    const id = (r as { task: { id: string } }).task.id
    expect(await store.getCreditBalance('ws1')).toBe(0)

    const failing: AnyTool = { ...TASK_TYPES['seo.audit'], name: 'seo.audit', description: 'x', risk: 'safe', inputSchema: TASK_TYPES['seo.audit'].inputSchema, timeoutMs: 1000, run: async () => { throw Object.assign(new Error('boom')) } }
    const deps = {
      store,
      registry: createRegistry([failing]),
      aiMode: 'off' as const,
      providers: {},
      allowPaid: async () => false,
      limits: { maxAttempts: 1 },
    }
    store.tasks.get(id)!.maxAttempts = 1
    await runWorkerTick(store, { deps })
    await runWorkerTick(store, { deps })
    expect(store.tasks.get(id)!.status).toBe('failed')
    expect(await store.getCreditBalance('ws1')).toBe(3)
  })

  it('aylýk plan hibesi ayda bir kez yazýlýr', async () => {
    await store.setWorkspacePlan('ws1', 'starter')
    await store.grantMonthlyPlanCredits(PLAN_MONTHLY_CREDITS)
    await store.grantMonthlyPlanCredits(PLAN_MONTHLY_CREDITS)
    expect(await store.getCreditBalance('ws1')).toBe(PLAN_MONTHLY_CREDITS.starter)
  })
})

describe('claim linki', () => {
  const order = { orderCode: 'OD-TEST1', productSlug: 'ai-seo-denetim' }
  const tokenOf = (url: string) => new URL(url).searchParams.get('token')!

  it('tek kullanýmlýk: krediyi bir kez yükler', async () => {
    const url = await issueClaimLink(order, store)
    expect(url).toContain('/panel/claim?token=')
    const hash = sha256Hex(tokenOf(url!))
    expect(await store.redeemClaim(hash, 'ws1')).toMatchObject({ credits: 9 })
    expect(await store.redeemClaim(hash, 'ws1')).toBeNull()
    expect(await store.getCreditBalance('ws1')).toBe(9)
  })

  it('yeniden onay eski linki geçersiz kýlar; kullanýlmýþ sipariþe yeni link üretmez', async () => {
    const first = await issueClaimLink(order, store)
    const second = await issueClaimLink(order, store)
    expect(await store.redeemClaim(sha256Hex(tokenOf(first!)), 'ws1')).toBeNull()
    expect(await store.redeemClaim(sha256Hex(tokenOf(second!)), 'ws1')).not.toBeNull()
    expect(await issueClaimLink(order, store)).toBeNull()
  })

  it('kredi vermeyen ürün veya kapalý bayrakta link yok', async () => {
    expect(await issueClaimLink({ orderCode: 'OD-K', productSlug: 'kobi-dijital-baslangic-kiti' }, store)).toBeNull()
    env.AI_ORCHESTRATOR_ENABLED = '0'
    expect(await issueClaimLink({ orderCode: 'OD-X', productSlug: 'ai-seo-denetim' }, store)).toBeNull()
  })
})

describe('POST /api/ai/admin/plan', () => {
  const req = (body: unknown, key?: string) =>
    new NextRequest('http://localhost/api/ai/admin/plan', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json', ...(key ? { 'x-api-key': key } : {}) },
    })

  it('dahili anahtar ister; planý ayarlar ve hibeyi bir kez yazar', async () => {
    env.INTERNAL_API_KEY = 'k-test'
    store.ownerEmails.set('a@x.com', 'u1')
    expect((await setPlan(req({ email: 'a@x.com', plan: 'pro' }))).status).toBe(401)
    const res = await setPlan(req({ email: 'a@x.com', plan: 'pro', grantNow: true }, 'k-test'))
    expect(res.status).toBe(200)
    expect(store.workspaces.get('ws1')!.plan).toBe('pro')
    await setPlan(req({ email: 'a@x.com', plan: 'pro', grantNow: true }, 'k-test'))
    expect(await store.getCreditBalance('ws1')).toBe(PLAN_MONTHLY_CREDITS.pro)
    expect((await setPlan(req({ email: 'a@x.com', plan: 'gold' }, 'k-test'))).status).toBe(400)
    delete env.INTERNAL_API_KEY
  })
})
