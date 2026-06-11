import { NextRequest, NextResponse } from 'next/server'
import { requireInternalApiKey } from '@/lib/api-security'

export async function POST(request: NextRequest) {
  const authError = requireInternalApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json({
        success: false,
        error: 'to ve message alanları gerekli'
      }, { status: 400 })
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({
        success: false,
        error: 'WhatsApp credentials bulunamadı',
        hint: 'Railway Variables: WHATSAPP_ACCESS_TOKEN ve WHATSAPP_PHONE_NUMBER_ID ekleyin',
      }, { status: 503 })
    }

    const recipient = String(to).replace(/\D/g, '')

    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: message }
      })
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        messageId: result.messages?.[0]?.id,
        message: 'WhatsApp mesajı başarıyla gönderildi'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error?.message || 'WhatsApp mesajı gönderilemedi'
      }, { status: response.status })
    }

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
