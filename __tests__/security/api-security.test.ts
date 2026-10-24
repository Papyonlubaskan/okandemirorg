/**
 * @jest-environment node
 */
import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'
import { requireInternalApiKey, verifyMetaSignature } from '@/lib/api-security'

const env = new Proxy({} as Record<string, string | undefined>, {
  get: (_t, k: string) => process.env[k],
  set: (_t, k: string, v) => {
    ;(process.env as Record<string, string>)[k] = v
    return true
  },
  deleteProperty: (_t, k: string) => {
    delete process.env[k]
    return true
  },
})

function req(headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/x', { headers })
}

describe('requireInternalApiKey', () => {
  const original = { ...process.env }
  afterEach(() => {
    process.env = { ...original }
  })

  it('production’da anahtar tanımsızsa reddeder', () => {
    env.NODE_ENV = 'production'
    delete env.INTERNAL_API_KEY
    expect(requireInternalApiKey(req())?.status).toBe(401)
  })

  it('doğru anahtarı kabul eder, yanlışı reddeder', () => {
    env.INTERNAL_API_KEY = 'secret-123'
    expect(requireInternalApiKey(req({ 'x-api-key': 'secret-123' }))).toBeNull()
    expect(requireInternalApiKey(req({ authorization: 'Bearer secret-123' }))).toBeNull()
    expect(requireInternalApiKey(req({ 'x-api-key': 'wrong' }))?.status).toBe(401)
  })
})

describe('verifyMetaSignature', () => {
  it('geçerli imzayı doğrular, değiştirilmiş gövdeyi reddeder', () => {
    const body = '{"a":1}'
    const sig = 'sha256=' + createHmac('sha256', 's3').update(body).digest('hex')
    expect(verifyMetaSignature(body, sig, 's3')).toBe(true)
    expect(verifyMetaSignature('{"a":2}', sig, 's3')).toBe(false)
    expect(verifyMetaSignature(body, null, 's3')).toBe(false)
  })
})
