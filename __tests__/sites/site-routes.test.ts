/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

let currentUser: { id: string; email: string; name: string } | null = null
jest.mock('@/lib/auth/session', () => ({ getSessionUser: async () => currentUser }))
jest.mock('@/lib/mailer', () => ({ createMailTransporter: () => ({ sendMail: async () => ({}) }), MAIL_FROM: 'x@y', MAIL_ADMIN: 'x@y' }))

import { MemoryTaskStore } from '@/lib/ai/memory-store'
import { setStoreForTests } from '@/lib/ai/store'
import { siteContentHash } from '@/lib/agents/tools/site'
import { PLAN_PERIOD_MS } from '@/lib/billing/plans'
import { buildTemplateSite } from '@/lib/sites/templates'
import { GET as publicSite } from '@/app/s/[...path]/route'
import { POST as lead } from '@/app/api/sites/lead/route'
import { GET as getSite, PUT as putSite } from '@/app/api/sites/[siteId]/route'
import { GET as preview } from '@/app/api/sites/[siteId]/preview/route'

const env = process.env as Record<string, string | undefined>
let store: MemoryTaskStore
const SITE = '00000000-0000-4000-8000-0000000000aa'

beforeEach(async () => {
  env.AI_ORCHESTRATOR_ENABLED = '1'
  env.AI_STORE = 'memory'
  store = new MemoryTaskStore()
  setStoreForTests(store)
  await store.createWorkspace({ id: 'wsA', name: 'A', ownerUserId: 'alice' })
  await store.createWorkspace({ id: 'wsB', name: 'B', ownerUserId: 'bob' })
  await store.createSite({ id: SITE, workspaceId: 'wsA', slug: 'demir-kuafor', name: 'Demir', taskId: null })
  const schema = buildTemplateSite({ businessName: 'Demir Kuaför', sector: 'Kuaför', city: 'İzmir' })
  await store.addSiteVersion({ siteId: SITE, workspaceId: 'wsA', schema, contentHash: siteContentHash(schema), source: 'template', taskId: null, createdBy: null })
  currentUser = { id: 'alice', email: 'a@x.com', name: 'A' }
})
afterAll(() => {
  setStoreForTests(null)
  delete env.AI_ORCHESTRATOR_ENABLED
  delete env.AI_STORE
})

const pub = (path: string[]) => publicSite(new NextRequest(`http://localhost/s/${path.join('/')}`), { params: Promise.resolve({ path }) })

describe('site rotaları', () => {
  it('taslak site herkese açık değil; yayın + aktif plan ile açılır, plan bitince askıya alınır', async () => {
    expect((await pub(['demir-kuafor'])).status).toBe(404)
    await store.publishSiteVersion(SITE, 'wsA', 1, (await store.getSiteVersion(SITE, 1))!.contentHash)
    expect((await pub(['demir-kuafor'])).status).toBe(503)

    await store.extendWorkspacePlan('wsA', 'starter', PLAN_PERIOD_MS)
    const ok = await pub(['demir-kuafor'])
    expect(ok.status).toBe(200)
    expect(ok.headers.get('content-security-policy')).toContain("default-src 'none'")
    expect(await ok.text()).toContain('Demir Kuaför')
    expect((await pub(['demir-kuafor', 'hakkimizda'])).status).toBe(200)
    expect((await pub(['demir-kuafor', 'yok'])).status).toBe(404)
  })

  it('önizleme yalnız sahibine; başka workspace 404', async () => {
    const req = (q = '') => new NextRequest(`http://localhost/api/sites/${SITE}/preview${q}`)
    expect((await preview(req(), { params: Promise.resolve({ siteId: SITE }) })).status).toBe(200)
    currentUser = { id: 'bob', email: 'b@x.com', name: 'B' }
    expect((await preview(req('?workspaceId=wsA'), { params: Promise.resolve({ siteId: SITE }) })).status).toBe(404)
    expect((await getSite(new NextRequest(`http://localhost/api/sites/${SITE}`), { params: Promise.resolve({ siteId: SITE }) })).status).toBe(404)
  })

  it('manuel düzenleme yeni sürüm yazar; geçersiz şema ve eski sürüm reddedilir', async () => {
    const detail = await (await getSite(new NextRequest(`http://localhost/api/sites/${SITE}`), { params: Promise.resolve({ siteId: SITE }) })).json()
    const schema = detail.version.schema
    schema.pages[0].sections[0].title = 'Yeni başlık'
    const put = (body: unknown) =>
      putSite(new NextRequest(`http://localhost/api/sites/${SITE}`, { method: 'PUT', body: JSON.stringify(body) }), { params: Promise.resolve({ siteId: SITE }) })

    expect((await put({ baseVersion: 1, schema })).status).toBe(200)
    expect((await store.getSite(SITE, 'wsA'))!.currentVersion).toBe(2)
    expect((await put({ baseVersion: 1, schema })).status).toBe(409)
    schema.pages[0].sections[0].image = 'javascript:alert(1)'
    expect((await put({ baseVersion: 2, schema })).status).toBe(400)
  })

  it('form: yalnız yayındaki siteye kayıt; bot tuzağı kayıt yazmaz', async () => {
    const send = (fields: Record<string, string>) => {
      const fd = new URLSearchParams(fields)
      return lead(new NextRequest('http://localhost/api/sites/lead', { method: 'POST', body: fd, headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': '7.7.7.7' } }))
    }
    expect((await send({ site: 'demir-kuafor', name: 'Ali', message: 'Merhaba' })).status).toBe(404)

    await store.extendWorkspacePlan('wsA', 'starter', PLAN_PERIOD_MS)
    await store.publishSiteVersion(SITE, 'wsA', 1, (await store.getSiteVersion(SITE, 1))!.contentHash)
    const ok = await send({ site: 'demir-kuafor', name: 'Ali', message: 'Randevu istiyorum', phone: '0555' })
    expect(ok.status).toBe(303)
    expect(ok.headers.get('location')).toContain('gonderildi=1')
    await send({ site: 'demir-kuafor', name: 'Bot', message: 'spam', website: 'http://spam' })
    expect(store.siteLeads).toHaveLength(1)
    expect(store.siteLeads[0]).toMatchObject({ name: 'Ali', workspaceId: 'wsA' })
  })
})
