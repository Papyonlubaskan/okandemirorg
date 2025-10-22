import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // WhatsApp webhook verification
  const hubMode = searchParams.get('hub.mode')
  const hubChallenge = searchParams.get('hub.challenge')
  const hubVerifyToken = searchParams.get('hub.verify_token')

  // Verify token kontrolü
  if (hubMode === 'subscribe' && hubVerifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
    // Webhook verified successfully
    return new NextResponse(hubChallenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Webhook received and processing

    // Webhook events'ini işle
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await handleMessages(change.value)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    // Error handled silently
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleMessages(value: any) {
  if (value.messages) {
    for (const message of value.messages) {
      await processIncomingMessage(message)
    }
  }

  if (value.statuses) {
    for (const status of value.statuses) {
      await processMessageStatus(status)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processIncomingMessage(message: any) {
  // Processing incoming WhatsApp message
  
  const { from, text, type } = message
  
  // Basit otomatik yanıt sistemi
  let responseText = ''
  
  if (type === 'text') {
    const messageText = text?.body?.toLowerCase() || ''
    
    // Anahtar kelime tabanlı yanıtlar
    if (messageText.includes('merhaba') || messageText.includes('selam')) {
      responseText = 'Merhaba! Okan Demir Dijital Pazarlama hizmetleri için hoş geldiniz. Size nasıl yardımcı olabilirim?'
    } else if (messageText.includes('fiyat') || messageText.includes('ücret')) {
      responseText = 'Hizmet fiyatlarımız proje kapsamına göre değişmektedir. Detaylı bilgi için info@okandemir.org adresinden iletişime geçebilirsiniz.'
    } else if (messageText.includes('web tasarım') || messageText.includes('website')) {
      responseText = 'Web tasarım ve geliştirme hizmetlerimiz için portföyümüzü inceleyebilirsiniz: https://okandemir.org'
    } else if (messageText.includes('seo') || messageText.includes('google')) {
      responseText = 'SEO ve Google Ads hizmetlerimiz hakkında bilgi almak için web sitemizi ziyaret edebilirsiniz: https://okandemir.org'
    } else if (messageText.includes('sosyal medya') || messageText.includes('instagram')) {
      responseText = 'Sosyal medya yönetimi hizmetlerimiz için Instagram hesabımızı takip edebilirsiniz: @okandemirorg'
    } else {
      responseText = 'Mesajınız için teşekkürler! Size en kısa sürede dönüş yapacağım. Detaylı bilgi için: info@okandemir.org'
    }
    
    // WhatsApp'a yanıt gönder
    await sendWhatsAppMessage(from, responseText)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processMessageStatus(_status: any) {
  // Mesaj durumu işleme (delivered, read, failed)
  // Status tracked for monitoring
}

async function sendWhatsAppMessage(to: string, text: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  
  if (!accessToken || !phoneNumberId) {
    // WhatsApp credentials missing - operation aborted
    return
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      })
    })

    const result = await response.json()
    // WhatsApp message sent successfully
    return result
  } catch (_error) {
    // Error sending WhatsApp message - silently handled
    return null
  }
}
