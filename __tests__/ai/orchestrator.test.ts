/**
 * @jest-environment node
 */
import { z } from 'zod'
import type { ModelEntry } from '@/lib/ai/catalog'
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { createMockProvider } from '@/lib/ai/providers/mock'
import { runTask, type OrchestratorDeps } from '@/lib/agents/orchestrator'
import { createRegistry, type AnyTool } from '@/lib/agents/registry'
import { TASK_TYPES, type TaskTypeDef } from '@/lib/agents/task-types'
import { echoTool } from '@/lib/agents/tools/echo'
import { enqueueTask } from '@/lib/jobs/queue'
import { runWorkerTick } from '@/lib/jobs/worker'

const mockEntry: ModelEntry = {
  key: 'mock:test',
  provider: 'mock',
  model: () => 'mock-1',
  tier: 'free',
  purposes: ['classify', 'plan', 'generate', 'quality'],
  jsonMode: true,
  quota: { status: 'known', requestsPerDay: 1000 },
  pricing: { inputPer1M: 0, outputPer1M: 0 },
  commercialUse: 'verified',
  enabled: () => true,
}

function setup(opts: { planReply?: string; tools?: AnyTool[]; types?: Record<string, TaskTypeDef> } = {}) {
  let now = new Date('2026-01-01T00:00:00Z')
  const clock = { now: () => now }
  const store = new MemoryTaskStore(clock)
  const tools = opts.tools ?? [echoTool]
  const types = { ...TASK_TYPES, ...opts.types }
  const deps: OrchestratorDeps = {
    store,
    registry: createRegistry(tools),
    aiMode: 'mock',
    providers: { mock: createMockProvider((_m, req) => (req.json && opts.planReply ? opts.planReply : 'rapor')) },
    catalog: [mockEntry],
    allowPaid: async () => false,
    getTaskType: (t) => types[t],
  }
  return {
    store,
    deps,
    advance: (ms: number) => {
      now = new Date(now.getTime() + ms)
    },
  }
}

async function createWs(store: MemoryTaskStore, ws = 'ws1', user = 'u1') {
  await store.createWorkspace({ id: ws, name: 'Test', ownerUserId: user })
}

const enqueue = (store: MemoryTaskStore, taskType: string, input: unknown, extra: Partial<Parameters<typeof enqueueTask>[0]> = {}) =>
  enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType, input, ...extra })

