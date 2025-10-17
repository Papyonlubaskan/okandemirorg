import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email konfigürasyonu - cPanel ayarlarına göre
const transporter = nodemailer.createTransport({
  host: 'okandemir.org',
  port: 465,
  secure: true, // SSL/TLS kullan
  auth: {
    user: 'info@okandemir.org',
    pass: process.env.EMAIL_PASSWORD, // .env dosyasından alınacak
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Email gönder
    const info = await transporter.sendMail({
      from: 'info@okandemir.org',
      to: 'info@okandemir.org',
      replyTo: email,
      subject: `İletişim Formu: ${subject}`,
      html: `
        <h3>Yeni İletişim Mesajı</h3>
        <p><strong>Ad:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Email gönderilemedi' },
      { status: 500 }
    )
  }
}
