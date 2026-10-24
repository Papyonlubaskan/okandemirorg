/**
 * @jest-environment node
 */
import { z } from 'zod'
import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { computePayloadHash, decideApproval, stableStringify } from '@/lib/agents/approvals'
import type { OrchestratorDeps } from '@/lib/agents/orchestrator'
import { createRegistry } from '@/lib/agents/registry'
import type { TaskTypeDef } from '@/lib/agents/task-types'
import type { ToolDef } from '@/lib/agents/types'
import { runWorkerTick } from '@/lib/jobs/worker'

function setup() {
  let now = new Date('2026-01-01T00:00:00Z')
  const store = new MemoryTaskStore({ now: () => now })
  const publish = jest.fn(async (i: { site: string }) => ({ published: i.site }))
  const publishTool: ToolDef<{ site: string }, { published: string }> = {
    name: 'site.publish',
    description: 'Siteyi herkese açýk yayýnlar',
    risk: 'publish',
    inputSchema: z.object({ site: z.string() }).strict(),
    timeoutMs: 1000,
    describeAction: (i) => ({ summary: `${i.site} yayýnlanacak`, target: i.site, effects: ['Herkese açýk olur'] }),
    run: publish,
  }
  const types: Record<string, TaskTypeDef> = {
    publish: {
      type: 'publish',
      label: 'yayýn',
      planner: 'static',
      allowedTools: ['site.publish'],
      inputSchema: z.object({ site: z.string() }).strict(),
      staticPlan: (input) => ({ version: 1, taskType: 'publish', steps: [{ key: 'pub', tool: 'site.publish', input }] }),
      creditCost: 0,
      userCreatable: false,
    },
  }
  const deps: OrchestratorDeps = {
    store,
    registry: createRegistry([publishTool]),
    aiMode: 'off',
    providers: {},
    allowPaid: async () => false,
    getTaskType: (t) => types[t],
  }
  return { store, deps, publish, advance: (ms: number) => (now = new Date(now.getTime() + ms)) }
}

async function seed(store: MemoryTaskStore) {
  await store.createWorkspace({ id: 'ws1', name: 'A', ownerUserId: 'owner' })
  store.addMember('ws1', 'member', 'member')
  await store.createTask({ id: 't1', workspaceId: 'ws1', createdBy: 'owner', taskType: 'publish', input: { site: 'demo' }, idempotencyKey: null, budgetUsd: 0, maxAttempts: 3 })
}

