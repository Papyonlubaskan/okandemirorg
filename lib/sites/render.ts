import type { SitePage, SiteSchema, SiteSection, SiteTheme } from './schema'

/**
 * Site şemasını tek dosyalık, script içermeyen HTML'e çevirir. Tüm kullanıcı/model metni kaçışlanır;
 * URL'ler şemada yalnızca https ile sınırlıdır. Çıktı, sitenin kendi CSP'siyle sunulur.
 */

export function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type RenderOptions = {
  /** Sayfa linklerinin öneki, ör. /s/demir-mobilya */
  basePath: string
  /** Form gönderim hedefi (yayında); önizlemede form devre dışı */
  leadEndpoint?: string
  siteSlug?: string
  preview?: boolean
  /** Yayında arama motoru indeksi */
  indexable?: boolean
  canonicalUrl?: string
  /** Sayfa üstünde gösterilecek kısa bildirim (ör. form gönderildi) */
  notice?: string
}

const FONTS: Record<SiteTheme['font'], string> = {
  modern: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
  classic: "Georgia,'Times New Roman',serif",
  friendly: "'Trebuchet MS','Segoe UI',system-ui,sans-serif",
}
const RADIUS: Record<SiteTheme['radius'], string> = { none: '0', md: '10px', lg: '20px' }

function themeCss(t: SiteTheme): string {
  const dark = t.mode === 'dark'
  return `:root{--p:${t.primary};--a:${t.accent};--bg:${dark ? '#0b1120' : '#ffffff'};--bg2:${dark ? '#111a2e' : '#f5f7fb'};--ink:${
    dark ? '#e7ecf5' : '#0f172a'
  };--muted:${dark ? '#9aa6bd' : '#55627a'};--line:${dark ? '#22304d' : '#e3e8f0'};--r:${RADIUS[t.radius]};--f:${FONTS[t.font]}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:var(--f);color:var(--ink);background:var(--bg);line-height:1.6}
a{color:inherit}img{max-width:100%;display:block}.w{max-width:1120px;margin:0 auto;padding:0 20px}
header.top{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
header.top .w{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px}
.brand{font-weight:800;font-size:1.2rem;text-decoration:none}nav.m a{margin-left:18px;text-decoration:none;color:var(--muted);font-weight:600;font-size:.95rem}
nav.m a:hover{color:var(--p)}details.mm{display:none}
.btn{display:inline-block;background:var(--p);color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:var(--r);border:0;cursor:pointer;font-size:1rem}
.btn.alt{background:transparent;color:var(--p);border:2px solid var(--p)}
section{padding:72px 0}section.alt{background:var(--bg2)}h1,h2,h3{line-height:1.2;margin:0 0 14px}h2{font-size:clamp(1.6rem,3.2vw,2.2rem)}
.lead{color:var(--muted);font-size:1.1rem;max-width:680px}
.hero{padding:96px 0 80px;background:radial-gradient(1200px 500px at 10% -10%,color-mix(in srgb,var(--p) 22%,transparent),transparent),radial-gradient(900px 400px at 100% 0,color-mix(in srgb,var(--a) 18%,transparent),transparent)}
.hero h1{font-size:clamp(2.1rem,5.4vw,3.6rem);letter-spacing:-.02em;max-width:820px}.hero .lead{margin:0 0 28px}
.hero.img .w{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}.hero.img img{border-radius:var(--r);aspect-ratio:4/3;object-fit:cover;width:100%}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:28px}
.card{background:var(--bg);border:1px solid var(--line);border-radius:var(--r);padding:24px}section.alt .card{background:var(--bg)}
.card h3{font-size:1.1rem}.card p{color:var(--muted);margin:0}.ico{font-size:1.6rem;margin-bottom:10px}
.price{font-size:1.9rem;font-weight:800;color:var(--p)}.card.hl{border:2px solid var(--p);box-shadow:0 10px 30px color-mix(in srgb,var(--p) 18%,transparent)}
.card ul{padding-left:18px;color:var(--muted)}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:20px;text-align:center}
.stats b{display:block;font-size:2.2rem;color:var(--p)}.stats span{color:var(--muted)}
.about{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}.about img{border-radius:var(--r)}
.q{border-bottom:1px solid var(--line);padding:16px 0}.q summary{cursor:pointer;font-weight:700}.q p{color:var(--muted)}
.gal{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-top:24px}.gal img{border-radius:var(--r);aspect-ratio:1;object-fit:cover;width:100%}
.ctab{background:linear-gradient(135deg,var(--p),var(--a));color:#fff;border-radius:var(--r);padding:48px;text-align:center}.ctab .lead{color:#f1f5ff;margin:0 auto 24px}.ctab .btn{background:#fff;color:var(--p)}
form.c{display:grid;gap:12px;max-width:560px;margin-top:20px}form.c input,form.c textarea{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:var(--r);background:var(--bg);color:var(--ink);font:inherit}
.cinfo{display:grid;gap:6px;color:var(--muted);margin-top:12px}footer.ft{border-top:1px solid var(--line);padding:28px 0;color:var(--muted);font-size:.9rem}
footer.ft .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}.wa{position:fixed;right:18px;bottom:18px;background:#25d366;color:#fff;text-decoration:none;font-weight:800;padding:14px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.2)}
.pv{background:#f59e0b;color:#111;text-align:center;font:600 13px/1.4 system-ui;padding:6px}
@media (max-width:820px){nav.m{display:none}details.mm{display:block}details.mm nav{position:absolute;right:20px;top:60px;background:var(--bg);border:1px solid var(--line);border-radius:var(--r);padding:12px;display:grid;gap:10px;min-width:180px}
.hero.img .w,.about{grid-template-columns:1fr}section{padding:56px 0}.ctab{padding:32px 20px}}`
}

