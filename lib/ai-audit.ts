/** Basit HTML crawl sinyalleri + AI rapor */

import { chatWithFailover } from '@/lib/ai-chat'

export type CrawlSignals = {
  url: string
  finalUrl: string
  status: number
  title: string
  metaDescription: string
  h1: string[]
  h2Count: number
  canonical: string
  hasViewport: boolean
  hasOgTitle: boolean
  linkCount: number
  imageCount: number
  imagesMissingAlt: number
  wordEstimate: number
  hasTelLink: boolean
  hasWhatsAppHint: boolean
  hasForm: boolean
  loadMs: number
  htmlBytes: number
  errors: string[]
}

function stripTags(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
}

function attr(html: string, re: RegExp): string {
  const m = html.match(re)
  return m?.[1]?.trim() || ''
}

function allMatches(html: string, re: RegExp): string[] {
  const out: string[] = []
  let m: RegExpExecArray | null
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  while ((m = r.exec(html)) !== null) {
    out.push(m[1].replace(/<[^>]+>/g, '').trim())
  }
  return out.filter(Boolean)
}

export async function crawlUrl(inputUrl: string): Promise<CrawlSignals> {
  const errors: string[] = []
  let url = inputUrl.trim()
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`

  const start = Date.now()
  let status = 0
  let finalUrl = url
  let html = ''

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'OkanDemirAIAuditBot/1.0 (+https://okandemir.org)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })
    clearTimeout(timer)
    status = res.status
    finalUrl = res.url
    const buf = await res.arrayBuffer()
    html = new TextDecoder('utf-8', { fatal: false }).decode(buf.slice(0, 500_000))
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'Fetch failed')
  }

  const loadMs = Date.now() - start
  const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
  const metaDescription = attr(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
  ) || attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
  const h1 = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const h2Count = (html.match(/<h2\b/gi) || []).length
  const canonical = attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  const hasOgTitle = /property=["']og:title["']/i.test(html)
  const linkCount = (html.match(/<a\b/gi) || []).length
  const imgTags = html.match(/<img\b[^>]*>/gi) || []
  const imageCount = imgTags.length
  const imagesMissingAlt = imgTags.filter((t) => !/\balt\s*=/i.test(t) || /\balt=["']\s*["']/i.test(t)).length
  const text = stripTags(html)
  const wordEstimate = text.split(/\s+/).filter(Boolean).length
  const hasTelLink = /href=["']tel:/i.test(html)
  const hasWhatsAppHint = /wa\.me|whatsapp|api\.whatsapp/i.test(html)
  const hasForm = /<form\b/i.test(html)

  return {
    url,
    finalUrl,
    status,
    title,
    metaDescription,
    h1,
    h2Count,
    canonical,
    hasViewport,
    hasOgTitle,
    linkCount,
    imageCount,
    imagesMissingAlt,
    wordEstimate,
    hasTelLink,
    hasWhatsAppHint,
    hasForm,
    loadMs,
    htmlBytes: html.length,
    errors,
  }
}

export async function generateAuditReport(signals: CrawlSignals): Promise<string> {
  const fallback = buildFallbackReport(signals)
  // Varsayılan KAPALI — kota yakmaz. Railway: USE_LLM=1
  if (process.env.USE_LLM !== '1' && process.env.USE_LLM !== 'true') {
    return fallback
  }

  const prompt = `Sen Türkçe yazan bir SEO/dijital denetim uzmanısın. Aşağıdaki crawl sinyallerine göre kısa, aksiyon odaklı bir Markdown rapor yaz.
Başlıklar: Özet, Güçlü yönler, Kritik sorunlar, Öncelikli aksiyonlar (max 7), Skor tahmini (/100).
Şifre/hesap erişimi önerme. Sadece URL üzerinden görünenler.

Sinyaller (JSON):
${JSON.stringify(signals, null, 2)}`

  const ai = await chatWithFailover(
    [
      { role: 'system', content: 'Kısa, net, Türkçe Markdown rapor üret. Abartma.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.3, maxTokens: 2200 }
  )

  return ai?.content || fallback
}

function buildFallbackReport(s: CrawlSignals): string {
  const issues: string[] = []
  if (s.status >= 400 || s.status === 0) issues.push('Sayfa açılamadı veya hata kodu döndü')
  if (!s.title) issues.push('Title eksik')
  if (s.title.length > 60) issues.push('Title uzun olabilir')
  if (!s.metaDescription) issues.push('Meta description eksik')
  if (s.h1.length === 0) issues.push('H1 yok')
  if (s.h1.length > 1) issues.push('Birden fazla H1')
  if (!s.hasViewport) issues.push('Viewport meta yok (mobil risk)')
  if (!s.hasWhatsAppHint && !s.hasTelLink && !s.hasForm) issues.push('Net CTA (WA/tel/form) zayıf')
  if (s.imagesMissingAlt > 0) issues.push(`${s.imagesMissingAlt} görselde alt eksik`)
  if (s.loadMs > 4000) issues.push(`Yavaş yanıt (~${s.loadMs}ms)`)

  return [
    `# AI SEO Denetim Raporu`,
    ``,
    `**URL:** ${s.finalUrl || s.url}`,
    `**HTTP:** ${s.status} · **Süre:** ${s.loadMs}ms`,
    ``,
    `## Özet`,
    `Otomatik crawl ile üretildi. ${issues.length} kritik/önemli sinyal bulundu.`,
    ``,
    `## Sinyaller`,
    `- Title: ${s.title || '—'}`,
    `- Meta: ${s.metaDescription || '—'}`,
    `- H1: ${s.h1.join(' | ') || '—'}`,
    `- H2 sayısı: ${s.h2Count}`,
    `- Viewport: ${s.hasViewport ? 'var' : 'yok'}`,
    `- OG title: ${s.hasOgTitle ? 'var' : 'yok'}`,
    `- Link / görsel: ${s.linkCount} / ${s.imageCount}`,
    `- Kelime tahmini: ${s.wordEstimate}`,
    ``,
    `## Kritik sorunlar`,
    ...(issues.length ? issues.map((i) => `- ${i}`) : ['- Belirgin kritik sorun yok']),
    ``,
    `## Öncelikli aksiyonlar`,
    `1. Title ve meta description’ı net teklifle yazın`,
    `2. Tek H1 + net WhatsApp/telefon CTA`,
    `3. Mobil viewport ve hız (görsel sıkıştırma)`,
    `4. Alt metinleri tamamlayın`,
    `5. Canonical ve OG etiketlerini kontrol edin`,
    ``,
    `*Bu rapor canlı crawl sinyallerinden üretilir. Harici AI kotası gerekmez.*`,
  ].join('\n')
}
