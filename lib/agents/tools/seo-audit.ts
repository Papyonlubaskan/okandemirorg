import { z } from 'zod'
import { AUDIT_SYSTEM_PROMPT, buildAuditPrompt, buildFallbackReport, crawlUrl, scoreSignals } from '@/lib/ai-audit'
import { NoModelAvailableError } from '@/lib/ai/types'
import type { ToolDef } from '../types'

const input = z
  .object({
    url: z
      .string()
      .trim()
      .min(4)
      .max(2048)
      .refine((u) => !/\s/.test(u), 'URL boşluk içeremez'),
  })
  .strict()

export type SeoAuditOutput = {
  url: string
  finalUrl: string
  status: number
  title: string
  loadMs: number
  score: number
  issues: string[]
  report: string
  reportSource: 'ai' | 'template'
}

/** Salt okunur: herkese açık sayfayı crawl eder, rapor üretir. Hesap/şifre gerektirmez. */
export const seoAuditTool: ToolDef<z.infer<typeof input>, SeoAuditOutput> = {
  name: 'seo.audit',
  description: 'Herkese açık bir URL için SEO/dönüşüm denetimi (title, meta, H1, mobil, CTA, hız) ve Markdown rapor.',
  risk: 'safe',
  inputSchema: input,
  timeoutMs: 45_000,
  async run(i, ctx) {
    const signals = await crawlUrl(i.url)
    const { score, issues } = scoreSignals(signals)
    let report = buildFallbackReport(signals)
    let reportSource: SeoAuditOutput['reportSource'] = 'template'

    if (ctx.llm && signals.status > 0) {
      try {
        const res = await ctx.llm.call('generate', {
          messages: [
            { role: 'system', content: AUDIT_SYSTEM_PROMPT },
            { role: 'user', content: buildAuditPrompt(signals) },
          ],
          temperature: 0.3,
          maxTokens: 1800,
          signal: ctx.signal,
        })
        report = res.content
        reportSource = 'ai'
      } catch (e) {
        // Kota/bütçe yoksa şablon rapor yeterli; diğer hatalar da şablona düşer
        if (!(e instanceof NoModelAvailableError)) report = buildFallbackReport(signals)
      }
    }

    return {
      url: signals.url,
      finalUrl: signals.finalUrl,
      status: signals.status,
      title: signals.title,
      loadMs: signals.loadMs,
      score,
      issues,
      report,
      reportSource,
    }
  },
}
