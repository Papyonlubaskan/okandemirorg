/**
 * Model üretimi HTML için savunma katmanı. Asıl izolasyon sunumda: CSP `sandbox` (script yok, opak origin).
 * Script, olay öznitelikleri, javascript: URL'leri, gömülü içerik, form ve yönlendirme etiketleri kaldırılır.
 */
export function sanitizeLandingHtml(html: string): string {
  let out = html
  const dropBlocks = ['script', 'iframe', 'object', 'embed', 'applet', 'frameset', 'frame', 'form', 'template', 'noscript', 'svg', 'math']
  for (const tag of dropBlocks) {
    out = out.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, 'gi'), '')
    out = out.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '')
  }
  out = out.replace(/<(base|link)\b[^>]*>/gi, '')
  out = out.replace(/<meta\b[^>]*http-equiv[^>]*>/gi, '')
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  out = out.replace(/\s+(href|src|action|formaction|xlink:href)\s*=\s*("|')\s*(javascript|vbscript|data:text\/html)[^"']*\2/gi, '')
  out = out.replace(/\s+srcdoc\s*=\s*("[^"]*"|'[^']*')/gi, '')
  out = out.replace(/expression\s*\(/gi, '')
  out = out.replace(/@import\b[^;]*;?/gi, '')
  return out
}

/** Önizleme ve yayın yanıtlarının güvenlik başlıkları */
export const SANDBOX_HEADERS: Record<string, string> = {
  'Content-Type': 'text/html; charset=utf-8',
  'Content-Security-Policy':
    "sandbox; default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https: data:; frame-ancestors 'self'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
}