describe('onay politikasý', () => {
  it('onay yokken yayýn aracý çalýþmaz; özetli onay kaydý oluþur', async () => {
    const { store, deps, publish } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })

    expect(publish).not.toHaveBeenCalled()
    expect(store.tasks.get('t1')!.status).toBe('awaiting_approval')
    const [approval] = await store.listPendingApprovals('ws1')
    expect(approval.summary).toMatchObject({ tool: 'site.publish', summary: 'demo yayýnlanacak', target: 'demo' })
    expect(approval.payloadHash).toBe(computePayloadHash('t1', { key: 'pub', tool: 'site.publish', input: { site: 'demo' } }))

    // Tekrar tick: yeni onay oluþturmaz, araç hâlâ çalýþmaz
    await runWorkerTick(store, { deps })
    expect(publish).not.toHaveBeenCalled()
    expect(store.approvals.size).toBe(1)
  })

  it('üye rolü onay veremez; yanlýþ hash reddedilir', async () => {
    const { store, deps } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')

    const asMember = await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'member', role: 'member', decision: 'approve', payloadHash: a.payloadHash })
    expect(asMember).toMatchObject({ ok: false, code: 'forbidden' })

    const wrongHash = await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: 'x'.repeat(64) })
    expect(wrongHash).toMatchObject({ ok: false, code: 'hash_mismatch' })

    const otherWs = await decideApproval({ store, approvalId: a.id, workspaceId: 'ws2', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })
    expect(otherWs).toMatchObject({ ok: false, code: 'not_found' })
  })

  it('onaydan sonra araç tam bir kez çalýþýr ve onay tüketilir', async () => {
    const { store, deps, publish } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')

    const res = await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })
    expect(res).toEqual({ ok: true, status: 'approved' })
    expect(store.tasks.get('t1')!.status).toBe('queued')

    await runWorkerTick(store, { deps })
    await runWorkerTick(store, { deps })
    expect(publish).toHaveBeenCalledTimes(1)
    expect(store.tasks.get('t1')!.status).toBe('succeeded')
    expect(store.approvals.get(a.id)!.status).toBe('consumed')
    expect(store.audits.map((x) => x.action)).toEqual(expect.arrayContaining(['approval.requested', 'approval.approved']))
  })

  it('payload deðiþirse eski onay geçersiz kalýr ve yeniden onay istenir', async () => {
    const { store, deps, publish } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')
    await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })

    // Onaydan sonra plan girdisi deðiþti
    store.tasks.get('t1')!.plan!.steps[0].input = { site: 'baska-site' }
    await runWorkerTick(store, { deps })

    expect(publish).not.toHaveBeenCalled()
    expect(store.tasks.get('t1')!.status).toBe('awaiting_approval')
    const pending = await store.listPendingApprovals('ws1')
    expect(pending).toHaveLength(1)
    expect(pending[0].payloadVersion).toBe(2)
    expect(pending[0].payloadHash).not.toBe(a.payloadHash)
  })

  it('süresi dolan onay görevi expired yapar', async () => {
    const { store, deps, advance, publish } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')
    advance(25 * 60 * 60 * 1000)

    const late = await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })
    expect(late.ok).toBe(false)
    await runWorkerTick(store, { deps })
    expect(store.tasks.get('t1')!.status).toBe('expired')
    expect(publish).not.toHaveBeenCalled()
  })

  it('ret görevi baþarýsýz kapatýr', async () => {
    const { store, deps, publish } = setup()
    await seed(store)
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')
    await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'owner', role: 'admin', decision: 'reject', payloadHash: a.payloadHash })
    expect(store.tasks.get('t1')).toMatchObject({ status: 'failed', errorCode: 'approval_rejected' })
    await runWorkerTick(store, { deps })
    expect(publish).not.toHaveBeenCalled()
  })

  it('onay sonrasý workspace askýya alýndýysa araç çalýþmaz; onaylayan artýk yetkili deðilse yeniden onay istenir', async () => {
    const { store, deps, publish } = setup()
    await seed(store)
    store.addMember('ws1', 'admin2', 'admin')
    await runWorkerTick(store, { deps })
    const [a] = await store.listPendingApprovals('ws1')
    await decideApproval({ store, approvalId: a.id, workspaceId: 'ws1', userId: 'admin2', role: 'admin', decision: 'approve', payloadHash: a.payloadHash })

    // Onaylayan admin üyelikten çýkarýldý › onay tüketilmez, yeni onay istenir
    store.members.delete('ws1|admin2')
    await runWorkerTick(store, { deps })
    expect(publish).not.toHaveBeenCalled()
    expect(store.tasks.get('t1')!.status).toBe('awaiting_approval')

    // Workspace askýya alýndý › yeni onay verilse bile çalýþmaz
    const [b] = await store.listPendingApprovals('ws1')
    await decideApproval({ store, approvalId: b.id, workspaceId: 'ws1', userId: 'owner', role: 'owner', decision: 'approve', payloadHash: b.payloadHash })
    store.workspaces.get('ws1')!.status = 'suspended'
    await runWorkerTick(store, { deps })
    expect(publish).not.toHaveBeenCalled()
    expect(store.tasks.get('t1')).toMatchObject({ status: 'failed', errorCode: 'workspace_inactive' })
  })

  it('stableStringify anahtar sýrasýndan baðýmsýzdýr', () => {
    expect(stableStringify({ b: 1, a: { d: 2, c: 3 } })).toBe(stableStringify({ a: { c: 3, d: 2 }, b: 1 }))
  })
})