describe('orkestratör uçtan uca', () => {
  it('etkisiz test görevini kuyruktan alýp tamamlar', async () => {
    const { store, deps } = setup()
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'merhaba' })
    expect(r.ok).toBe(true)

    const tick = await runWorkerTick(store, { deps })
    expect(tick.processed).toHaveLength(1)
    const task = await store.getTask(tick.processed[0].taskId, 'ws1')
    expect(task?.status).toBe('succeeded')
    expect(task?.result).toMatchObject({ echo: 'merhaba' })
    expect((await store.listSteps(task!.id))[0].status).toBe('succeeded')
    expect(store.audits.some((a) => a.action === 'task.created')).toBe(true)
  })

  it('model planý þemaya uymuyorsa hiçbir araç çalýþtýrýlmaz', async () => {
    const run = jest.fn(async () => ({}))
    const spy: AnyTool = { ...echoTool, run }
    const { store, deps } = setup({
      planReply: JSON.stringify({ version: 1, taskType: 'auto', steps: [{ key: 'x', tool: 'shell.exec', input: { cmd: 'rm -rf /' } }] }),
      tools: [spy],
      types: { auto: { ...TASK_TYPES.auto, allowedTools: ['echo.test'] } },
    })
    await createWs(store)
    const r = await enqueue(store, 'auto', { request: 'sunucuyu sil' })
    await runWorkerTick(store, { deps })
    const task = await store.getTask((r as { task: { id: string } }).task.id, 'ws1')
    expect(task?.status).toBe('failed')
    expect(task?.errorCode).toBe('invalid_plan')
    expect(run).not.toHaveBeenCalled()
  })

  it('geçerli model planýný çalýþtýrýr ve model çaðrýsýný kaydeder', async () => {
    const { store, deps } = setup({
      planReply: JSON.stringify({ version: 1, taskType: 'auto', steps: [{ key: 'say', tool: 'echo.test', input: { message: 'plan ok' } }] }),
      types: { auto: { ...TASK_TYPES.auto, allowedTools: ['echo.test'] } },
    })
    await createWs(store)
    const r = await enqueue(store, 'auto', { request: 'bir test yap' })
    await runWorkerTick(store, { deps })
    const task = await store.getTask((r as { task: { id: string } }).task.id, 'ws1')
    expect(task?.status).toBe('succeeded')
    expect(task?.modelCalls).toBe(1)
    expect(store.calls[0]).toMatchObject({ provider: 'mock', purpose: 'plan', status: 'ok', taskId: task!.id, workspaceId: 'ws1' })
  })

  it('model kapalýyken (off) serbest isteði kuralla sýnýflandýrýr', async () => {
    const audit: AnyTool = {
      name: 'seo.audit',
      description: 'fake',
      risk: 'safe',
      inputSchema: z.object({ url: z.string() }).strict(),
      timeoutMs: 1000,
      run: async (i: { url: string }) => ({ audited: i.url }),
    }
    const { store, deps } = setup({ tools: [echoTool, audit] })
    deps.aiMode = 'off'
    await createWs(store)
    const r = await enqueue(store, 'auto', { request: 'þu siteyi denetle: example.com lütfen' })
    await runWorkerTick(store, { deps })
    const task = await store.getTask((r as { task: { id: string } }).task.id, 'ws1')
    expect(task?.status).toBe('succeeded')
    expect(task?.result).toEqual({ audited: 'example.com' })
    expect(task?.modelCalls).toBe(0)
  })

  it('zaman aþýmýnda retry_wait, deneme sýnýrýnda failed olur', async () => {
    const slow: AnyTool = { ...echoTool, timeoutMs: 20, run: () => new Promise((r) => setTimeout(() => r({}), 200)) }
    const { store, deps, advance } = setup({ tools: [slow] })
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    const id = (r as { task: { id: string } }).task.id

    await runWorkerTick(store, { deps })
    let t = await store.getTask(id, 'ws1')
    expect(t?.status).toBe('retry_wait')
    expect(t?.attemptCount).toBe(1)

    advance(60 * 60_000)
    await runWorkerTick(store, { deps })
    t = await store.getTask(id, 'ws1')
    expect(t?.status).toBe('retry_wait')

    advance(60 * 60_000)
    await runWorkerTick(store, { deps })
    t = await store.getTask(id, 'ws1')
    expect(t?.status).toBe('failed')
    expect(t?.errorCode).toBe('timeout')
  })

  it('çýktý boyutu sýnýrýný aþan aracý baþarýsýz sayar', async () => {
    const big: AnyTool = { ...echoTool, run: async () => ({ blob: 'x'.repeat(5000) }) }
    const { store, deps } = setup({ tools: [big] })
    deps.limits = { maxOutputBytes: 1000 }
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    await runWorkerTick(store, { deps })
    expect((await store.getTask((r as { task: { id: string } }).task.id, 'ws1'))?.errorCode).toBe('output_too_large')
  })

  it('plan DB’de izinsiz araca çevrilirse çalýþma anýnda reddedilir', async () => {
    const { store, deps } = setup()
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    const id = (r as { task: { id: string } }).task.id
    const row = store.tasks.get(id)!
    row.plan = { version: 1, taskType: 'echo.test', steps: [{ key: 'echo', tool: 'seo.audit', input: { url: 'a.com' } }] }
    await runWorkerTick(store, { deps })
    expect((await store.getTask(id, 'ws1'))?.errorCode).toBe('tool_not_allowed')
  })

  it('iptal edilen görevde araç çalýþtýrýlmaz', async () => {
    const run = jest.fn(async () => ({}))
    const { store, deps } = setup({ tools: [{ ...echoTool, run }] })
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    const id = (r as { task: { id: string } }).task.id
    const claimed = await store.claimNextTask(90_000)
    await store.cancelTask(id, 'ws1', ['planning'])
    const outcome = await runTask(claimed!, deps)
    expect(outcome.status).toBe('cancelled')
    expect(run).not.toHaveBeenCalled()
  })
})

