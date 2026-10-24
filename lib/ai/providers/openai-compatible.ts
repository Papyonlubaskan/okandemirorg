import { ProviderError, type ModelRequest, type ModelResponse, type ProviderId } from '@/lib/ai/types'
import { DEFAULT_TIMEOUT_MS, errorFromStatus, fetchWithTimeout, type ModelProvider } from './provider'

export type OpenAiCompatibleConfig = {
  id: ProviderId
  /** Örn. https://api.groq.com/openai/v1 */
  baseUrl: () => string
  /** Sırayla denenen env değişkeni adları */
  apiKeyEnv: string[]
  supportsJsonMode?: boolean
  extraHeaders?: () => Record<string, string>
}

function readKey(names: string[]): string | undefined {
  for (const n of names) {
    const v = process.env[n]
    if (v) return v
  }
  return undefined
}

/** Yalnızca gerçekten OpenAI Chat Completions uyumlu sağlayıcılar için */
export function createOpenAiCompatibleProvider(config: OpenAiCompatibleConfig): ModelProvider {
  return {
    id: config.id,
    isConfigured: () => Boolean(readKey(config.apiKeyEnv)),
    async chat(model: string, req: ModelRequest): Promise<ModelResponse> {
      const key = readKey(config.apiKeyEnv)
      if (!key) throw new ProviderError('not_configured', `${config.id} anahtarı tanımlı değil`)

      const body: Record<string, unknown> = {
        model,
        messages: req.messages,
        temperature: req.temperature ?? 0.3,
        max_tokens: req.maxTokens ?? 1024,
      }
      if (req.json && config.supportsJsonMode) body.response_format = { type: 'json_object' }

      const started = Date.now()
      const res = await fetchWithTimeout(
        `${config.baseUrl().replace(/\/$/, '')}/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            ...(config.extraHeaders?.() ?? {}),
          },
          body: JSON.stringify(body),
        },
        req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        req.signal
      )
      if (!res.ok) throw errorFromStatus(res.status, res.headers.get('retry-after'))

      const data = await res.json().catch(() => null)
      const content = data?.choices?.[0]?.message?.content
      if (typeof content !== 'string' || !content.trim()) throw new ProviderError('empty', 'Boş yanıt')

      return {
        content: content.trim(),
        usage: {
          inputTokens: data?.usage?.prompt_tokens,
          outputTokens: data?.usage?.completion_tokens,
        },
        provider: config.id,
        model,
        latencyMs: Date.now() - started,
      }
    },
  }
}

export const groqProvider = createOpenAiCompatibleProvider({
  id: 'groq',
  baseUrl: () => 'https://api.groq.com/openai/v1',
  apiKeyEnv: ['GROQ_API_KEY'],
  supportsJsonMode: true,
})

export const openaiProvider = createOpenAiCompatibleProvider({
  id: 'openai',
  baseUrl: () => process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  apiKeyEnv: ['OPENAI_API_KEY'],
  supportsJsonMode: true,
})

export const openrouterProvider = createOpenAiCompatibleProvider({
  id: 'openrouter',
  baseUrl: () => 'https://openrouter.ai/api/v1',
  apiKeyEnv: ['OPENROUTER_API_KEY'],
  supportsJsonMode: true,
  extraHeaders: () => ({
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org',
    'X-Title': 'okandemir.org',
  }),
})

/** NVIDIA API Catalog (OpenAI uyumlu). Şartlar: lib/ai/catalog.ts notlarına bakın */
export const nvidiaProvider = createOpenAiCompatibleProvider({
  id: 'nvidia',
  baseUrl: () => 'https://integrate.api.nvidia.com/v1',
  apiKeyEnv: ['NVIDIA_API_KEY'],
  supportsJsonMode: false,
})

/** Hugging Face Inference Providers router (OpenAI uyumlu) */
export const huggingfaceProvider = createOpenAiCompatibleProvider({
  id: 'huggingface',
  baseUrl: () => 'https://router.huggingface.co/v1',
  apiKeyEnv: ['HF_TOKEN', 'HUGGINGFACE_API_KEY'],
  supportsJsonMode: false,
})
