import { ProviderError, type ModelRequest, type ModelResponse } from '@/lib/ai/types'
import { DEFAULT_TIMEOUT_MS, errorFromStatus, fetchWithTimeout, type ModelProvider } from './provider'

function key(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
}

export const geminiProvider: ModelProvider = {
  id: 'gemini',
  isConfigured: () => Boolean(key()),
  async chat(model: string, req: ModelRequest): Promise<ModelResponse> {
    const apiKey = key()
    if (!apiKey) throw new ProviderError('not_configured', 'gemini anahtarı tanımlı değil')

    const system = req.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n')
    const contents = req.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))

    const started = Date.now()
    // Anahtar URL yerine header'da: log/proxy kayıtlarına sızmaz
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: {
            temperature: req.temperature ?? 0.3,
            maxOutputTokens: req.maxTokens ?? 1024,
            ...(req.json ? { responseMimeType: 'application/json' } : {}),
          },
        }),
      },
      req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      req.signal
    )
    if (!res.ok) throw errorFromStatus(res.status, res.headers.get('retry-after'))

    const data = await res.json().catch(() => null)
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('')
    if (typeof text !== 'string' || !text.trim()) throw new ProviderError('empty', 'Boş yanıt')

    return {
      content: text.trim(),
      usage: {
        inputTokens: data?.usageMetadata?.promptTokenCount,
        outputTokens: data?.usageMetadata?.candidatesTokenCount,
      },
      provider: 'gemini',
      model,
      latencyMs: Date.now() - started,
    }
  },
}
