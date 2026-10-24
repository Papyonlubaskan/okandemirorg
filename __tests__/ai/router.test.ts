/**
 * @jest-environment node
 */
import type { ModelEntry } from '@/lib/ai/catalog'
import { createMockProvider } from '@/lib/ai/providers/mock'
import { selectCandidates, type RouteContext } from '@/lib/ai/router'

const entry = (over: Partial<ModelEntry>): ModelEntry => ({
  key: 'x',
  provider: 'mock',
  model: () => 'm',
  tier: 'free',
  purposes: ['classify', 'plan', 'generate'],
  jsonMode: true,
  quota: { status: 'unknown' },
  pricing: { inputPer1M: 0, outputPer1M: 0 },
  commercialUse: 'unverified',
  enabled: () => true,
  ...over,
})

const base = (over: Partial<RouteContext> = {}): RouteContext => ({
  purpose: 'plan',
  allowPaid: false,
  remainingBudgetUsd: 0.05,
  estimatedInputTokens: 1000,
  maxOutputTokens: 1000,
  usage: {},
  providers: { mock: createMockProvider(), openai: createMockProvider() },
  ...over,
})

describe('selectCandidates', () => {
  const free = entry({ key: 'free' })
  const paid = entry({ key: 'paid', provider: 'openai', tier: 'paid', pricing: { inputPer1M: 1, outputPer1M: 2 } })

  it('ücretsiz modeli ücretliden önce sıralar', () => {
    const r = selectCandidates(base({ allowPaid: true, catalog: [paid, free] }))
    expect(r.candidates.map((c) => c.key)).toEqual(['free', 'paid'])
  })

  it('bilinmeyen kotayı sınırsız saymaz (günlük üst sınır uygulanır)', () => {
    process.env.AI_UNKNOWN_QUOTA_DAILY_CAP = '5'
    const r = selectCandidates(base({ catalog: [free], usage: { free: { requests: 5 } } }))
    expect(r.candidates).toHaveLength(0)
    expect(r.rejected).toEqual([{ key: 'free', reason: 'quota' }])
    delete process.env.AI_UNKNOWN_QUOTA_DAILY_CAP
  })

  it('politika izin vermiyorsa ücretli model seçilmez', () => {
    const r = selectCandidates(base({ allowPaid: false, catalog: [paid] }))
    expect(r.candidates).toHaveLength(0)
    expect(r.rejected[0].reason).toBe('paid_not_allowed')
  })

  it('bütçe yetmiyorsa ücretli model seçilmez', () => {
    const r = selectCandidates(base({ allowPaid: true, remainingBudgetUsd: 0.000001, catalog: [paid] }))
    expect(r.rejected[0].reason).toBe('budget')
  })

  it('yapılandırılmamış sağlayıcıyı ve uyumsuz amacı eler', () => {
    const noKey = entry({ key: 'nokey', provider: 'groq' })
    const quality = entry({ key: 'q', purposes: ['quality'] })
    const r = selectCandidates(base({ catalog: [noKey, quality] }))
    expect(r.rejected).toEqual([
      { key: 'nokey', reason: 'not_configured' },
      { key: 'q', reason: 'purpose' },
    ])
  })

  it('JSON gereken işte JSON modu olmayanı eler', () => {
    const r = selectCandidates(base({ json: true, catalog: [entry({ key: 'nojson', jsonMode: false })] }))
    expect(r.rejected[0].reason).toBe('json')
  })
})
