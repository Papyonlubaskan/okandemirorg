import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { escapeHtml, rateLimitResponse } from '@/lib/api-security'
import { paymentWhatsAppUrl } from '@/lib/bank-transfer'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { getBillingSku } from '@/lib/billing/catalog'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { formatTry } from '@/lib/digital-products'
import { createMailTransporter, MAIL_ADMIN, MAIL_FROM } from '@/lib/mailer'
import { execute } from '@/lib/mysql'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { ensureOrdersTable } from '@/lib/wa-sales-bot'
import { getOwnerPhone, sendWhatsAppText } from '@/lib/whatsapp-client'

export const dynamic = 'force-dynamic'

function orderCode(): string {
  return `OD-${Date.now().toString(36).toUpperCase().slice(-4)}${randomBytes(2).toString('hex').toUpperCase()}`
}

/**
 * POST /api/billing/order — { sku, workspaceId? } (owner/admin)
 * Ödeme entegrasyonu gelene kadar: sipariş oluşur, ödeme WhatsApp/havale ile; "ONAY OD-XXXX" ile kredi/plan
 * workspace'e otomatik ve tek sefer yüklenir.
 */
export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }
  const sku = getBillingSku(String(body.sku || ''))
  if (!sku) return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })

  const ctx = await requireWorkspace(typeof body.workspaceId === 'string' ? body.workspaceId : null, { roles: ['owner', 'admin'] })
  if (isResponse(ctx)) return ctx
  if (!(await checkDbRateLimit(`billing-order:${ctx.user.id}`, 10, 60 * 60 * 1000))) return rateLimitResponse()

  await ensureOrdersTable()
  const code = orderCode()
  const amountLabel = formatTry(sku.priceTry)
  await execute(
    `INSERT INTO digital_orders
       (order_code, access_token, product_slug, product_name, amount_try, customer_name, customer_email, customer_phone, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, 'pending_payment')`,
    [code, randomBytes(24).toString('hex'), sku.sku, sku.name, sku.priceTry, ctx.user.name || ctx.user.email || 'Panel', ctx.user.email || 'panel@okandemir.local', `source:panel\nws:${ctx.workspaceId}`]
  )

  await ctx.store
    .audit({ workspaceId: ctx.workspaceId, actorType: 'user', actorId: ctx.user.id, action: 'billing.order_created', targetType: 'digital_order', targetId: code, outcome: 'ok', metadata: { sku: sku.sku, amount: sku.priceTry } })
    .catch(() => {})

  sendWhatsAppText(getOwnerPhone(), `🧾 Panel siparişi\n${sku.name} — ${amountLabel}\nKod: ${code}\nMüşteri: ${ctx.user.email}\n\nÖdeme gelince: ONAY ${code}`).catch(() => false)
  createMailTransporter()
    .sendMail({
      from: MAIL_FROM,
      to: MAIL_ADMIN,
      subject: `Panel siparişi: ${code} — ${amountLabel}`,
      html: `<p>${escapeHtml(ctx.user.email || '')} — ${escapeHtml(sku.name)} (${amountLabel})</p><p>Onay: WhatsApp'tan <b>ONAY ${escapeHtml(code)}</b></p>`,
    })
    .catch(() => {})

  return NextResponse.json({ ok: true, orderCode: code, amountLabel, waUrl: paymentWhatsAppUrl(code, amountLabel) })
}
