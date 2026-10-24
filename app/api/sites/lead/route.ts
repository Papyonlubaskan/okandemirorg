import { NextRequest, NextResponse } from 'next/server'
import { escapeHtml, getClientIp } from '@/lib/api-security'
import { isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { createMailTransporter, MAIL_FROM } from '@/lib/mailer'
import { checkRateLimits } from '@/lib/security/rate-limit'
import { sha256Hex } from '@/lib/security/secrets'

export const dynamic = 'force-dynamic'

const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? '').trim().slice(0, n)

/** POST /api/sites/lead — yayındaki müşteri sitesindeki iletişim formu (script'siz, form-urlencoded) */
export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Geçersiz form' }, { status: 400 })
  }
  const slug = clip(form.get('site'), 60)
  const back = (q: string) => NextResponse.redirect(new URL(`/s/${encodeURIComponent(slug)}/iletisim?${q}`, request.url), 303)

  // Bot tuzağı: gizli alan doluysa sessizce başarı gibi davran
  if (clip(form.get('website'), 100)) return back('gonderildi=1')

  const name = clip(form.get('name'), 100)
  const message = clip(form.get('message'), 1000)
  const phone = clip(form.get('phone'), 30) || null
  const email = clip(form.get('email'), 120) || null
  if (!/^[a-z0-9-]{3,60}$/.test(slug) || name.length < 2 || message.length < 2) return back('hata=1')

  const store = getStore()
  const site = await store.getSiteBySlug(slug)
  if (!site || site.status !== 'published') return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ip = getClientIp(request)
  const ok = await checkRateLimits([
    { key: `lead:ip:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 },
    { key: `lead:site:${site.id}`, limit: 200, windowMs: 24 * 60 * 60 * 1000 },
  ])
  if (!ok) return back('hata=limit')

  await store.addSiteLead({
    siteId: site.id,
    workspaceId: site.workspaceId,
    name,
    phone,
    email,
    message,
    ipHash: sha256Hex(`${process.env.AUTH_SECRET || 'okd'}:${ip}`),
  })

  const owner = await store.getWorkspaceOwnerEmail(site.workspaceId).catch(() => null)
  if (owner && !owner.endsWith('.local')) {
    createMailTransporter()
      .sendMail({
        from: MAIL_FROM,
        to: owner,
        subject: `Yeni müşteri mesajı — ${site.name}`,
        html: `<p><strong>${escapeHtml(name)}</strong> sitenizden yazdı.</p><p>${escapeHtml(message)}</p><p>${escapeHtml(phone || '')} ${escapeHtml(email || '')}</p><p>Tüm mesajlar: panel → Siteler</p>`,
      })
      .catch(() => {})
  }
  return back('gonderildi=1')
}
