import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from '@/lib/api-security'
import { generateLandingHtml } from '@/lib/ai-landing'
import { appendOrderNote, getPaidOrderByToken } from '@/lib/order-access'
import { sendWhatsAppText } from '@/lib/whatsapp-client'

/**
 * Self-serve AI landing HTML
 * Body: { token, businessName, city, service, phone?, whatsapp?, highlights? }
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`ai-landing:${ip}`, 8, 60 * 60 * 1000)) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const token = String(body.token || '').trim()
    const businessName = String(body.businessName || '').trim()
    const city = String(body.city || '').trim()
    const service = String(body.service || '').trim()
    const phone = String(body.phone || '').trim()
    const whatsapp = String(body.whatsapp || '').trim()
    const highlights = String(body.highlights || '').trim()

    if (!token || businessName.length < 2 || city.length < 2 || service.length < 2) {
      return NextResponse.json(
        { success: false, error: 'token, businessName, city, service zorunlu' },
        { status: 400 }
      )
    }

    const order = await getPaidOrderByToken(token, 'ai-landing-sayfa')
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veya ödenmemiş token' },
        { status: 403 }
      )
    }

    if (!checkRateLimit(`ai-landing-token:${token}`, 5, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Bu sipariş için günlük limit doldu (5)' },
        { status: 429 }
      )
    }

    const html = await generateLandingHtml({
      businessName,
      city,
      service,
      phone,
      whatsapp,
      highlights,
    })

    await appendOrderNote(order.order_code, `ai_landing:${businessName}|${city}`)

    if (order.customer_phone) {
      await sendWhatsAppText(
        order.customer_phone,
        `AI Landing hazır ✅\n${order.order_code}\n${businessName} — ${city}\nPanelden HTML/zip indirin.`
      )
    }

    const fileSafe = businessName
      .toLowerCase()
      .replace(/[^a-z0-9çğıöşü]+/gi, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40)

    return NextResponse.json({
      success: true,
      orderCode: order.order_code,
      filename: `${fileSafe || 'landing'}.html`,
      html,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Üretim başarısız',
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
