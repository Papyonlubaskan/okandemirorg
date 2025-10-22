import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    // Instagram OAuth URL oluştur
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/instagram/auth`
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`
    
    return NextResponse.redirect(authUrl)
  }

  try {
    // Access token al
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/instagram/auth`,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (tokenData.access_token) {
      // Long-lived token al (60 gün geçerli)
      const longLivedResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`)
      const longLivedData = await longLivedResponse.json()
      
      return NextResponse.json({
        success: true,
        accessToken: longLivedData.access_token,
        expiresIn: longLivedData.expires_in,
        message: 'Instagram access token başarıyla alındı!'
      })
    }

    return NextResponse.json({
      success: false,
      error: tokenData.error_message || 'Access token alınamadı'
    }, { status: 400 })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Instagram authentication hatası',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
