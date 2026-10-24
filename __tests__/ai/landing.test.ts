/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

let currentUser: { id: string; email: string; name: string } | null = null
jest.mock('@/lib/auth/session', () => ({ getSessionUser: async () => currentUser }))

import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { setStoreForTests } from '@/lib/ai/store'
import { decideApproval } from '@/lib/agents/approvals'
import { enqueueTask } from '@/lib/jobs/queue'
import { defaultOrchestratorDeps, runWorkerTick } from '@/lib/jobs/worker'
import { sanitizeLandingHtml } from '@/lib/security/sanitize-html'
import { GET as preview } from '@/app/api/ai/drafts/[draftId]/preview/route'
import { GET as publicSite } from '@/app/s/[...path]/route'

const env = process.env as Record<string, string | undefined>
let store: MemoryTaskStore

const brief = { businessName: 'Demir Mobilya', city: 'Ýzmir', service: 'Özel mobilya', whatsapp: '905551112233' }

beforeEach(async () => {
  env.AI_ORCHESTRATOR_ENABLED = '1'
  env.AI_STORE = 'memory'
  delete env.USE_LLM
  delete env.AI_PROVIDER_MODE
  store = new MemoryTaskStore()
  setStoreForTests(store)
  await store.createWorkspace({ id: 'wsA', name: 'A', ownerUserId: 'alice' })
  await store.createWorkspace({ id: 'wsB', name: 'B', ownerUserId: 'bob' })
  await store.addCredits('wsA', 10, 'admin', 'seed')
  currentUser = { id: 'alice', email: 'a@x.com', name: 'A' }
})
afterAll(() => {
  setStoreForTests(null)
  delete env.AI_ORCHESTRATOR_ENABLED
  delete env.AI_STORE
})

const deps = () => defaultOrchestratorDeps(store)
const enqueue = (taskType: string, input: unknown) =>
  enqueueTask({ store, workspaceId: 'wsA', userId: 'alice', role: 'owner', taskType, input })

async function makeDraft() {
  const r = await enqueue('landing.draft', brief)
  expect(r.ok).toBe(true)
  await runWorkerTick(store, { deps: deps() })
  const task = store.tasks.get((r as { task: { id: string } }).task.id)!
  expect(task.status).toBe('succeeded')
  return task.result as { draftId: string; contentHash: string; slug: string; previewPath: string }
}

describe('sanitizeLandingHtml', () => {
  it('script, olay öznitelikleri, javascript: ve form kaldýrýlýr', () => {
    const out = sanitizeLandingHtml(
      '<h1 onclick="steal()">X</h1><script>alert(1)</script><a href="javascript:alert(1)">a</a><form action="https://evil"><input></form><iframe src="x"></iframe><meta http-equiv="refresh" content="0;url=https://evil">'
    )
    expect(out).not.toMatch(/script|onclick|javascript:|<form|<iframe|http-equiv/i)
    expect(out).toContain('<h1>X</h1>')
  })
})

describe('landing taslak › onaylý yayýn', () => {
  it('taslak 3 kredi düþer, HTML sonuçta yer almaz, yayýnda deðildir', async () => {
    const d = await makeDraft()
    expect(await store.getCreditBalance('wsA')).toBe(7)
    expect(JSON.stringify(d)).not.toContain('<html')
    expect(store.drafts.get(d.draftId)!.status).toBe('draft')
    const res = await publicSite(new NextRequest(`http://localhost/s/${d.slug}`), { params: Promise.resolve({ path: [d.slug] }) })
    expect(res.status).toBe(404)
  })

  it('onay olmadan yayýnlanmaz; onaydan sonra sandbox baþlýklarýyla yayýnda', async () => {
    const d = await makeDraft()
    const r = await enqueue('landing.publish', { draftId: d.draftId, contentHash: d.contentHash })
    const pubId = (r as { task: { id: string } }).task.id
    await runWorkerTick(store, { deps: deps() })
    expect(store.tasks.get(pubId)!.status).toBe('awaiting_approval')
    expect(store.drafts.get(d.draftId)!.status).toBe('draft')

    const [a] = await store.listPendingApprovals('wsA')
    expect(a.summary.effects?.join(' ')).toContain('noindex')
    await decideApproval({ store, approvalId: a.id, workspaceId: 'wsA', userId: 'alice', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })
    await runWorkerTick(store, { deps: deps() })
    expect(store.tasks.get(pubId)!.status).toBe('succeeded')

    const res = await publicSite(new NextRequest(`http://localhost/s/${d.slug}`), { params: Promise.resolve({ path: [d.slug] }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-security-policy')).toContain('sandbox')
    expect(res.headers.get('x-robots-tag')).toContain('noindex')
    expect(await res.text()).toContain('Demir Mobilya')
  })

  it('taslak içeriði onaydan sonra deðiþirse yayýn reddedilir', async () => {
    const d = await makeDraft()
    const r = await enqueue('landing.publish', { draftId: d.draftId, contentHash: d.contentHash })
    const pubId = (r as { task: { id: string } }).task.id
    await runWorkerTick(store, { deps: deps() })
    const [a] = await store.listPendingApprovals('wsA')
    await decideApproval({ store, approvalId: a.id, workspaceId: 'wsA', userId: 'alice', role: 'owner', decision: 'approve', payloadHash: a.payloadHash })

    const draft = store.drafts.get(d.draftId)!
    draft.html = '<html>deðiþti</html>'
    draft.contentHash = 'f'.repeat(64)
    await runWorkerTick(store, { deps: deps() })
    expect(store.drafts.get(d.draftId)!.status).toBe('draft')
    expect(store.tasks.get(pubId)).toMatchObject({ status: 'failed', errorCode: 'draft_changed' })
  })

  it('önizleme yalnýz ayný workspace üyesine; sandbox CSP ile', async () => {
    const d = await makeDraft()
    const ok = await preview(new NextRequest(`http://localhost${d.previewPath}`), { params: Promise.resolve({ draftId: d.draftId }) })
    expect(ok.status).toBe(200)
    expect(ok.headers.get('content-security-policy')).toContain('sandbox')

    currentUser = { id: 'bob', email: 'b@x.com', name: 'B' }
    const denied = await preview(new NextRequest(`http://localhost${d.previewPath}?workspaceId=wsA`), { params: Promise.resolve({ draftId: d.draftId }) })
    expect(denied.status).toBe(404)
    const own = await preview(new NextRequest(`http://localhost${d.previewPath}`), { params: Promise.resolve({ draftId: d.draftId }) })
    expect(own.status).toBe(404)
  })
})
