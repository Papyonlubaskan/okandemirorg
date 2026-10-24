import type { ModelPurpose, ProviderId } from '@/lib/ai/types'

/**
 * Model kataloğu. Kota / fiyat / ticari kullanım bilgisi doğrulanmadıysa `unknown` / `unverified` kalır.
 * `unknown` kota ASLA sınırsız sayılmaz: router günlük AI_UNKNOWN_QUOTA_DAILY_CAP (varsayılan 50) ile sınırlar.
 * Fiyatlar USD / 1M token tahminidir; sağlayıcı sayfalarından düzenli kontrol edilmelidir.
 */

export type AiMode = 'off' | 'mock' | 'live'

export type QuotaInfo = { status: 'known'; requestsPerDay: number } | { status: 'unknown' }

export type ModelEntry = {
  key: string
  provider: ProviderId
  model: () => string
  tier: 'free' | 'paid'
  purposes: ModelPurpose[]
  jsonMode: boolean
  quota: QuotaInfo
  pricing: { inputPer1M: number; outputPer1M: number }
  commercialUse: 'verified' | 'unverified' | 'restricted'
  enabled: () => boolean
  notes?: string
}

function flag(name: string): boolean {
  const v = process.env[name]
  return v === '1' || v === 'true'
}

/** off: model çağrısı yok (şablon/kural). mock: ağsız sahte model. live: gerçek sağlayıcılar */
export function getAiMode(): AiMode {
  const explicit = process.env.AI_PROVIDER_MODE
  if (explicit === 'mock' || explicit === 'live' || explicit === 'off') return explicit
  return flag('USE_LLM') ? 'live' : 'off'
}

export function unknownQuotaDailyCap(): number {
  const n = parseInt(process.env.AI_UNKNOWN_QUOTA_DAILY_CAP || '50', 10)
  return Number.isFinite(n) && n >= 0 ? n : 50
}

const ALL: ModelPurpose[] = ['classify', 'plan', 'generate', 'quality']
const CHEAP: ModelPurpose[] = ['classify', 'plan', 'generate']

export const MODEL_CATALOG: ModelEntry[] = [
  {
    key: 'mock:default',
    provider: 'mock',
    model: () => 'mock-1',
    tier: 'free',
    purposes: ALL,
    jsonMode: true,
    quota: { status: 'known', requestsPerDay: 1_000_000 },
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    commercialUse: 'verified',
    enabled: () => getAiMode() === 'mock',
  },
  {
    key: 'groq:default',
    provider: 'groq',
    model: () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    tier: 'free',
    purposes: CHEAP,
    jsonMode: true,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    commercialUse: 'unverified',
    enabled: () => getAiMode() === 'live',
    notes: 'Ücretsiz katman limitleri hesap/modele göre değişir; console.groq.com/settings/limits kontrol edin.',
  },
  {
    key: 'gemini:default',
    provider: 'gemini',
    model: () => process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    tier: 'free',
    purposes: CHEAP,
    jsonMode: true,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    commercialUse: 'unverified',
    enabled: () => getAiMode() === 'live',
    notes: 'Ücretsiz katmanda veriler ürün geliştirme için kullanılabilir; müşteri verisi için ücretli katman değerlendirin.',
  },
  {
    key: 'nvidia:default',
    provider: 'nvidia',
    model: () => process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct',
    tier: 'free',
    purposes: CHEAP,
    jsonMode: false,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    commercialUse: 'restricted',
    enabled: () => getAiMode() === 'live' && flag('AI_ENABLE_NVIDIA'),
    notes: 'API Catalog ücretsiz erişimi deneme/geliştirme amaçlıdır; üretim kullanımı için NVIDIA AI Enterprise lisansı gerekir.',
  },
  {
    key: 'huggingface:default',
    provider: 'huggingface',
    model: () => process.env.HF_MODEL || 'meta-llama/Llama-3.3-70B-Instruct',
    tier: 'free',
    purposes: CHEAP,
    jsonMode: false,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0, outputPer1M: 0 },
    commercialUse: 'unverified',
    enabled: () => getAiMode() === 'live' && flag('AI_ENABLE_HF'),
    notes: 'Aylık küçük ücretsiz kredi; sonrası sağlayıcı fiyatıyla faturalanır. Model lisansı ayrıca kontrol edilmeli.',
  },
  {
    key: 'openrouter:mini',
    provider: 'openrouter',
    model: () => process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    tier: 'paid',
    purposes: CHEAP,
    jsonMode: true,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0.15, outputPer1M: 0.6 },
    commercialUse: 'verified',
    enabled: () => getAiMode() === 'live',
  },
  {
    key: 'openai:mini',
    provider: 'openai',
    model: () => process.env.OPENAI_MODEL || 'gpt-4o-mini',
    tier: 'paid',
    purposes: CHEAP,
    jsonMode: true,
    quota: { status: 'unknown' },
    pricing: { inputPer1M: 0.15, outputPer1M: 0.6 },
    commercialUse: 'verified',
    enabled: () => getAiMode() === 'live',
  },
  {
    key: 'openai:quality',
    provider: 'openai',
    model: () => process.env.AI_QUALITY_MODEL || 'gpt-4o',
    tier: 'paid',
    purposes: ['quality'],
    jsonMode: true,
    quota: { status: 'unknown' },
    pricing: {
      inputPer1M: Number(process.env.AI_QUALITY_PRICE_IN || 2.5),
      outputPer1M: Number(process.env.AI_QUALITY_PRICE_OUT || 10),
    },
    commercialUse: 'verified',
    enabled: () => getAiMode() === 'live',
  },
]
