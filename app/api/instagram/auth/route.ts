import { NextRequest, NextResponse } from 'next/server'
import { createMailTransporter, MAIL_ADMIN, MAIL_FROM } from '@/lib/mailer'
import { maskSecret } from '@/lib/security/secrets'

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

      // Token yanıtta açık dönmez; yalnızca yönetici e-postasına gider
      if (longLivedData.access_token) {
        await createMailTransporter().sendMail({
          from: MAIL_FROM,
          to: MAIL_ADMIN,
          subject: 'Instagram access token (INSTAGRAM_ACCESS_TOKEN)',
          text: `Railway'de INSTAGRAM_ACCESS_TOKEN olarak kaydedin:\n\n${longLivedData.access_token}\n\nGeçerlilik (sn): ${longLivedData.expires_in}`,
        })
      }

      return NextResponse.json({
        success: Boolean(longLivedData.access_token),
        accessToken: maskSecret(longLivedData.access_token),
        expiresIn: longLivedData.expires_in,
        message: 'Token yönetici e-postasına gönderildi.'
      })
    }

    return NextResponse.json({
      success: false,
      error: tokenData.error_message || 'Access token alınamadı'
    }, { status: 400 })

  } catch {
    return NextResponse.json({
      success: false,
      error: 'Instagram authentication hatası'
    }, { status: 500 })
  }
}
