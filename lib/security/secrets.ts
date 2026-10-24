import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const SECRET_KEY_PATTERN = /(key|token|secret|password|passwd|authorization|cookie|api[-_]?key)/i

/** Log / audit için: sır olabilecek alanları maskeler, derinliği sınırlar */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return '[depth]'
  if (value == null || typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'string') return redactString(value)
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1))
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEY_PATTERN.test(k) ? '[redacted]' : redact(v, depth + 1)
    }
    return out
  }
  return String(value)
}

export function redactString(s: string): string {
  return s
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [redacted]')
    .replace(/\b(sk|gsk|hf|nvapi|AIza)[A-Za-z0-9_\-]{10,}/g, '[redacted]')
    .replace(/([?&](key|token|access_token|client_secret)=)[^&\s]+/gi, '$1[redacted]')
}

export function maskSecret(s: string | null | undefined): string {
  if (!s) return ''
  if (s.length <= 8) return '****'
  return `${s.slice(0, 4)}…${s.slice(-4)}`
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex')
}

function encryptionKey(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY
  if (!raw) throw new Error('APP_ENCRYPTION_KEY tanımlı değil')
  return createHash('sha256').update(raw, 'utf8').digest()
}

/** OAuth token vb. için AES-256-GCM. Çıktı: v1.<iv>.<tag>.<data> (base64url) */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return ['v1', iv.toString('base64url'), tag.toString('base64url'), data.toString('base64url')].join('.')
}

export function decryptSecret(payload: string): string {
  const [v, iv, tag, data] = payload.split('.')
  if (v !== 'v1' || !iv || !tag || !data) throw new Error('Geçersiz şifreli veri')
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8')
}
