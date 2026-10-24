import { geminiProvider } from '@/lib/ai/providers/gemini'
import { mockProvider } from '@/lib/ai/providers/mock'
import {
  groqProvider,
  huggingfaceProvider,
  nvidiaProvider,
  openaiProvider,
  openrouterProvider,
} from '@/lib/ai/providers/openai-compatible'
import type { ProviderRegistry } from '@/lib/ai/router'

export function getDefaultProviders(): ProviderRegistry {
  return {
    mock: mockProvider,
    groq: groqProvider,
    gemini: geminiProvider,
    nvidia: nvidiaProvider,
    huggingface: huggingfaceProvider,
    openrouter: openrouterProvider,
    openai: openaiProvider,
  }
}

/** Ücretli model izni: global politika (AI_ALLOW_PAID=1) + pozitif bütçe */
export function paidModelsAllowed(remainingBudgetUsd: number): boolean {
  const v = process.env.AI_ALLOW_PAID
  return (v === '1' || v === 'true') && remainingBudgetUsd > 0
}
