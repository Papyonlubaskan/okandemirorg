import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import { requireInternalApiKey, escapeHtml } from '@/lib/api-security'
import { getProductBySlug, formatTry } from '@/lib/digital-products'
import { createMailTransporter, MAIL_ADMIN, MAIL_FROM } from '@/lib/mailer'

/**
 * Havale görüldükten sonra ürünü teslim et.
 * Header: x-api-key: INTERNAL_API_KEY
 * Body: { orderCode: "OD-...." }
 */
export async function POST(request: NextRequest) {
  const authError = requireInternalApiKey(request)
  if (authError) return authError

  if (!process.env.INTERNAL_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_API_KEY tanımlı değil.' },
      { status: 503 }
    )
  }

  try {
    const { orderCode } = await request.json()
    const code = String(orderCode || '').trim().toUpperCase()
    if (!code) {
      return NextResponse.json({ success: false, error: 'orderCode gerekli' }, { status: 400 })
    }

    const connection = await pool.getConnection()
    let order: {
      order_code: string
      access_token: string
      product_slug: string
      product_name: string
      amount_try: number
      customer_name: string
      customer_email: string
      status: string
    }

    try {
      const [rows] = await connection.execute(
        `SELECT order_code, access_token, product_slug, product_name, amount_try,
                customer_name, customer_email, status
         FROM digital_orders WHERE order_code = ? LIMIT 1`,
        [code]
      )
      const list = rows as typeof order[]
      if (!list[0]) {
        return NextResponse.json({ success: false, error: 'Sipariş bulunamadı' }, { status: 404 })
      }
      order = list[0]

      if (order.status === 'paid') {
        return NextResponse.json({ success: true, message: 'Zaten teslim edilmiş', orderCode: code })
      }

      await connection.execute(
        `UPDATE digital_orders SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE order_code = ?`,
        [code]
      )
    } finally {
      connection.release()
    }

    const product = getProductBySlug(order.product_slug)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
    const downloadUrl = `${siteUrl}/api/orders/download?token=${order.access_token}`
    const amountLabel = formatTry(Number(order.amount_try))

    const transporter = createMailTransporter()
    await transporter.sendMail({
      from: MAIL_FROM,
      to: order.customer_email,
      subject: `Ürününüz hazır — ${order.product_name} (${order.order_code})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>Ödemeniz onaylandı</h2>
          <p>Merhaba ${escapeHtml(order.customer_name)},</p>
          <p><strong>${escapeHtml(order.product_name)}</strong> indirmeye hazır.</p>
          <p><a href="${downloadUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Ürünü indir</a></p>
          <p>Sipariş: ${escapeHtml(order.order_code)} · ${amountLabel}</p>
          ${product ? `<p>İçerik: ${escapeHtml(product.includes.slice(0, 4).join(', '))}…</p>` : ''}
        </div>
      `,
    })

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_ADMIN,
      subject: `Teslim edildi: ${order.order_code}`,
      html: `<p>${escapeHtml(order.customer_email)} — ${escapeHtml(order.product_name)} teslim edildi.</p>`,
    })

    return NextResponse.json({
      success: true,
      orderCode: order.order_code,
      downloadUrl,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Order fulfill error:', error)
    }
    return NextResponse.json({ success: false, error: 'Teslimat başarısız' }, { status: 500 })
  }
}
