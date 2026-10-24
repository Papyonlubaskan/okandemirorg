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
  await store.addCredits(ws, 10, 'admin', `seed:${ws}`)
}

const enqueue = (store: MemoryTaskStore, taskType: string, input: unknown, extra: Partial<Parameters<typeof enqueueTask>[0]> = {}) =>
  enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType, input, ...extra })

describe('orkestrat?r u?tan uca', () => {
  it('etkisiz test g?revini kuyruktan al?p tamamlar', async () => {
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

  it('model plan? ?emaya uymuyorsa hi?bir ara? ?al??t?r?lmaz', async () => {
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

  it('ge?erli model plan?n? ?al??t?r?r ve model ?a?r?s?n? kaydeder', async () => {
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

  it('model kapal?yken (off) serbest iste?i kuralla s?n?fland?r?r', async () => {
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
    const r = await enqueue(store, 'auto', { request: '?u siteyi denetle: example.com l?tfen' })
    await runWorkerTick(store, { deps })
    const task = await store.getTask((r as { task: { id: string } }).task.id, 'ws1')
    expect(task?.status).toBe('succeeded')
    expect(task?.result).toEqual({ audited: 'example.com' })
    expect(task?.modelCalls).toBe(0)
  })

  it('zaman a??m?nda retry_wait, deneme s?n?r?nda failed olur', async () => {
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

  it('??kt? boyutu s?n?r?n? a?an arac? ba?ar?s?z sayar', async () => {
    const big: AnyTool = { ...echoTool, run: async () => ({ blob: 'x'.repeat(5000) }) }
    const { store, deps } = setup({ tools: [big] })
    deps.limits = { maxOutputBytes: 1000 }
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    await runWorkerTick(store, { deps })
    expect((await store.getTask((r as { task: { id: string } }).task.id, 'ws1'))?.errorCode).toBe('output_too_large')
  })

  it('plan DB?de izinsiz araca ?evrilirse ?al??ma an?nda reddedilir', async () => {
    const { store, deps } = setup()
    await createWs(store)
    const r = await enqueue(store, 'echo.test', { message: 'x' })
    const id = (r as { task: { id: string } }).task.id
    const row = store.tasks.get(id)!
    row.plan = { version: 1, taskType: 'echo.test', steps: [{ key: 'echo', tool: 'seo.audit', input: { url: 'a.com' } }] }
    await runWorkerTick(store, { deps })
    expect((await store.getTask(id, 'ws1'))?.errorCode).toBe('tool_not_allowed')
  })

  it('iptal edilen g?revde ara? ?al??t?r?lmaz', async () => {
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
  it('ayn? idempotency anahtar? ikinci g?rev olu?turmaz', async () => {
    const { store } = setup()
    await createWs(store)
    const a = await enqueue(store, 'echo.test', { message: 'x' }, { idempotencyKey: 'order-123-abc' })
    const b = await enqueue(store, 'echo.test', { message: 'x' }, { idempotencyKey: 'order-123-abc' })
    expect(a.ok && b.ok).toBe(true)
    expect((a as { task: { id: string } }).task.id).toBe((b as { task: { id: string } }).task.id)
    expect((b as { created: boolean }).created).toBe(false)
    expect(store.tasks.size).toBe(1)
  })

  it('ge?ersiz girdi ve bilinmeyen g?rev t?r?n? reddeder', async () => {
    const { store } = setup()
    await createWs(store)
    expect(await enqueue(store, 'shell', {})).toMatchObject({ ok: false, code: 'unknown_task_type' })
    expect(await enqueue(store, 'echo.test', { message: '' })).toMatchObject({ ok: false, code: 'invalid_input' })
    expect(await enqueue(store, 'echo.test', { message: 'x'.repeat(30_000) })).toMatchObject({ ok: false, status: 413 })
  })

  it('worker ??kmesinden sonra lease s?resi dolunca i? kurtar?l?r, biten ad?m tekrar ?al??maz', async () => {
    const sideEffect = jest.fn(async (i: { message: string }) => ({ done: i.message }))
    const second = jest.fn(async () => ({ ok: true }))
    const tools: AnyTool[] = [
      { ...echoTool, name: 'step.one', run: sideEffect },
      { ...echoTool, name: 'step.two', run: second },
    ]
    const types: Record<string, TaskTypeDef> = {
      two: {
        type: 'two',
        label: 'iki ad?m',
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
        userCreatable: false,
      },
    }
    const { store, deps, advance } = setup({ tools, types })
    await createWs(store)
    const r = await enqueueTask({ store, workspaceId: 'ws1', userId: 'u1', role: 'owner', taskType: 'two', input: { message: 'x' } }).catch(() => null)
    // `two` global TASK_TYPES'ta yok; do?rudan store'a yaz
    expect(r).toMatchObject({ ok: false })
    await store.createTask({ id: 't-crash', workspaceId: 'ws1', createdBy: 'u1', taskType: 'two', input: { message: 'x' }, idempotencyKey: null, budgetUsd: 0.05, maxAttempts: 3 })

    // ?lk ad?m bitti, ikinci ad?mda worker "??kt?"
    second.mockImplementationOnce(async () => {
      throw Object.assign(new Error('crash'), { crash: true })
    })
    const claimed = await store.claimNextTask(90_000)
    const crashingDeps = { ...deps, store: Object.assign(Object.create(store), {}) }
    // ??kme sim?lasyonu: hata sonras? durum ge?i?ini engelle (worker s?reci ?ld?)
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

  it('deneme s?n?r? dolunca kurtar?lamayan i? failed olur', async () => {
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