function ctaHref(site: SiteSchema, target: string, url: string | undefined, opts: RenderOptions): string {
  const b = site.business
  if (target === 'whatsapp' && b.whatsapp) return `https://wa.me/${b.whatsapp}`
  if (target === 'phone' && b.phone) return `tel:${b.phone.replace(/[^\d+]/g, '')}`
  if (target === 'url' && url) return url
  const contactPage = site.pages.find((p) => p.sections.some((s) => s.type === 'contact'))
  return contactPage ? `${opts.basePath}${contactPage.slug ? `/${contactPage.slug}` : ''}#iletisim` : '#iletisim'
}

function section(site: SiteSchema, s: SiteSection, i: number, opts: RenderOptions): string {
  const alt = i % 2 === 1 ? ' class="alt"' : ''
  switch (s.type) {
    case 'hero': {
      const href = ctaHref(site, s.ctaTarget, s.ctaUrl, opts)
      const inner = `<div><h1>${esc(s.title)}</h1><p class="lead">${esc(s.subtitle)}</p><a class="btn" href="${esc(href)}">${esc(s.ctaText)}</a></div>`
      return s.image
        ? `<section class="hero img"><div class="w">${inner}<img src="${esc(s.image)}" alt="${esc(s.title)}" loading="eager"></div></section>`
        : `<section class="hero"><div class="w">${inner}</div></section>`
    }
    case 'features':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2><div class="grid">${s.items
        .map((x) => `<div class="card">${x.icon ? `<div class="ico">${esc(x.icon)}</div>` : ''}<h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`)
        .join('')}</div></div></section>`
    case 'services':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2><div class="grid">${s.items
        .map((x) => `<div class="card"><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p>${x.price ? `<p class="price" style="font-size:1.2rem;margin-top:10px">${esc(x.price)}</p>` : ''}</div>`)
        .join('')}</div></div></section>`
    case 'about':
      return `<section${alt}><div class="w ${s.image ? 'about' : ''}"><div><h2>${esc(s.title)}</h2><p class="lead">${esc(s.text).replace(/\n/g, '<br>')}</p></div>${
        s.image ? `<img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy">` : ''
      }</div></section>`
    case 'stats':
      return `<section${alt}><div class="w stats">${s.items.map((x) => `<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join('')}</div></section>`
    case 'testimonials':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2><div class="grid">${s.items
        .map((x) => `<div class="card"><p>“${esc(x.text)}”</p><h3 style="margin-top:14px;font-size:1rem">${esc(x.name)}${x.role ? ` · <span style="color:var(--muted);font-weight:500">${esc(x.role)}</span>` : ''}</h3></div>`)
        .join('')}</div></div></section>`
    case 'pricing':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2><div class="grid">${s.plans
        .map(
          (p) =>
            `<div class="card${p.highlighted ? ' hl' : ''}"><h3>${esc(p.name)}</h3><div class="price">${esc(p.price)}${p.period ? `<small style="font-size:.9rem;color:var(--muted)"> / ${esc(p.period)}</small>` : ''}</div><ul>${p.features
              .map((f) => `<li>${esc(f)}</li>`)
              .join('')}</ul></div>`
        )
        .join('')}</div></div></section>`
    case 'faq':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2>${s.items
        .map((x) => `<details class="q"><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`)
        .join('')}</div></section>`
    case 'gallery':
      return `<section${alt}><div class="w"><h2>${esc(s.title)}</h2><div class="gal">${s.images
        .map((g) => `<img src="${esc(g.url)}" alt="${esc(g.alt)}" loading="lazy">`)
        .join('')}</div></div></section>`
    case 'cta':
      return `<section><div class="w"><div class="ctab"><h2>${esc(s.title)}</h2><p class="lead">${esc(s.text)}</p><a class="btn" href="${esc(
        ctaHref(site, s.ctaTarget, undefined, opts)
      )}">${esc(s.ctaText)}</a></div></div></section>`
    case 'contact': {
      const b = site.business
      const info = [
        b.phone ? `<span>📞 <a href="tel:${esc(b.phone.replace(/[^\d+]/g, ''))}">${esc(b.phone)}</a></span>` : '',
        b.whatsapp ? `<span>💬 <a href="https://wa.me/${esc(b.whatsapp)}">WhatsApp</a></span>` : '',
        b.email ? `<span>✉️ <a href="mailto:${esc(b.email)}">${esc(b.email)}</a></span>` : '',
        b.address ? `<span>📍 ${esc(b.address)}</span>` : b.city ? `<span>📍 ${esc(b.city)}</span>` : '',
      ].join('')
      const form = s.showForm
        ? opts.preview || !opts.leadEndpoint
          ? `<p class="lead" style="font-size:.95rem">Form yayında aktif olur.</p>`
          : `<form class="c" method="post" action="${esc(opts.leadEndpoint)}"><input type="hidden" name="site" value="${esc(opts.siteSlug)}"><input name="name" required maxlength="100" placeholder="Adınız"><input name="phone" maxlength="30" placeholder="Telefon"><input name="email" type="email" maxlength="120" placeholder="E-posta"><textarea name="message" rows="4" maxlength="1000" placeholder="Mesajınız" required></textarea><input name="website" style="display:none" tabindex="-1" autocomplete="off"><button class="btn" type="submit">Gönder</button></form>`
        : ''
      return `<section id="iletisim"${alt}><div class="w"><h2>${esc(s.title)}</h2>${s.text ? `<p class="lead">${esc(s.text)}</p>` : ''}<div class="cinfo">${info}</div>${form}</div></section>`
    }
  }
}