describe('kuyruk, idempotency ve kurtarma', () => {
  it('ayný idempotency anahtarý ikinci görev oluþturmaz', async () => {
    const { store } = setup()
    await createWs(store)
    const a = await enqueue(store, 'echo.test', { message: 'x' }, { idempotencyKey: 'order-123-abc' })
    const b = await enqueue(store, 'echo.test', { message: 'x' }, { idempotencyKey: 'order-123-abc' })
    expect(a.ok && b.ok).toBe(true)
    expect((a as { task: { id: string } }).task.id).toBe((b as { task: { id: string } }).task.id)
    expect((b as { created: boolean }).created).toBe(false)
    expect(store.tasks.size).toBe(1)
  })

  it('geçersiz girdi ve bilinmeyen görev türünü reddeder', async () => {
    const { store } = setup()
    await createWs(store)
    expect(await enqueue(store, 'shell', {})).toMatchObject({ ok: false, code: 'unknown_task_type' })
    expect(await enqueue(store, 'echo.test', { message: '' })).toMatchObject({ ok: false, code: 'invalid_input' })
    expect(await enqueue(store, 'echo.test', { message: 'x'.repeat(30_000) })).toMatchObject({ ok: false, status: 413 })
  })

  it('worker çökmesinden sonra lease süresi dolunca iþ kurtarýlýr, biten adým tekrar çalýþmaz', async () => {
    const sideEffect = jest.fn(async (i: { message: string }) => ({ done: i.message }))
    const second = jest.fn(async () => ({ ok: true }))
    const tools: AnyTool[] = [
      { ...echoTool, name: 'step.one', run: sideEffect },
      { ...echoTool, name: 'step.two', run: second },
    ]
    const types: Record<string, TaskTypeDef> = {
      two: {
        type: 'two',
        label: 'iki adým',
        planner: 'static',
        allowedTools: ['step.one', 'step.two'],
        inputSchema: z.object({ message: z.string() }).strict(),
        staticPlan: (input) => ({
          version: 1,
          taskType: 'two',
          steps: [
            { key: 'one', tool: 'step.one', input },
            { key: 'two', tool: 'step.two', input },
          ],
        }),
        creditCost: 0,
      },
    }
    const { store, deps, advance } = setup({ tools, types })
    await createWs(store)
    const r = await enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType: 'two', input: { message: 'x' } }).catch(() => null)
    // `two` global TASK_TYPES'ta yok; doðrudan store'a yaz
    expect(r).toMatchObject({ ok: false })
    await store.createTask({ id: 't-crash', workspaceId: 'ws1', createdBy: 'u1', taskType: 'two', input: { message: 'x' }, idempotencyKey: null, budgetUsd: 0.05, maxAttempts: 3 })

    // Ýlk adým bitti, ikinci adýmda worker "çöktü"
    second.mockImplementationOnce(async () => {
      throw Object.assign(new Error('crash'), { crash: true })
    })
    const claimed = await store.claimNextTask(90_000)
    const crashingDeps = { ...deps, store: Object.assign(Object.create(store), {}) }
    // Çökme simülasyonu: hata sonrasý durum geçiþini engelle (worker süreci öldü)
    crashingDeps.store.transition = async (...a: Parameters<MemoryTaskStore['transition']>) =>
      a[3] === 'running' ? store.transition(...a) : false
    await runTask(claimed!, crashingDeps)
    expect(store.tasks.get('t-crash')!.status).toBe('running')
    expect(sideEffect).toHaveBeenCalledTimes(1)

    advance(5 * 60_000)
    const tick = await runWorkerTick(store, { deps })
    expect(tick.recovered).toBe(1)
    const t = store.tasks.get('t-crash')!
    expect(t.status).toBe('succeeded')
    expect(t.attemptCount).toBe(1)
    expect(sideEffect).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
  })

  it('deneme sýnýrý dolunca kurtarýlamayan iþ failed olur', async () => {
    const { store, advance } = setup()
    await createWs(store)
    await store.createTask({ id: 't1', workspaceId: 'ws1', createdBy: 'u1', taskType: 'echo.test', input: { message: 'x' }, idempotencyKey: null, budgetUsd: 0, maxAttempts: 2 })
    for (let i = 0; i < 2; i++) {
      await store.claimNextTask(1000)
      advance(2000)
      await store.recoverExpiredLeases()
    }
    expect(store.tasks.get('t1')).toMatchObject({ status: 'failed', errorCode: 'lease_expired' })
  })
})
