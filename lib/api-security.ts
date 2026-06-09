import { NextRequest, NextResponse } from 'next/server'

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Production'da dev-only route'ları kapatır */
export function blockDevRouteInProduction(): NextResponse | null {
  if (isProduction()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return null
}

/**
 * INTERNAL_API_KEY tanımlıysa zorunlu kılar.
 * Tanımlı değilse mevcut entegrasyonlar (n8n vb.) çalışmaya devam eder.
 */
export function requireInternalApiKey(request: NextRequest): NextResponse | null {
  const expected = process.env.INTERNAL_API_KEY
  if (!expected) return null

  const provided =
    request.headers.get('x-api-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' },
    { status: 429 }
  )
}

export function escapeHtml(value: unknown): string {
  if (value == null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
