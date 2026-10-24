/**
 * @jest-environment node
 */
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { decideApproval } from '@/lib/agents/approvals'
import { PLAN_PERIOD_MS } from '@/lib/billing/plans'
import { enqueueTask } from '@/lib/jobs/queue'
import { defaultOrchestratorDeps, runWorkerTick } from '@/lib/jobs/worker'

const env = process.env as Record<string, string | undefined>
let store: MemoryTaskStore

beforeEach(async () => {
  delete env.USE_LLM
  delete env.AI_PROVIDER_MODE
  store = new MemoryTaskStore()
  await store.createWorkspace({ id: 'ws1', name: 'A', ownerUserId: 'u1' })
})

const enqueue = (taskType: string, input: unknown, idempotencyKey?: string) =>
  enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType, input, idempotencyKey })
const tick = () => runWorkerTick(store, { deps: defaultOrchestratorDeps(store) })
const brief = { businessName: 'Demir Kuaför', sector: 'Kuaför', city: 'İzmir', whatsapp: '905551112233' }

async function generate() {
  await store.addCredits('ws1', 10, 'admin', `seed-${Math.random()}`)
  const r = await enqueue('site.generate', brief)
  expect(r.ok).toBe(true)
  await tick()
  const task = store.tasks.get((r as { task: { id: string } }).task.id)!
  expect(task.status).toBe('succeeded')
  return task.result as { siteId: string; slug: string; version: number; contentHash: string; source: string }
}

describe('site araçları', () => {
  it('ücretsiz üretim yok: kredisiz site oluşturma 402', async () => {
    expect(await enqueue('site.generate', brief)).toMatchObject({ ok: false, status: 402 })
  })

  it('AI kapalıyken sektör şablonuyla site oluşturur (10 kredi)', async () => {
    const r = await generate()
    expect(r.source).toBe('template')
    expect(await store.getCreditBalance('ws1')).toBe(0)
    const v = await store.getSiteVersion(r.siteId, 1)
    expect(v?.schema.business.name).toBe('Demir Kuaför')
    expect((await store.getSite(r.siteId, 'ws1'))?.status).toBe('draft')
  })

  it('AI kapalıyken AI düzenleme başarısız olur ve kredi iade edilir', async () => {
    const s = await generate()
    await store.addCredits('ws1', 2, 'admin', 'edit-seed')
    const r = await enqueue('site.edit', { siteId: s.siteId, instruction: 'Renkleri koyulaştır' })
    await tick()
    const t = store.tasks.get((r as { task: { id: string } }).task.id)!
    expect(t).toMatchObject({ status: 'failed', errorCode: 'ai_unavailable' })
    expect(await store.getCreditBalance('ws1')).toBe(2)
  })

  it('plansız yayın isteği kuyruğa bile girmez', async () => {
    const s = await generate()
    const r = await enqueue('site.publish', { siteId: s.siteId, version: s.version, contentHash: s.contentHash })
    expect(r).toMatchObject({ ok: false, code: 'precheck_failed' })
  })

  it('aktif planla onaydan sonra yayınlanır; plan sınırı aşılınca reddedilir', async () => {
    await store.extendWorkspacePlan('ws1', 'starter', PLAN_PERIOD_MS)
    const a = await generate()
    const r = await enqueue('site.publish', { siteId: a.siteId, version: a.version, contentHash: a.contentHash })
    const pubId = (r as { task: { id: string } }).task.id
    await tick()
    expect(store.tasks.get(pubId)!.status).toBe('awaiting_approval')
    const [ap] = await store.listPendingApprovals('ws1')
    await decideApproval({ store, approvalId: ap.id, workspaceId: 'ws1', userId: 'u1', role: 'owner', decision: 'approve', payloadHash: ap.payloadHash })
    await tick()
    expect(store.tasks.get(pubId)!.status).toBe('succeeded')
    expect((await store.getSite(a.siteId, 'ws1'))?.status).toBe('published')

    const b = await generate()
    expect(await enqueue('site.publish', { siteId: b.siteId, version: b.version, contentHash: b.contentHash })).toMatchObject({
      ok: false,
      code: 'precheck_failed',
    })
  })

  it('başka workspace’in sitesini düzenleme isteği reddedilir', async () => {
    const s = await generate()
    await store.createWorkspace({ id: 'ws2', name: 'B', ownerUserId: 'u2' })
    await store.addCredits('ws2', 5, 'admin', 'ws2')
    const r = await enqueueTask({ store, workspaceId: 'ws2', userId: 'u2', role: 'owner', taskType: 'site.edit', input: { siteId: s.siteId, instruction: 'değiştir' } })
    expect(r).toMatchObject({ ok: false, code: 'precheck_failed' })
  })

  it('süresi dolan plan düşer ve yayındaki site askıya alınır', async () => {
    let now = Date.now()
    store = new MemoryTaskStore({ now: () => new Date(now) })
    await store.createWorkspace({ id: 'ws1', name: 'A', ownerUserId: 'u1' })
    await store.extendWorkspacePlan('ws1', 'pro', 1000)
    const s = await store.createSite({ id: '00000000-0000-4000-8000-000000000001', workspaceId: 'ws1', slug: 'x', name: 'X', taskId: null })
    store.sites.get(s.id)!.status = 'published'
    now += 4 * 24 * 60 * 60 * 1000
    expect(await store.expireWorkspacePlans(3 * 24 * 60 * 60 * 1000)).toBe(1)
    expect(store.workspaces.get('ws1')!.plan).toBe('free')
    expect(store.sites.get(s.id)!.status).toBe('suspended')
  })
})
