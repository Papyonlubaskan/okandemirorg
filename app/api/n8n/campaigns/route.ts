import { NextRequest, NextResponse } from 'next/server'

/**
 * Kampanya verileri n8n'e gönderme API'si
 * Manuel kampanya kontrolü tetikleme
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      platform,
      campaignId, 
      action = 'check_performance',
      threshold 
    } = body

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json({
        success: false,
        error: 'N8N_WEBHOOK_URL tanımlı değil'
      }, { status: 500 })
    }

    // n8n'e kampanya kontrolü gönder
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'campaign_check',
        data: {
          platform: platform || 'all', // 'google_ads', 'meta_ads', 'all'
          campaignId,
          requestedAction: action,
          threshold: threshold || {
            min_roas: 2,
            max_cpa: 100,
            max_daily_spend: 500
          }
        },
        timestamp: new Date().toISOString()
      })
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Kampanya kontrolü başlatıldı',
      result
    })

  } catch (error) {
    console.error('Campaign check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Kampanya kontrolü başlatılamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET - Mevcut kampanya durumları
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') || 'all'

  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json({
        success: false,
        error: 'N8N_WEBHOOK_URL tanımlı değil'
      }, { status: 500 })
    }

    // n8n'den kampanya verileri çek
    const response = await fetch(`${n8nWebhookUrl}?action=get_campaigns&platform=${platform}`)
    const data = await response.json()

    return NextResponse.json({
      success: true,
      campaigns: data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get campaigns error:', error)
    return NextResponse.json({
      success: false,
      error: 'Kampanya verileri alınamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

