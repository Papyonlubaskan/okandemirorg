import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from '@/lib/api-security'
import { crawlUrl, generateAuditReport } from '@/lib/ai-audit'
import { appendOrderNote, getPaidOrderByToken } from '@/lib/order-access'
import { sendWhatsAppText } from '@/lib/whatsapp-client'

/**
 * Self-serve AI SEO denetim
 * Body: { token, url }
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`ai-audit:${ip}`, 8, 60 * 60 * 1000)) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const token = String(body.token || '').trim()
    const url = String(body.url || '').trim()

    if (!token || !url) {
      return NextResponse.json({ success: false, error: 'token ve url gerekli' }, { status: 400 })
    }

    const order = await getPaidOrderByToken(token, 'ai-seo-denetim')
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veya ödenmemiş token' },
        { status: 403 }
      )
    }

    // Token başına sınırlı kullanım
    if (!checkRateLimit(`ai-audit-token:${token}`, 3, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Bu sipariş için günlük limit doldu (3)' },
        { status: 429 }
      )
    }

    const signals = await crawlUrl(url)
    const report = await generateAuditReport(signals)

    await appendOrderNote(order.order_code, `ai_audit:${signals.finalUrl || url}`)

    if (order.customer_phone) {
      const preview = report.slice(0, 900)
      await sendWhatsAppText(
        order.customer_phone,
        `AI SEO Denetim hazır ✅\n${order.order_code}\nURL: ${signals.finalUrl || url}\n\n${preview}${report.length > 900 ? '\n…(tam rapor panelde)' : ''}`
      )
    }

    return NextResponse.json({
      success: true,
      orderCode: order.order_code,
      signals: {
        url: signals.url,
        finalUrl: signals.finalUrl,
        status: signals.status,
        title: signals.title,
        loadMs: signals.loadMs,
      },
      report,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Denetim başarısız',
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
