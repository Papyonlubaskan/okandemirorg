import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import pool from '@/lib/mysql'

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
    const { name, email, phone, subject, message, company } = await request.json()

    // MySQL'e kaydet
    const connection = await pool.getConnection()
    await connection.execute(
      'INSERT INTO contact_submissions (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, subject || null, message]
    )
    connection.release()

    // Send email notification to admin
    const emailInfo = await transporter.sendMail({
      from: 'info@okandemir.org',
      to: 'info@okandemir.org',
      replyTo: email,
      subject: `İletişim Formu: ${subject || 'Yeni Mesaj'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
            Yeni İletişim Mesajı
          </h2>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">👤 Müşteri Bilgileri</h3>
            <p><strong>Ad:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
            ${company ? `<p><strong>Şirket:</strong> ${company}</p>` : ''}
            <p><strong>Konu:</strong> ${subject || 'Belirtilmedi'}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">💬 Mesaj İçeriği</h3>
            <p style="line-height: 1.6; color: #374151;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: emailInfo.messageId
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Email gönderme hatası:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Email gönderilemedi' },
      { status: 500 }
    )
  }
}