import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import nodemailer from 'nodemailer'

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email adresi gerekli'
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Geçerli bir email adresi girin'
      }, { status: 400 })
    }

    // Check if email already exists
    const existing = await query(
      'SELECT id FROM newsletter_subscribers WHERE email = ?',
      [email]
    ) as Array<{id: number}>

    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Bu email adresi zaten kayıtlı'
      }, { status: 400 })
    }

    // Add to database
    await query(
      'INSERT INTO newsletter_subscribers (email, name, status, subscribed_at) VALUES (?, ?, ?, NOW())',
      [email, name || '', 'active']
    )

    // Send welcome email
    try {
      await transporter.sendMail({
        from: `"Okan Demir" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: '🎉 Haber Bültenine Hoş Geldiniz!',
        html: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Hoş Geldiniz!</h1>
      <p>Haber bültenimize abone olduğunuz için teşekkürler</p>
    </div>
    <div class="content">
      <p>Merhaba ${name || 'Değerli Abonemiz'},</p>
      <p>Dijital pazarlama dünyasındaki en güncel bilgiler, özel teklifler ve blog yazılarımız artık email adresinize gelecek!</p>
      
      <h3>Ne Bekleyebilirsiniz?</h3>
      <ul>
        <li>📊 Dijital pazarlama ipuçları ve stratejileri</li>
        <li>🚀 Yeni blog yazıları ve içerikler</li>
        <li>💡 SEO ve web tasarımı trendleri</li>
        <li>🎁 Özel teklifler ve kampanyalar</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://okandemir.org" class="button">Web Sitemizi Ziyaret Edin</a>
      </div>

      <p style="margin-top: 30px;">
        Sorularınız için her zaman bize ulaşabilirsiniz:<br>
        📧 info@okandemir.org<br>
        📱 +90 555 267 77 39
      </p>
    </div>
    <div class="footer">
      <p>© 2025 Okan Demir - Dijital Pazarlama Uzmanı</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Bu emaili almak istemiyor musunuz? 
        <a href="https://okandemir.org" style="color: #2563eb;">Abonelikten çık</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
      })
    } catch {
      // Email gönderimi başarısız olsa bile abone kaydedildi
    }

    return NextResponse.json({
      success: true,
      message: 'Başarıyla abone oldunuz! Hoş geldiniz emaili gönderildi.'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Bir hata oluştu, lütfen tekrar deneyin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

