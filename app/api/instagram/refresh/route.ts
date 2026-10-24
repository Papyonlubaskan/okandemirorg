import { NextRequest, NextResponse } from 'next/server'
import { requireInternalApiKey } from '@/lib/api-security'
import { maskSecret } from '@/lib/security/secrets'

export async function POST(request: NextRequest) {
  const authError = requireInternalApiKey(request)
  if (authError) return authError

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      error: 'Instagram access token bulunamadı'
    }, { status: 400 })
  }

  try {
    // Access token'ı yenile (60 gün daha geçerli hale getir)
    const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`)
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      accessToken: maskSecret(data.access_token),
      expiresIn: data.expires_in,
      message: 'Access token başarıyla yenilendi'
    })

  } catch {
    return NextResponse.json({
      success: false,
      error: 'Access token yenilenemedi'
    }, { status: 500 })
  }
}
