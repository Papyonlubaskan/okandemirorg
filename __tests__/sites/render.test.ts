/**
 * @jest-environment node
 */
import { parseSiteJson, siteSchema } from '@/lib/sites/schema'
import { renderSitePage, siteHeaders } from '@/lib/sites/render'
import { buildTemplateSite, pickPreset } from '@/lib/sites/templates'

describe('site şablonu', () => {
  it('sektöre göre preset seçer ve şemaya uyar', () => {
    expect(pickPreset('Kuaför').key).toBe('guzellik')
    expect(pickPreset('Diş hekimi').key).toBe('saglik')
    expect(pickPreset('Bilinmeyen iş').key).toBe('genel')
    const site = buildTemplateSite({ businessName: 'Demir Mobilya', sector: 'Mobilya', city: 'İzmir', whatsapp: '+90 555 111 2233' })
    expect(siteSchema.safeParse(site).success).toBe(true)
    expect(site.pages.map((p) => p.slug)).toEqual(['', 'hakkimizda', 'iletisim'])
    expect(site.business.whatsapp).toBe('905551112233')
  })
})

describe('renderSitePage', () => {
  it('kullanıcı metnini kaçışlar, script/olay üretmez', () => {
    const site = buildTemplateSite({ businessName: '<script>alert(1)</script>"><img src=x onerror=alert(1)>', sector: 'Kafe', city: 'Ankara' })
    const html = renderSitePage(site, site.pages[0], { basePath: '/s/test' })
    expect(html).not.toMatch(/<script>alert|<img src=x|"><img/i)
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&quot;&gt;&lt;img')
    expect(html.match(/<script/g)?.length).toBe(1)
    expect(html).toContain('application/ld+json')
  })

  it('önizlemede form pasif, yayında kendi uç noktasına gider; noindex/index başlıkları', () => {
    const site = buildTemplateSite({ businessName: 'X Klinik', sector: 'Klinik', city: 'Bursa' })
    const contact = site.pages.find((p) => p.slug === 'iletisim')!
    const pv = renderSitePage(site, contact, { basePath: '/s/x', preview: true })
    expect(pv).not.toContain('<form')
    expect(pv).toContain('noindex')
    const live = renderSitePage(site, contact, { basePath: '/s/x', leadEndpoint: '/api/sites/lead', siteSlug: 'x', indexable: true })
    expect(live).toContain('action="/api/sites/lead"')
    expect(siteHeaders({ preview: false, indexable: false })['X-Robots-Tag']).toContain('noindex')
    expect(siteHeaders({ preview: false, indexable: true })['Content-Security-Policy']).toContain("form-action 'self'")
  })
})

describe('parseSiteJson', () => {
  it('geçersiz model çıktısını reddeder (javascript URL, ek alan, ana sayfa yok)', () => {
    const base = buildTemplateSite({ businessName: 'A', sector: 'B' })
    expect(parseSiteJson('değil json').ok).toBe(false)
    const bad1 = structuredClone(base) as unknown as { pages: { sections: Record<string, unknown>[] }[] }
    bad1.pages[0].sections[0].image = 'javascript:alert(1)'
    expect(parseSiteJson(JSON.stringify(bad1)).ok).toBe(false)
    const bad2 = { ...base, html: '<script>' }
    expect(parseSiteJson(JSON.stringify(bad2)).ok).toBe(false)
    const bad3 = { ...base, pages: [{ ...base.pages[1] }] }
    expect(parseSiteJson(JSON.stringify(bad3)).ok).toBe(false)
    expect(parseSiteJson('```json\n' + JSON.stringify(base) + '\n```').ok).toBe(true)
  })
})
