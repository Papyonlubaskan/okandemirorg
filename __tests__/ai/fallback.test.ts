/**
 * @jest-environment node
 */
import type { ModelEntry } from '@/lib/ai/catalog'
import { createTaskLlm, type ModelCallRecord } from '@/lib/ai/fallback'
import { createOpenAiCompatibleProvider } from '@/lib/ai/providers/openai-compatible'
import type { ModelProvider } from '@/lib/ai/providers/provider'
import { NoModelAvailableError, ProviderError, type ProviderId } from '@/lib/ai/types'

const entry = (key: string, provider: ProviderId, tier: 'free' | 'paid' = 'free'): ModelEntry => ({
  key,
  provider,
  model: () => `${key}-model`,
  tier,
  purposes: ['plan', 'generate'],
  jsonMode: true,
  quota: { status: 'unknown' },
  pricing: tier === 'paid' ? { inputPer1M: 1, outputPer1M: 1 } : { inputPer1M: 0, outputPer1M: 0 },
  commercialUse: 'unverified',
  enabled: () => true,
})

function provider(id: ProviderId, impl: () => Promise<string>): ModelProvider & { count: number } {
  const p = {
    id,
    count: 0,
    isConfigured: () => true,
    async chat(model: string) {
      p.count++
      const content = await impl()
      return { content, usage: { inputTokens: 10, outputTokens: 10 }, provider: id, model, latencyMs: 1 }
    },
  }
  return p
}

const msgs = { messages: [{ role: 'user' as const, content: 'merhaba' }] }

describe('createTaskLlm', () => {
  let records: ModelCallRecord[]
  const deps = (providers: Record<string, ModelProvider>, catalog: ModelEntry[]) => ({
    providers,
    catalog,
    getUsage: async () => ({}),
    record: async (r: ModelCallRecord) => {
      records.push(r)
    },
    sleep: async () => {},
  })
  beforeEach(() => {
    records = []
  })

  it('429’da alternatif sağlayıcıya geçer ve çağrıları kaydeder', async () => {
    const a = provider('groq', async () => {
      throw new ProviderError('rate_limited', '429', { status: 429 })
    })
    const b = provider('gemini', async () => 'ok')
    const llm = createTaskLlm(deps({ groq: a, gemini: b }, [entry('a', 'groq'), entry('b', 'gemini')]), {
      maxCalls: 4,
      budgetUsd: 0.05,
      allowPaid: false,
    })
    const res = await llm.call('plan', msgs)
    expect(res.content).toBe('ok')
    expect(a.count).toBe(1)
    expect(records.map((r) => r.status)).toEqual(['rate_limited', 'ok'])
  })

  it('timeout’ta aynı modeli sınırlı sayıda tekrar dener', async () => {
    const a = provider('groq', async () => {
      throw new ProviderError('timeout', 't')
    })
    const llm = createTaskLlm(deps({ groq: a }, [entry('a', 'groq')]), {
      maxCalls: 10,
      budgetUsd: 0.05,
      allowPaid: false,
      retriesPerModel: 1,
    })
    await expect(llm.call('plan', msgs)).rejects.toMatchObject({ reason: 'all_failed' })
    expect(a.count).toBe(2)
  })

  it('ücretsizler tükendiğinde politika yoksa ücretliye geçmez', async () => {
    const free = provider('groq', async () => {
      throw new ProviderError('server', '500', { status: 500 })
    })
    const paid = provider('openai', async () => 'paid')
    const llm = createTaskLlm(deps({ groq: free, openai: paid }, [entry('f', 'groq'), entry('p', 'openai', 'paid')]), {
      maxCalls: 10,
      budgetUsd: 1,
      allowPaid: false,
      retriesPerModel: 0,
    })
    await expect(llm.call('plan', msgs)).rejects.toBeInstanceOf(NoModelAvailableError)
    expect(paid.count).toBe(0)
  })

  it('izin + bütçe varsa ücretliye geçer ve maliyeti biriktirir', async () => {
    const free = provider('groq', async () => {
      throw new ProviderError('server', '500', { status: 500 })
    })
    const paid = provider('openai', async () => 'paid')
    const llm = createTaskLlm(deps({ groq: free, openai: paid }, [entry('f', 'groq'), entry('p', 'openai', 'paid')]), {
      maxCalls: 10,
      budgetUsd: 1,
      allowPaid: true,
      retriesPerModel: 0,
    })
    const res = await llm.call('plan', msgs)
    expect(res.content).toBe('paid')
    expect(llm.spentUsd).toBeGreaterThan(0)
  })

  it('çağrı sınırını aşmaz', async () => {
    const a = provider('groq', async () => 'ok')
    const llm = createTaskLlm(deps({ groq: a }, [entry('a', 'groq')]), { maxCalls: 1, budgetUsd: 0.05, allowPaid: false })
    await llm.call('plan', msgs)
    await expect(llm.call('plan', msgs)).rejects.toMatchObject({ reason: 'call_limit' })
  })
})

describe('openai-compatible adaptör', () => {
  const originalFetch = global.fetch
  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.TEST_PROVIDER_KEY
  })

  it('doğru isteği gönderir, sırrı hata mesajına sızdırmaz', async () => {
    process.env.TEST_PROVIDER_KEY = 'sk-test-SECRET-123456789'
    const calls: Array<{ url: string; init: RequestInit }> = []
    global.fetch = jest.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init })
      return new Response(JSON.stringify({ choices: [{ message: { content: 'hi' } }], usage: { prompt_tokens: 3, completion_tokens: 1 } }), {
        status: 200,
      })
    }) as unknown as typeof fetch

    const p = createOpenAiCompatibleProvider({ id: 'groq', baseUrl: () => 'https://api.example.com/v1/', apiKeyEnv: ['TEST_PROVIDER_KEY'], supportsJsonMode: true })
    const res = await p.chat('m1', { ...msgs, json: true, maxTokens: 50 })

    expect(res).toMatchObject({ content: 'hi', usage: { inputTokens: 3, outputTokens: 1 } })
    expect(calls[0].url).toBe('https://api.example.com/v1/chat/completions')
    const body = JSON.parse(String(calls[0].init.body))
    expect(body).toMatchObject({ model: 'm1', max_tokens: 50, response_format: { type: 'json_object' } })
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBe('Bearer sk-test-SECRET-123456789')

    global.fetch = jest.fn(async () => new Response('nope', { status: 401 })) as unknown as typeof fetch
    const err = await p.chat('m1', msgs).catch((e) => e)
    expect(err).toBeInstanceOf(ProviderError)
    expect(err.kind).toBe('auth')
    expect(String(err.message)).not.toContain('SECRET')
  })

  it('429 → rate_limited ve retry-after', async () => {
    process.env.TEST_PROVIDER_KEY = 'k'
    global.fetch = jest.fn(async () => new Response('', { status: 429, headers: { 'retry-after': '2' } })) as unknown as typeof fetch
    const p = createOpenAiCompatibleProvider({ id: 'groq', baseUrl: () => 'https://x/v1', apiKeyEnv: ['TEST_PROVIDER_KEY'] })
    const err = await p.chat('m', msgs).catch((e) => e)
    expect(err).toMatchObject({ kind: 'rate_limited', retryAfterMs: 2000 })
  })
})
