import { NextRequest, NextResponse } from 'next/server'
import { analyzePage } from '@/lib/seo-analyzer'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL gerekli' },
        { status: 400 }
      )
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Sayfa yüklenemedi' },
        { status: 400 }
      )
    }

    const html = await response.text()

    // Analyze the page
    const analysis = analyzePage(url, html)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('SEO analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Analiz yapılamadı' },
      { status: 500 }
    )
  }
}