export function findPage(site: SiteSchema, slug: string): SitePage | undefined {
  return site.pages.find((p) => p.slug === slug)
}

export function renderSitePage(site: SiteSchema, page: SitePage, opts: RenderOptions): string {
  const b = site.business
  const href = (p: SitePage) => `${opts.basePath}${p.slug ? `/${p.slug}` : ''}` || '/'
  const links = site.pages.map((p) => `<a href="${esc(href(p))}">${esc(p.title)}</a>`).join('')
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name,
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(b.email ? { email: b.email } : {}),
    ...(b.city || b.address ? { address: { '@type': 'PostalAddress', addressLocality: b.city, streetAddress: b.address } } : {}),
  }
  const robots = opts.indexable && !opts.preview ? 'index,follow' : 'noindex,nofollow'

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.seo.title)}</title><meta name="description" content="${esc(page.seo.description)}"><meta name="robots" content="${robots}">
${opts.canonicalUrl ? `<link rel="canonical" href="${esc(opts.canonicalUrl)}">` : ''}
<meta property="og:title" content="${esc(page.seo.title)}"><meta property="og:description" content="${esc(page.seo.description)}"><meta property="og:type" content="website">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>${themeCss(site.theme)}</style></head><body>
${opts.preview ? '<div class="pv">Önizleme — yayında değil</div>' : ''}
${opts.notice ? `<div class="pv" style="background:#16a34a;color:#fff">${esc(opts.notice)}</div>` : ''}
<header class="top"><div class="w"><a class="brand" href="${esc(href(site.pages[0]))}">${esc(b.name)}</a><nav class="m">${links}</nav><details class="mm"><summary class="btn alt" style="padding:8px 14px">Menü</summary><nav>${links}</nav></details></div></header>
<main>${page.sections.map((s, i) => section(site, s, i, opts)).join('\n')}</main>
<footer class="ft"><div class="w"><span>© ${new Date().getFullYear()} ${esc(b.name)}${b.city ? ` · ${esc(b.city)}` : ''}</span><span>okandemir.org ile oluşturuldu</span></div></footer>
${b.whatsapp ? `<a class="wa" href="https://wa.me/${esc(b.whatsapp)}" aria-label="WhatsApp">WhatsApp</a>` : ''}
</body></html>`
}

/** Sitenin kendi sayfaları için güvenlik başlıkları: script yok (JSON-LD hariç veri), form yalnızca kendi alanımıza */
export function siteHeaders(opts: { preview: boolean; indexable: boolean }): Record<string, string> {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy':
      "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https: data:; form-action 'self'; base-uri 'none'; frame-ancestors 'self'",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Robots-Tag': opts.indexable && !opts.preview ? 'index, follow' : 'noindex, nofollow',
    'Cache-Control': opts.preview ? 'no-store' : 'public, max-age=120',
  }
}
