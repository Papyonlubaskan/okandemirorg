/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

let currentUser: { id: string; email: string; name: string } | null = null
jest.mock('@/lib/auth/session', () => ({ getSessionUser: async () => currentUser }))

import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { setStoreForTests } from '@/lib/ai/store'
import { GET as getApproval, POST as decide } from '@/app/api/ai/approvals/[approvalId]/route'
import { GET as getTask, DELETE as cancelTask } from '@/app/api/ai/tasks/[taskId]/route'
import { GET as listTasks, POST as createTask } from '@/app/api/ai/tasks/route'
import { GET as usage } from '@/app/api/ai/usage/route'
import { POST as tick } from '@/app/api/ai/worker/tick/route'

const env = process.env as Record<string, string | undefined>
const url = (path: string) => `http://localhost${path}`
const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  new NextRequest(url(path), { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } })
const params = <T extends Record<string, string>>(p: T) => ({ params: Promise.resolve(p) })

let store: MemoryTaskStore

beforeEach(async () => {
  env.AI_ORCHESTRATOR_ENABLED = '1'
  env.AI_STORE = 'memory'
  store = new MemoryTaskStore()
  setStoreForTests(store)
  await store.createWorkspace({ id: 'wsA', name: 'A', ownerUserId: 'alice' })
  await store.createWorkspace({ id: 'wsB', name: 'B', ownerUserId: 'bob' })
  store.addMember('wsA', 'mallory', 'member')
  currentUser = { id: 'alice', email: 'a@x.com', name: 'Alice' }
})

afterAll(() => {
  setStoreForTests(null)
  delete env.AI_ORCHESTRATOR_ENABLED
  delete env.AI_STORE
})

async function aliceTask() {
  currentUser = { id: 'alice', email: 'a@x.com', name: 'Alice' }
  const res = await createTask(post('/api/ai/tasks', { taskType: 'echo.test', input: { message: 'gizli' } }))
  expect(res.status).toBe(202)
  return (await res.json()).task.id as string
}

describe('API: kimlik, workspace izolasyonu, bayrak', () => {
  it('bayrak kapalıyken 404', async () => {
    env.AI_ORCHESTRATOR_ENABLED = '0'
    expect((await listTasks(new NextRequest(url('/api/ai/tasks')))).status).toBe(404)
  })

  it('oturum yoksa 401', async () => {
    currentUser = null
    expect((await listTasks(new NextRequest(url('/api/ai/tasks')))).status).toBe(401)
  })

  it('başka workspace’in görevini okuyamaz, iptal edemez (404)', async () => {
    const id = await aliceTask()
    currentUser = { id: 'bob', email: 'b@x.com', name: 'Bob' }

    const asBob = await getTask(new NextRequest(url(`/api/ai/tasks/${id}`)), params({ taskId: id }))
    expect(asBob.status).toBe(404)
    const crossWs = await getTask(new NextRequest(url(`/api/ai/tasks/${id}?workspaceId=wsA`)), params({ taskId: id }))
    expect(crossWs.status).toBe(404)
    const cancel = await cancelTask(new NextRequest(url(`/api/ai/tasks/${id}?workspaceId=wsA`), { method: 'DELETE' }), params({ taskId: id }))
    expect(cancel.status).toBe(404)
    expect(store.tasks.get(id)!.status).toBe('queued')

    const list = await (await listTasks(new NextRequest(url('/api/ai/tasks')))).json()
    expect(list.workspaceId).toBe('wsB')
    expect(list.tasks).toHaveLength(0)
  })

  it('istemcinin gönderdiği workspaceId üyelik olmadan işe yaramaz', async () => {
    currentUser = { id: 'bob', email: 'b@x.com', name: 'Bob' }
    const res = await createTask(post('/api/ai/tasks', { workspaceId: 'wsA', taskType: 'echo.test', input: { message: 'x' } }))
    expect(res.status).toBe(404)
    expect([...store.tasks.values()].some((t) => t.workspaceId === 'wsA')).toBe(false)
  })

  it('üye kendi workspace görevini görür; kullanım raporu üyeye kapalı', async () => {
    const id = await aliceTask()
    currentUser = { id: 'mallory', email: 'm@x.com', name: 'M' }
    expect((await getTask(new NextRequest(url(`/api/ai/tasks/${id}?workspaceId=wsA`)), params({ taskId: id }))).status).toBe(200)
    expect((await usage(new NextRequest(url('/api/ai/usage?workspaceId=wsA')))).status).toBe(403)
  })

  it('Idempotency-Key başlığı ikinci görev oluşturmaz', async () => {
    const body = { taskType: 'echo.test', input: { message: 'x' } }
    const a = await createTask(post('/api/ai/tasks', body, { 'idempotency-key': 'client-key-0001' }))
    const b = await createTask(post('/api/ai/tasks', body, { 'idempotency-key': 'client-key-0001' }))
    expect(a.status).toBe(202)
    expect(b.status).toBe(200)
    expect((await a.json()).task.id).toBe((await b.json()).task.id)
  })

  it('worker tick dahili anahtar ister; görevi tamamlar ve sonuç sahibine görünür', async () => {
    env.INTERNAL_API_KEY = 'test-internal-key'
    const id = await aliceTask()
    expect((await tick(post('/api/ai/worker/tick', {}))).status).toBe(401)
    const ok = await tick(post('/api/ai/worker/tick', {}, { 'x-api-key': 'test-internal-key' }))
    expect(ok.status).toBe(200)

    const detail = await (await getTask(new NextRequest(url(`/api/ai/tasks/${id}`)), params({ taskId: id }))).json()
    expect(detail.task.status).toBe('succeeded')
    expect(detail.task.result).toMatchObject({ echo: 'gizli' })
    expect(detail.task).not.toHaveProperty('leaseOwner')
    delete env.INTERNAL_API_KEY
  })

  it('başka workspace’in onayını okuyamaz ve karar veremez', async () => {
    await store.createTask({ id: 'tB', workspaceId: 'wsB', createdBy: 'bob', taskType: 'echo.test', input: {}, idempotencyKey: null, budgetUsd: 0, maxAttempts: 3 })
    const approval = await store.createApproval({
      id: 'apB',
      workspaceId: 'wsB',
      taskId: 'tB',
      stepKey: 's',
      actionType: 'site.publish',
      payloadHash: 'a'.repeat(64),
      payloadVersion: 1,
      summary: { tool: 'site.publish', summary: 'x' },
      ttlMs: 60_000,
    })
    currentUser = { id: 'alice', email: 'a@x.com', name: 'Alice' }
    expect((await getApproval(new NextRequest(url(`/api/ai/approvals/${approval.id}?workspaceId=wsB`)), params({ approvalId: approval.id }))).status).toBe(404)
    const res = await decide(post(`/api/ai/approvals/${approval.id}`, { decision: 'approve', payloadHash: 'a'.repeat(64) }), params({ approvalId: approval.id }))
    expect(res.status).toBe(404)
    expect(store.approvals.get('apB')!.status).toBe('pending')
  })
})
