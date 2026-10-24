import type { TaskStore } from '@/lib/ai/store-types'
import { isPlanActive } from '@/lib/billing/plans'
import { esc, findPage, renderSitePage, siteHeaders } from './render'

const SITE_ORIGIN = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'

function simplePage(title: string, text: string, status: number): Response {
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(
    title
  )}</title><meta name="robots" content="noindex"><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f5f7fb;color:#0f172a}div{max-width:480px;text-align:center;padding:24px}</style></head><body><div><h1>${esc(
    title
  )}</h1><p>${esc(text)}</p></div></body></html>`
  return new Response(html, { status, headers: siteHeaders({ preview: true, indexable: false }) })
}

/**
 * Yayındaki siteyi sunar: yalnızca yayınlanmış sürüm, aktif (veya ek süredeki) plan.
 * okandemir.org/s/... altında noindex: ana alan adının SEO'su korunur; indekslenebilir yayın alt alan adı/özel domain ile gelir.
 */
export async function servePublishedSite(store: TaskStore, slug: string, pagePath: string, notice?: string): Promise<Response | null> {
  const site = await store.getSiteBySlug(slug)
  if (!site) return null
  if (site.status === 'suspended') return simplePage('Site geçici olarak yayında değil', 'Bu sitenin yayın planı yenilenmedi.', 503)
  if (site.status !== 'published' || !site.publishedVersion) return null

  const ws = await store.getWorkspace(site.workspaceId)
  if (!ws || !isPlanActive(ws, Date.now(), true)) {
    return simplePage('Site geçici olarak yayında değil', 'Bu sitenin yayın planı yenilenmedi.', 503)
  }

  const version = await store.getSiteVersion(site.id, site.publishedVersion)
  if (!version) return null
  const page = findPage(version.schema, pagePath)
  if (!page) return simplePage('Sayfa bulunamadı', 'Aradığınız sayfa bu sitede yok.', 404)

  const basePath = `/s/${site.slug}`
  const html = renderSitePage(version.schema, page, {
    basePath,
    leadEndpoint: '/api/sites/lead',
    siteSlug: site.slug,
    indexable: false,
    canonicalUrl: `${SITE_ORIGIN()}${basePath}${page.slug ? `/${page.slug}` : ''}`,
    notice,
  })
  return new Response(html, { status: 200, headers: siteHeaders({ preview: false, indexable: false }) })
}
