import { NextRequest, NextResponse } from 'next/server'
import { handleWaSalesBot } from '@/lib/wa-sales-bot'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hubMode = searchParams.get('hub.mode')
  const hubChallenge = searchParams.get('hub.challenge')
  const hubVerifyToken = searchParams.get('hub.verify_token')

  if (hubMode === 'subscribe' && hubVerifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(hubChallenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            await handleMessages(change.value)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleMessages(value: any) {
  if (!value?.messages) return

  for (const message of value.messages) {
    const from = String(message.from || '')
    if (!from) continue

    let text = ''
    if (message.type === 'text') {
      text = String(message.text?.body || '')
    } else if (message.type === 'button') {
      text = String(message.button?.text || message.button?.payload || '')
    } else if (message.type === 'interactive') {
      text = String(
        message.interactive?.button_reply?.title ||
          message.interactive?.list_reply?.title ||
          ''
      )
    } else if (message.type === 'image' || message.type === 'document') {
      // Dekont görseli → ödeme sinyali
      text = 'dekont gönderildi'
    }

    if (text) {
      await handleWaSalesBot(from, text)
    }
  }
}
