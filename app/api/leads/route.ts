import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  rateLimitResponse,
} from '@/lib/api-security'
import { createMailTransporter, MAIL_ADMIN, MAIL_FROM } from '@/lib/mailer'
import { FUNNEL } from '@/lib/digital-products'

async function ensureLeadsTable() {
  const connection = await pool.getConnection()
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS funnel_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        source VARCHAR(120) DEFAULT 'ucretsiz-seo-rehberi',
        access_token VARCHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  } finally {
    connection.release()
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`leads:${ip}`, 8, 15 * 60 * 1000)) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const source = String(body.source || 'ucretsiz-seo-rehberi').trim().slice(0, 120)

    if (name.length < 2 || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Ad ve e-posta zorunlu.' }, { status: 400 })
    }

    await ensureLeadsTable()
    const token = randomBytes(24).toString('hex')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
    const downloadUrl = `${siteUrl}/api/leads/download?token=${token}`
    const kitUrl = `${siteUrl}${FUNNEL.kitHref}`

    const connection = await pool.getConnection()
    try {
      await connection.execute(
        `INSERT INTO funnel_leads (email, name, source, access_token) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token), source = VALUES(source)`,
        [email, name, source, token]
      )
    } catch {
      // email unique yoksa düz insert dene
      await connection.execute(
        `INSERT INTO funnel_leads (email, name, source, access_token) VALUES (?, ?, ?, ?)`,
        [email, name, source, token]
      )
    } finally {
      connection.release()
    }

    // newsletter_subscribers'a da yaz (varsa)
    try {
      const c2 = await pool.getConnection()
      try {
        await c2.execute(
          `INSERT INTO newsletter_subscribers (email, name, status) VALUES (?, ?, 'active')
           ON DUPLICATE KEY UPDATE name = VALUES(name), status = 'active'`,
          [email, name]
        )
      } finally {
        c2.release()
      }
    } catch {
      // tablo yoksa sorun değil
    }

    const transporter = createMailTransporter()
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: 'Ücretsiz SEO rehberiniz hazır — Okan Demir',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>Merhaba ${escapeHtml(name)}</h2>
          <p>“KOBİ’lerin Yaptığı 7 SEO Hatası” rehberiniz hazır.</p>
          <p><a href="${downloadUrl}">Rehberi indir</a></p>
          <p>Sonraki adım: hazır kontrol listeleri için
            <a href="${kitUrl}">KOBİ Dijital Başlangıç Kiti</a>
          </p>
        </div>
      `,
    })

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_ADMIN,
      subject: `Yeni lead: ${email}`,
      html: `<p>${escapeHtml(name)} — ${escapeHtml(email)} — ${escapeHtml(source)}</p>`,
    })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error(error)
    return NextResponse.json({ success: false, error: 'Kayıt başarısız' }, { status: 500 })
  }
}
