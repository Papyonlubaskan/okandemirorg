import { z } from 'zod'

/**
 * Müşteri sitesi şeması. Model ham HTML değil bu yapıyı üretir; renderer kendi bileşenleriyle çizer.
 * Böylece çıktı her zaman doğrulanabilir, mobil uyumlu ve script içermez.
 */

const t = (max: number) => z.string().trim().max(max)
const req = (max: number) => z.string().trim().min(1).max(max)
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/)
const httpsUrl = z.string().trim().max(500).regex(/^https:\/\/[^\s"'<>]+$/)

export const themeSchema = z
  .object({
    primary: hex,
    accent: hex,
    mode: z.enum(['light', 'dark']),
    font: z.enum(['modern', 'classic', 'friendly']),
    radius: z.enum(['none', 'md', 'lg']),
  })
  .strict()

export const businessSchema = z
  .object({
    name: req(80),
    sector: req(60),
    city: t(60),
    phone: t(30).optional(),
    whatsapp: z.string().trim().regex(/^\d{10,15}$/).optional(),
    email: z.string().trim().email().max(120).optional(),
    address: t(200).optional(),
  })
  .strict()

const ctaTarget = z.enum(['whatsapp', 'phone', 'contact', 'url'])

const hero = z
  .object({
    type: z.literal('hero'),
    title: req(120),
    subtitle: t(300),
    ctaText: req(40),
    ctaTarget,
    ctaUrl: httpsUrl.optional(),
    image: httpsUrl.optional(),
  })
  .strict()

const features = z
  .object({
    type: z.literal('features'),
    title: req(100),
    items: z.array(z.object({ title: req(80), text: t(240), icon: t(4).optional() }).strict()).min(1).max(6),
  })
  .strict()

const services = z
  .object({
    type: z.literal('services'),
    title: req(100),
    items: z.array(z.object({ name: req(80), description: t(240), price: t(40).optional() }).strict()).min(1).max(12),
  })
  .strict()

const about = z.object({ type: z.literal('about'), title: req(100), text: req(1200), image: httpsUrl.optional() }).strict()

const stats = z
  .object({ type: z.literal('stats'), items: z.array(z.object({ value: req(20), label: req(60) }).strict()).min(1).max(4) })
  .strict()

const testimonials = z
  .object({
    type: z.literal('testimonials'),
    title: req(100),
    items: z.array(z.object({ name: req(60), role: t(60).optional(), text: req(400) }).strict()).min(1).max(6),
  })
  .strict()

const pricing = z
  .object({
    type: z.literal('pricing'),
    title: req(100),
    plans: z
      .array(
        z
          .object({
            name: req(60),
            price: req(40),
            period: t(30).optional(),
            features: z.array(req(100)).max(10),
            highlighted: z.boolean().optional(),
          })
          .strict()
      )
      .min(1)
      .max(4),
  })
  .strict()

const faq = z
  .object({
    type: z.literal('faq'),
    title: req(100),
    items: z.array(z.object({ q: req(200), a: req(800) }).strict()).min(1).max(10),
  })
  .strict()

const gallery = z
  .object({
    type: z.literal('gallery'),
    title: req(100),
    images: z.array(z.object({ url: httpsUrl, alt: req(120) }).strict()).min(1).max(12),
  })
  .strict()

const cta = z.object({ type: z.literal('cta'), title: req(120), text: t(300), ctaText: req(40), ctaTarget }).strict()

const contact = z
  .object({ type: z.literal('contact'), title: req(100), text: t(300).optional(), showForm: z.boolean() })
  .strict()

export const sectionSchema = z.discriminatedUnion('type', [
  hero,
  features,
  services,
  about,
  stats,
  testimonials,
  pricing,
  faq,
  gallery,
  cta,
  contact,
])

export const pageSchema = z
  .object({
    slug: z.string().regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(40),
    title: req(60),
    seo: z.object({ title: req(70), description: req(170) }).strict(),
    sections: z.array(sectionSchema).min(1).max(15),
  })
  .strict()

export const siteSchema = z
  .object({
    version: z.literal(1),
    business: businessSchema,
    theme: themeSchema,
    pages: z
      .array(pageSchema)
      .min(1)
      .max(6)
      .refine((pages) => pages[0]?.slug === '', 'İlk sayfa ana sayfa olmalı (slug boş)')
      .refine((pages) => new Set(pages.map((p) => p.slug)).size === pages.length, 'Sayfa adresleri benzersiz olmalı'),
  })
  .strict()

export type SiteSchema = z.infer<typeof siteSchema>
export type SiteSection = z.infer<typeof sectionSchema>
export type SitePage = z.infer<typeof pageSchema>
export type SiteTheme = z.infer<typeof themeSchema>

export const SECTION_TYPES = sectionSchema.options.map((o) => o.shape.type.value)

/** Model çıktısını ayrıştırır (```json blokları tolere edilir) ve doğrular */
export function parseSiteJson(raw: string): { ok: true; site: SiteSchema } | { ok: false; errors: string[] } {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
  let data: unknown
  try {
    data = JSON.parse(trimmed)
  } catch {
    return { ok: false, errors: ['JSON ayrıştırılamadı'] }
  }
  const r = siteSchema.safeParse(data)
  if (!r.success) return { ok: false, errors: r.error.issues.slice(0, 10).map((i) => `${i.path.join('.')}: ${i.message}`) }
  return { ok: true, site: r.data }
}
