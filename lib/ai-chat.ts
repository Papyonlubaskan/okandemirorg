/**
 * AI sohbet zinciri: Groq → Gemini → OpenAI/OpenRouter → null
 * Kota bitince müşteri askıda kalmaz; çağıran taraf şablon fallback kullanır.
 * Geriye uyumlu sarmalayıcı — adaptörler lib/ai/providers altında.
 */

import { geminiProvider } from '@/lib/ai/providers/gemini'
import { groqProvider, openaiProvider, openrouterProvider } from '@/lib/ai/providers/openai-compatible'
import type { ModelProvider } from '@/lib/ai/providers/provider'
import type { ChatMessage } from '@/lib/ai/types'

export type AiChatResult = {
  content: string
  provider: 'groq' | 'gemini' | 'openai'
}

const CHAIN: Array<{ provider: ModelProvider; model: () => string; label: AiChatResult['provider'] }> = [
  { provider: groqProvider, model: () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', label: 'groq' },
  { provider: geminiProvider, model: () => process.env.GEMINI_MODEL || 'gemini-2.0-flash', label: 'gemini' },
  { provider: openaiProvider, model: () => process.env.OPENAI_MODEL || 'gpt-4o-mini', label: 'openai' },
  {
    provider: openrouterProvider,
    model: () => process.env.OPENAI_MODEL || 'openai/gpt-4o-mini',
    label: 'openai',
  },
]

/** Sırayla dene; hepsi fail → null (çağıran şablon kullanır) */
export async function chatWithFailover(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<AiChatResult | null> {
  const temperature = opts.temperature ?? 0.4
  const maxTokens = opts.maxTokens ?? 2500

  for (const step of CHAIN) {
    if (!step.provider.isConfigured()) continue
    try {
      const res = await step.provider.chat(step.model(), { messages, temperature, maxTokens })
      return { content: res.content, provider: step.label }
    } catch {
      // sıradaki sağlayıcı
    }
  }
  return null
}
