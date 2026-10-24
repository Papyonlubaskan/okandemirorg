/**
 * @jest-environment node
 */
const executeMock = jest.fn()
jest.mock('@/lib/mysql', () => ({ __esModule: true, default: {}, execute: (...a: unknown[]) => executeMock(...a) }))

import { checkDbRateLimit, checkRateLimits } from '@/lib/security/rate-limit'
import { decryptSecret, encryptSecret, maskSecret, redact, redactString } from '@/lib/security/secrets'

describe('checkDbRateLimit', () => {
  beforeEach(() => {
    executeMock.mockReset()
    delete process.env.AI_STORE
  })

  it('DB sayacına göre sınırı uygular', async () => {
    executeMock.mockResolvedValueOnce({ insertId: 0 }).mockResolvedValueOnce({ insertId: 3 }).mockResolvedValueOnce({ insertId: 4 })
    expect(await checkDbRateLimit('k', 3, 60_000)).toBe(true)
    expect(await checkDbRateLimit('k', 3, 60_000)).toBe(true)
    expect(await checkDbRateLimit('k', 3, 60_000)).toBe(false)
  })

  it('DB hatasında sınırsız değil, süreç içi sınırlayıcıya düşer', async () => {
    executeMock.mockRejectedValue(new Error('ER_NO_SUCH_TABLE'))
    const results = []
    for (let i = 0; i < 4; i++) results.push(await checkDbRateLimit('fallback-key', 2, 60_000))
    expect(results).toEqual([true, true, false, false])
  })

  it('kapsamlardan biri doluysa reddeder', async () => {
    executeMock.mockResolvedValueOnce({ insertId: 0 }).mockResolvedValueOnce({ insertId: 99 })
    expect(
      await checkRateLimits([
        { key: 'user:1', limit: 10, windowMs: 1000 },
        { key: 'ws:1', limit: 10, windowMs: 1000 },
      ])
    ).toBe(false)
  })
})

describe('secrets', () => {
  it('audit metadata içindeki sırları maskeler', () => {
    const out = redact({ taskId: 't1', apiKey: 'abc', nested: { access_token: 'x', note: 'Bearer sk-1234567890abcdef' } }) as Record<string, unknown>
    expect(out.taskId).toBe('t1')
    expect(out.apiKey).toBe('[redacted]')
    expect((out.nested as Record<string, unknown>).access_token).toBe('[redacted]')
    expect(String((out.nested as Record<string, unknown>).note)).not.toContain('sk-1234567890')
  })

  it('URL’deki anahtarları maskeler', () => {
    expect(redactString('https://x.com/a?key=SECRET&b=1')).toBe('https://x.com/a?key=[redacted]&b=1')
    expect(maskSecret('abcdefghijkl')).toBe('abcd…ijkl')
  })

  it('AES-GCM şifreleme geri çözülür, değiştirilmiş veri reddedilir', () => {
    process.env.APP_ENCRYPTION_KEY = 'test-key'
    const enc = encryptSecret('oauth-refresh-token')
    expect(enc).not.toContain('oauth-refresh-token')
    expect(decryptSecret(enc)).toBe('oauth-refresh-token')
    const parts = enc.split('.')
    parts[3] = Buffer.from('tampered').toString('base64url')
    expect(() => decryptSecret(parts.join('.'))).toThrow()
    delete process.env.APP_ENCRYPTION_KEY
  })
})
