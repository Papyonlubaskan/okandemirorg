/** AI tek sayfa HTML üretici */

export type LandingBrief = {
  businessName: string
  city: string
  service: string
  phone?: string
  whatsapp?: string
  highlights?: string
}

export async function generateLandingHtml(brief: LandingBrief): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY
  const fallback = buildFallbackHtml(brief)
  if (!groqApiKey) return fallback

  const prompt = `Tek dosyalık, modern, mobil uyumlu HTML landing page üret (sadece HTML, markdown yok).
Kurallar:
- Inline CSS, harici CDN yok (veya sadece system font)
- Türkçe
- Brand: ${brief.businessName}
- Şehir: ${brief.city}
- Hizmet: ${brief.service}
- Telefon: ${brief.phone || 'yok'}
- WhatsApp: ${brief.whatsapp || 'yok'}
- Öne çıkanlar: ${brief.highlights || 'yok'}
- Hero: marka adı baskın, 1 başlık, 1 kısa cümle, 1 CTA
- Kart spamı yok, mor/krem AI klişe tonlardan kaçın
- WhatsApp CTA varsa wa.me linki kullan
- Footer'da "okandemir.org AI ile üretildi" küçük not`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Sadece geçerli HTML çıktısı ver. Açıklama yazma. ``` kullanma.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      }),
    })
    if (!response.ok) return fallback
    const data = await response.json()
    let content = String(data?.choices?.[0]?.message?.content || '').trim()
    content = content.replace(/^```html?\s*/i, '').replace(/```$/i, '').trim()
    if (!content.includes('<html') && !content.includes('<!DOCTYPE')) {
      return fallback
    }
    return content
  } catch {
    return fallback
  }
}

function buildFallbackHtml(b: LandingBrief): string {
  const wa = (b.whatsapp || '').replace(/\D/g, '')
  const waHref = wa ? `https://wa.me/${wa}` : b.phone ? `tel:${b.phone}` : '#'
  const cta = wa ? 'WhatsApp’tan yazın' : b.phone ? 'Hemen ara' : 'İletişime geçin'
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escape(b.businessName)} | ${escape(b.service)} — ${escape(b.city)}</title>
<style>
  :root{--ink:#0f172a;--muted:#475569;--accent:#0d9488;--bg:#f1f5f9;--card:#fff}
  *{box-sizing:border-box}body{margin:0;font-family:Georgia,"Times New Roman",serif;color:var(--ink);background:linear-gradient(160deg,#e2e8f0,#f8fafc 40%,#ccfbf1)}
  .wrap{max-width:880px;margin:0 auto;padding:2.5rem 1.25rem}
  .brand{font-size:clamp(2rem,6vw,3.2rem);font-weight:700;letter-spacing:-.02em;margin:0 0 .5rem}
  .tag{color:var(--muted);font-size:1.05rem;margin:0 0 1.5rem;line-height:1.5}
  .cta{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;padding:.9rem 1.4rem;font-family:system-ui,sans-serif;font-weight:700;border-radius:4px}
  section{margin-top:2.5rem}h2{font-size:1.35rem;margin:0 0 .75rem}
  ul{padding-left:1.1rem;line-height:1.7;color:var(--muted)}
  footer{margin-top:3rem;font-size:.75rem;color:#94a3b8;font-family:system-ui,sans-serif}
</style>
</head>
<body>
  <main class="wrap">
    <p style="font-family:system-ui,sans-serif;font-size:.8rem;color:var(--muted);margin:0 0 1rem">${escape(b.city)} · ${escape(b.service)}</p>
    <h1 class="brand">${escape(b.businessName)}</h1>
    <p class="tag">${escape(b.city)}’de ${escape(b.service)} için net, hızlı ve güvenilir çözüm.</p>
    <a class="cta" href="${waHref}">${cta}</a>
    <section>
      <h2>Neden biz?</h2>
      <ul>
        <li>Yerel odak: ${escape(b.city)}</li>
        <li>${escape(b.service)} odaklı net teklif</li>
        <li>${escape(b.highlights || 'Hızlı dönüş ve şeffaf süreç')}</li>
      </ul>
    </section>
    <footer>okandemir.org AI ile üretildi</footer>
  </main>
</body>
</html>`
}

function escape(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
