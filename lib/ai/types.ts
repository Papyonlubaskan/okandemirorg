/** AI gateway ortak türleri (yalnızca metin modaliteleri) */

export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = { role: ChatRole; content: string }

export type ProviderId = 'mock' | 'groq' | 'gemini' | 'openai' | 'openrouter' | 'nvidia' | 'huggingface'

/** Model çağrısının amacı; router bu alana göre aday seçer */
export type ModelPurpose = 'classify' | 'plan' | 'generate' | 'quality'

export type ModelRequest = {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  /** JSON nesnesi çıktısı iste (sağlayıcı destekliyorsa) */
  json?: boolean
  timeoutMs?: number
  signal?: AbortSignal
}

export type ModelUsage = { inputTokens?: number; outputTokens?: number }

export type ModelResponse = {
  content: string
  usage: ModelUsage
  provider: ProviderId
  model: string
  latencyMs: number
}

export type ProviderErrorKind =
  | 'rate_limited'
  | 'timeout'
  | 'auth'
  | 'bad_request'
  | 'server'
  | 'network'
  | 'not_configured'
  | 'empty'

export class ProviderError extends Error {
  readonly kind: ProviderErrorKind
  readonly status?: number
  readonly retryAfterMs?: number

  constructor(kind: ProviderErrorKind, message: string, opts: { status?: number; retryAfterMs?: number } = {}) {
    super(message)
    this.name = 'ProviderError'
    this.kind = kind
    this.status = opts.status
    this.retryAfterMs = opts.retryAfterMs
  }

  get retryable(): boolean {
    return this.kind === 'rate_limited' || this.kind === 'timeout' || this.kind === 'server' || this.kind === 'network'
  }
}

/** Hiçbir aday kalmadığında; görev beklemeye alınır veya anlaşılır hata verir */
export class NoModelAvailableError extends Error {
  readonly reason: 'no_provider' | 'budget_exhausted' | 'quota_exhausted' | 'call_limit' | 'all_failed'

  constructor(reason: NoModelAvailableError['reason'], message: string) {
    super(message)
    this.name = 'NoModelAvailableError'
    this.reason = reason
  }
}
