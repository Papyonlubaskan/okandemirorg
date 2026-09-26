/**
 * AI sohbet zinciri: Groq → Gemini → OpenAI/OpenRouter → null
 * Kota bitince müşteri askıda kalmaz; çağıran taraf şablon fallback kullanır.
 */

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type AiChatResult = {
  content: string
  provider: 'groq' | 'gemini' | 'openai'
}

async function chatGroq(
  messages: ChatMessage[],
  opts: { temperature: number; maxTokens: number }
): Promise<string | null> {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    return typeof content === 'string' && content.trim() ? content.trim() : null
  } catch {
    return null
  }
}

async function chatGemini(
  messages: ChatMessage[],
  opts: { temperature: number; maxTokens: number }
): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!key) return null
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n')
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: {
            temperature: opts.temperature,
            maxOutputTokens: opts.maxTokens,
          },
        }),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('')
    return typeof text === 'string' && text.trim() ? text.trim() : null
  } catch {
    return null
  }
}

/** OpenAI veya OpenRouter (OPENAI_BASE_URL ile) */
async function chatOpenAiCompatible(
  messages: ChatMessage[],
  opts: { temperature: number; maxTokens: number }
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
  if (!key) return null
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
  const model =
    process.env.OPENAI_MODEL ||
    (process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini')

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    }
    if (process.env.OPENROUTER_API_KEY) {
      headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
      headers['X-Title'] = 'okandemir.org'
    }
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    return typeof content === 'string' && content.trim() ? content.trim() : null
  } catch {
    return null
  }
}

/** Sırayla dene; hepsi fail → null (çağıran şablon kullanır) */
export async function chatWithFailover(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<AiChatResult | null> {
  const temperature = opts.temperature ?? 0.4
  const maxTokens = opts.maxTokens ?? 2500

  const groq = await chatGroq(messages, { temperature, maxTokens })
  if (groq) return { content: groq, provider: 'groq' }

  const gemini = await chatGemini(messages, { temperature, maxTokens })
  if (gemini) return { content: gemini, provider: 'gemini' }

  const openai = await chatOpenAiCompatible(messages, { temperature, maxTokens })
  if (openai) return { content: openai, provider: 'openai' }

  return null
}
