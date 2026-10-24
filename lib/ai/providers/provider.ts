import { ProviderError, type ModelRequest, type ModelResponse, type ProviderId } from '@/lib/ai/types'

export interface ModelProvider {
  readonly id: ProviderId
  /** Anahtar vb. sunucu ortamında tanımlı mı (değeri asla dışarı vermez) */
  isConfigured(): boolean
  chat(model: string, request: ModelRequest): Promise<ModelResponse>
}

export const DEFAULT_TIMEOUT_MS = 30_000

export function errorFromStatus(status: number, retryAfterHeader?: string | null): ProviderError {
  const retryAfterSec = Number(retryAfterHeader)
  const retryAfterMs = Number.isFinite(retryAfterSec) && retryAfterSec > 0 ? retryAfterSec * 1000 : undefined
  if (status === 429) return new ProviderError('rate_limited', 'Sağlayıcı hız sınırı', { status, retryAfterMs })
  if (status === 401 || status === 403) return new ProviderError('auth', 'Sağlayıcı yetki hatası', { status })
  if (status === 408) return new ProviderError('timeout', 'Sağlayıcı zaman aşımı', { status })
  if (status >= 500) return new ProviderError('server', 'Sağlayıcı sunucu hatası', { status })
  return new ProviderError('bad_request', 'Sağlayıcı isteği reddetti', { status })
}

/** Zaman aşımı + dış AbortSignal ile fetch; ağ hatalarını ProviderError'a çevirir */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  outerSignal?: AbortSignal
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onAbort = () => controller.abort()
  outerSignal?.addEventListener('abort', onAbort, { once: true })
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (e) {
    if (controller.signal.aborted) throw new ProviderError('timeout', 'İstek zaman aşımına uğradı')
    throw new ProviderError('network', e instanceof Error ? e.name : 'Ağ hatası')
  } finally {
    clearTimeout(timer)
    outerSignal?.removeEventListener('abort', onAbort)
  }
}
