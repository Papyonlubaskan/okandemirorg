import { NextResponse } from 'next/server'

export async function POST() {
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
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      message: 'Access token başarıyla yenilendi'
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Access token yenilenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
