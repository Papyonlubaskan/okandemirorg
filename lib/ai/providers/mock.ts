import type { ModelRequest, ModelResponse } from '@/lib/ai/types'
import type { ModelProvider } from './provider'

export type MockHandler = (model: string, req: ModelRequest) => string | Promise<string>

/** Varsayılan: son kullanıcı mesajını yansıtır; JSON istenirse geçerli bir nesne döner */
const defaultHandler: MockHandler = (_model, req) => {
  const last = [...req.messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  if (req.json) return JSON.stringify({ echo: last.slice(0, 200) })
  return `mock: ${last.slice(0, 200)}`
}

/** Ağ çağrısı yapmayan, deterministik sağlayıcı (test ve AI_PROVIDER_MODE=mock) */
export function createMockProvider(handler: MockHandler = defaultHandler): ModelProvider {
  return {
    id: 'mock',
    isConfigured: () => true,
    async chat(model: string, req: ModelRequest): Promise<ModelResponse> {
      const started = Date.now()
      const content = await handler(model, req)
      const inputChars = req.messages.reduce((n, m) => n + m.content.length, 0)
      return {
        content,
        usage: { inputTokens: Math.ceil(inputChars / 4), outputTokens: Math.ceil(content.length / 4) },
        provider: 'mock',
        model,
        latencyMs: Date.now() - started,
      }
    },
  }
}

export const mockProvider = createMockProvider()
