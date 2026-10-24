import { randomBytes, randomUUID } from 'crypto'
import { z } from 'zod'
import { buildFallbackHtml, buildLandingPrompt, extractHtml, LANDING_SYSTEM_PROMPT } from '@/lib/ai-landing'
import { NoModelAvailableError } from '@/lib/ai/types'
import { sanitizeLandingHtml } from '@/lib/security/sanitize-html'
import { sha256Hex } from '@/lib/security/secrets'
import { PermanentToolError } from '../errors'
import type { ToolDef } from '../types'

const text = (max: number) => z.string().trim().min(1).max(max)

export const landingBriefSchema = z
  .object({
    businessName: text(80),
    city: text(60),
    service: text(80),
    phone: z.string().trim().max(30).optional(),
    whatsapp: z.string().trim().max(30).optional(),
    highlights: z.string().trim().max(300).optional(),
  })
  .strict()

export type LandingDraftOutput = {
  draftId: string
  slug: string
  title: string
  contentHash: string
  previewPath: string
  source: 'ai' | 'template'
}

function slugify(s: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }
  return s
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => map[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

/** Taslak üretir ve kaydeder. Herkese açık DEĞİLDİR; önizleme yalnızca workspace üyelerine. */
export const landingDraftTool: ToolDef<z.infer<typeof landingBriefSchema>, LandingDraftOutput> = {
  name: 'landing.draft',
  description: 'İşletme bilgisinden tek sayfalık landing HTML taslağı üretir (yayınlamaz).',
  risk: 'safe',
  inputSchema: landingBriefSchema,
  timeoutMs: 50_000,
  async run(brief, ctx) {
    let html = buildFallbackHtml(brief)
    let source: LandingDraftOutput['source'] = 'template'

    if (ctx.llm) {
      try {
        const res = await ctx.llm.call('generate', {
          messages: [
            { role: 'system', content: LANDING_SYSTEM_PROMPT },
            { role: 'user', content: buildLandingPrompt(brief) },
          ],
          temperature: 0.5,
          maxTokens: 3500,
          signal: ctx.signal,
        })
        const extracted = extractHtml(res.content)
        if (extracted) {
          html = extracted
          source = 'ai'
        }
      } catch (e) {
        if (!(e instanceof NoModelAvailableError)) html = buildFallbackHtml(brief)
      }
    }

    html = sanitizeLandingHtml(html)
    const draft = await ctx.store.createDraft({
      id: randomUUID(),
      workspaceId: ctx.workspaceId,
      taskId: ctx.taskId,
      slug: `${slugify(brief.businessName) || 'site'}-${randomBytes(3).toString('hex')}`,
      title: `${brief.businessName} | ${brief.service} — ${brief.city}`,
      html,
      contentHash: sha256Hex(html),
    })

    return {
      draftId: draft.id,
      slug: draft.slug,
      title: draft.title,
      contentHash: draft.contentHash,
      previewPath: `/api/ai/drafts/${draft.id}/preview`,
      source,
    }
  },
}

const publishInput = z
  .object({
    draftId: z.string().uuid(),
    contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict()

/**
 * Taslağı herkese açık yayınlar → ONAY ZORUNLU (risk: publish).
 * Onay draftId + contentHash'e bağlıdır; taslak değişirse hash tutmaz ve yayın reddedilir.
 */
export const landingPublishTool: ToolDef<z.infer<typeof publishInput>, { published: true; slug: string; path: string }> = {
  name: 'landing.publish',
  description: 'Onaylanan landing taslağını herkese açık adreste yayınlar.',
  risk: 'publish',
  inputSchema: publishInput,
  timeoutMs: 10_000,
  describeAction: (i) => ({
    summary: 'Landing sayfası taslağı herkese açık olarak yayınlanacak',
    target: `okandemir.org/s/… (taslak ${i.draftId.slice(0, 8)})`,
    budget: 'Ücret yok',
    effects: [
      'Sayfa linki olan herkes tarafından görüntülenebilir',
      'Arama motorlarına kapalı (noindex) yayınlanır',
      `Yalnızca bu içerik sürümü yayınlanır (${i.contentHash.slice(0, 12)}…)`,
    ],
  }),
  async run(i, ctx) {
    const draft = await ctx.store.getDraft(i.draftId, ctx.workspaceId)
    if (!draft) throw new PermanentToolError('draft_not_found', 'Taslak bulunamadı')
    if (draft.contentHash !== i.contentHash) {
      throw new PermanentToolError('draft_changed', 'Taslak içeriği onaydan sonra değişmiş; yeni yayın isteği oluşturun')
    }
    const ok = await ctx.store.publishDraft(draft.id, ctx.workspaceId, i.contentHash)
    if (!ok) throw new PermanentToolError('publish_failed', 'Yayınlanamadı')
    return { published: true, slug: draft.slug, path: `/s/${draft.slug}` }
  },
}
