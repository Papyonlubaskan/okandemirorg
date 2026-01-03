import { NextRequest, NextResponse } from 'next/server'

/**
 * n8n Webhook Trigger API
 * okandemir.org'dan n8n'e event gönderir
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data, priority = 'normal' } = body

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'action parametresi gerekli'
      }, { status: 400 })
    }

    // n8n webhook URL (Railway env)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json({
        success: false,
        error: 'N8N_WEBHOOK_URL tanımlı değil'
      }, { status: 500 })
    }

    // n8n'e gönder
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'okandemir-org',
        'X-Priority': priority
      },
      body: JSON.stringify({
        action,
        data,
        timestamp: new Date().toISOString(),
        source: 'okandemir.org'
      })
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'n8n workflow tetiklendi',
      action,
      result
    })

  } catch (error) {
    console.error('n8n trigger error:', error)
    return NextResponse.json({
      success: false,
      error: 'n8n workflow tetiklenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET endpoint - n8n health check
 */
export async function GET() {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
  
  return NextResponse.json({
    success: true,
    n8n_configured: !!n8nWebhookUrl,
    timestamp: new Date().toISOString()
  })
}

