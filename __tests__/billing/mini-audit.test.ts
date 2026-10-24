/**
 * @jest-environment node
 */
jest.mock('@/lib/mysql', () => ({
  __esModule: true,
  default: {},
  execute: jest.fn(async () => ({ affectedRows: 1, insertId: 0 })),
  queryOne: jest.fn(async () => undefined),
  query: jest.fn(async () => []),
}))
const crawlMock = jest.fn()
jest.mock('@/lib/ai-audit', () => {
  const actual = jest.requireActual('@/lib/ai-audit')
  return { ...actual, crawlUrl: (...a: unknown[]) => crawlMock(...a) }
})
jest.mock('@/lib/security/ssrf', () => {
  const actual = jest.requireActual('@/lib/security/ssrf')
  return {
    ...actual,
    assertPublicUrl: async (u: string) => {
      if (/localhost|127\.0\.0\.1|169\.254/.test(u)) throw new actual.SsrfError('İç ağ adresi')
      return new URL(u)
    },
  }
})

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/ai/mini-audit/route'

const env = process.env as Record<string, string | undefined>
const req = (body: unknown, ip = '1.2.3.4') =>
  new NextRequest('http://localhost/api/ai/mini-audit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
  })

const signals = {
  url: 'https://example.com/',
  finalUrl: 'https://example.com/',
  status: 200,
  title: '',
  metaDescription: '',
  h1: [],
  h2Count: 0,
  canonical: '',
  hasViewport: false,
  hasOgTitle: false,
  linkCount: 1,
  imageCount: 0,
  imagesMissingAlt: 0,
  wordEstimate: 10,
  hasTelLink: false,
  hasWhatsAppHint: false,
  hasForm: false,
  loadMs: 100,
  htmlBytes: 100,
  errors: [],
}

beforeEach(() => {
  env.AI_STORE = 'memory'
  env.AI_MINI_AUDIT_ENABLED = '1'
  crawlMock.mockReset().mockResolvedValue(signals)
})

describe('POST /api/ai/mini-audit', () => {
  it('bayrak kapalıyken 404', async () => {
    env.AI_MINI_AUDIT_ENABLED = '0'
    expect((await POST(req({ url: 'example.com', email: 'a@b.com' }))).status).toBe(404)
  })

  it('model çağırmadan skor ve en fazla 3 sorun döner', async () => {
    const res = await POST(req({ url: 'example.com', email: 'skor@b.com' }, '9.9.9.1'))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.topIssues.length).toBeLessThanOrEqual(3)
    expect(data.issueCount).toBeGreaterThan(3)
    expect(data).not.toHaveProperty('report')
  })

  it('geçersiz e-posta/URL ve iç ağ adresini reddeder', async () => {
    expect((await POST(req({ url: 'example.com', email: 'x' }, '9.9.9.2'))).status).toBe(400)
    expect((await POST(req({ url: 'a b', email: 'a@b.com' }, '9.9.9.2'))).status).toBe(400)
    expect((await POST(req({ url: 'http://169.254.169.254/', email: 'c@b.com' }, '9.9.9.2'))).status).toBe(400)
    expect(crawlMock).not.toHaveBeenCalled()
  })

  it('e-posta başına günlük sınır uygulanır', async () => {
    const body = { url: 'example.com', email: 'limit@b.com' }
    expect((await POST(req(body, '9.9.9.3'))).status).toBe(200)
    expect((await POST(req(body, '9.9.9.4'))).status).toBe(200)
    expect((await POST(req(body, '9.9.9.5'))).status).toBe(429)
  })
})
