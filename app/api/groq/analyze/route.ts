import { NextRequest, NextResponse } from 'next/server'

interface CampaignSummary {
  name?: string
  roas?: number
}

interface GroqClientData {
  name?: string
  company_name?: string
  package_type?: string
  platforms?: string[]
  total_campaigns?: number
  today_spend?: number
  today_conversions?: number
  today_roas?: number
  month_spend?: number
  monthly_budget_limit?: number
  budget_usage_percent?: number
  target_roas?: number
  target_cpa?: number
  issue_type?: string
  campaign_name?: string
  platform?: string
  current_roas?: number
  current_cpa?: number
  daily_spend?: number
  period_start?: string
  period_end?: string
  total_spend?: number
  total_conversions?: number
  avg_roas?: number
  avg_cpa?: number
  top_campaigns?: CampaignSummary[]
  bottom_campaigns?: CampaignSummary[]
}

/**
 * Groq AI Analysis API
 * 100% Ücretsiz - Kredi kartı gerekmez
 * Limit: 14,400 request/day (günde 20 müşteri için fazlasıyla yeterli)
 * Müşteri kampanyalarını analiz et
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientData, analysisType = 'performance' } = body

    if (!clientData) {
      return NextResponse.json({
        success: false,
        error: 'clientData gerekli'
      }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json({
        success: false,
        error: 'GROQ_API_KEY tanımlı değil'
      }, { status: 500 })
    }

    // Prompt oluştur
    const prompt = generatePrompt(clientData, analysisType)

    // Groq API çağrısı
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Sen Okan Demir Digital Marketing ajansının dijital pazarlama uzmanısın. Müşteri kampanyalarını analiz edip Türkçe öneriler sunuyorsun. Profesyonel ama anlaşılır bir dil kullan.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${error}`)
    }

    const result = await response.json()
    const analysis = result.choices[0].message.content

    // Token kullanımı
    const tokensUsed = result.usage?.total_tokens || 0

    return NextResponse.json({
      success: true,
      analysis,
      tokensUsed,
      provider: 'groq',
      model: 'llama-3.1-70b-versatile',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Groq analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'AI analizi yapılamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generatePrompt(clientData: GroqClientData, analysisType: string): string {
  const baseInfo = `
Müşteri: ${clientData.name || 'N/A'}
Şirket: ${clientData.company_name || 'N/A'}
Paket: ${clientData.package_type || 'N/A'}
`

  if (analysisType === 'performance') {
    return `${baseInfo}

📊 KAMPANYA PERFORMANSI:

Platformlar: ${clientData.platforms?.join(', ') || 'N/A'}
Aktif Kampanya: ${clientData.total_campaigns || 0}

Bugün:
- Harcama: ₺${clientData.today_spend || 0}
- Dönüşüm: ${clientData.today_conversions || 0}
- ROAS: ${clientData.today_roas || 0}x

Bu Ay:
- Toplam Harcama: ₺${clientData.month_spend || 0}
- Bütçe Limiti: ₺${clientData.monthly_budget_limit || 0}
- Kullanım: %${clientData.budget_usage_percent || 0}

Hedefler:
- Hedef ROAS: ${clientData.target_roas || 0}x
- Hedef CPA: ₺${clientData.target_cpa || 0}

LÜTFEN ANALİZ ET:
1. 📈 Performans Değerlendirmesi (kısa)
2. 🎯 Hedeflere göre durum
3. ⚠️ Dikkat edilmesi gerekenler
4. 💡 3-5 somut optimizasyon önerisi
5. 🚀 Sonraki adımlar

Kısa ve net cevap ver. Gereksiz detay verme.`
  }

  if (analysisType === 'alert') {
    return `${baseInfo}

⚠️ UYARI ANALİZİ:

Sorun: ${clientData.issue_type || 'N/A'}
Kampanya: ${clientData.campaign_name || 'N/A'}
Platform: ${clientData.platform || 'N/A'}

Metrikler:
- ROAS: ${clientData.current_roas || 0}x (Hedef: ${clientData.target_roas || 0}x)
- CPA: ₺${clientData.current_cpa || 0} (Hedef: ₺${clientData.target_cpa || 0})
- Günlük Harcama: ₺${clientData.daily_spend || 0}

Bu durumda:
1. Ne yapılmalı? (acil)
2. Kampanya durdurulmalı mı?
3. Müşteriye ne söylenilmeli?

Kısa ve net cevap ver.`
  }

  if (analysisType === 'report') {
    return `${baseInfo}

📊 HAFTALIK RAPOR HAZIRLIĞI:

Dönem: ${clientData.period_start} - ${clientData.period_end}

Toplam Performans:
- Harcama: ₺${clientData.total_spend || 0}
- Dönüşüm: ${clientData.total_conversions || 0}
- ROAS: ${clientData.avg_roas || 0}x
- CPA: ₺${clientData.avg_cpa || 0}

En İyi Kampanyalar:
${clientData.top_campaigns?.map((c) => `- ${c.name}: ROAS ${c.roas}x`).join('\n') || 'N/A'}

En Kötü Kampanyalar:
${clientData.bottom_campaigns?.map((c) => `- ${c.name}: ROAS ${c.roas}x`).join('\n') || 'N/A'}

Müşteriye gönderilecek rapor için:
1. 🎉 Başarılar (pozitif vurgula)
2. 📊 Genel değerlendirme
3. 💡 Gelecek hafta için öneriler
4. 🎯 Odaklanılacak noktalar

Müşteri dostu, motive edici bir dil kullan.`
  }

  return `${baseInfo}\n\nBu müşteri hakkında genel bir değerlendirme yap.`
}

