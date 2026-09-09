import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  rateLimitResponse,
} from '@/lib/api-security'
import { getProductBySlug, formatTry } from '@/lib/digital-products'
import { getBankTransferInfo, buildTransferDescription } from '@/lib/bank-transfer'
import { createMailTransporter, MAIL_ADMIN, MAIL_FROM } from '@/lib/mailer'

function generateOrderCode(): string {
  const n = Date.now().toString(36).toUpperCase().slice(-4)
  const r = randomBytes(2).toString('hex').toUpperCase()
  return `OD-${n}${r}`
}

function generateAccessToken(): string {
  return randomBytes(24).toString('hex')
}

async function ensureOrdersTable() {
  const connection = await pool.getConnection()
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS digital_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(32) NOT NULL UNIQUE,
        access_token VARCHAR(64) NOT NULL UNIQUE,
        product_slug VARCHAR(120) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        amount_try DECIMAL(10,2) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        status ENUM('pending_payment', 'paid', 'cancelled') DEFAULT 'pending_payment',
        notes TEXT,
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_email (customer_email),
        INDEX idx_product (product_slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  } finally {
    connection.release()
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`orders:${ip}`, 6, 15 * 60 * 1000)) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const productSlug = String(body.productSlug || 'kobi-dijital-baslangic-kiti').trim()

    if (name.length < 2 || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Ad ve geçerli e-posta zorunlu.' },
        { status: 400 }
      )
    }

    const product = getProductBySlug(productSlug)
    if (!product) {
      return NextResponse.json({ success: false, error: 'Ürün bulunamadı.' }, { status: 404 })
    }

    await ensureOrdersTable()

    const orderCode = generateOrderCode()
    const accessToken = generateAccessToken()
    const bank = getBankTransferInfo()
    const transferNote = buildTransferDescription(orderCode)

    const connection = await pool.getConnection()
    try {
      await connection.execute(
        `INSERT INTO digital_orders
          (order_code, access_token, product_slug, product_name, amount_try, customer_name, customer_email, customer_phone, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')`,
        [
          orderCode,
          accessToken,
          product.slug,
          product.name,
          product.priceTry,
          name,
          email,
          phone || null,
        ]
      )
    } finally {
      connection.release()
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
    const thankYouUrl = `${siteUrl}/hizmetler/dijital-baslangic-kiti/tesekkur?code=${encodeURIComponent(orderCode)}`
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const amountLabel = formatTry(product.priceTry)

    const bankBlock = bank.configured
      ? `
        <p><strong>Alıcı:</strong> ${escapeHtml(bank.accountHolder)}</p>
        ${bank.bankName ? `<p><strong>Banka:</strong> ${escapeHtml(bank.bankName)}</p>` : ''}
        <p><strong>IBAN:</strong> ${escapeHtml(bank.iban)}</p>
        <p><strong>Açıklama (zorunlu):</strong> ${escapeHtml(transferNote)}</p>
        <p><strong>Tutar:</strong> ${amountLabel}</p>
      `
      : `
        <p>IBAN henüz sistemde tanımlı değil. Havale bilgisi için WhatsApp:
        <a href="https://wa.me/905552677739?text=${encodeURIComponent(`Merhaba, ${orderCode} siparişi için IBAN istiyorum.`)}">+90 555 267 77 39</a></p>
        <p><strong>Sipariş kodu:</strong> ${escapeHtml(orderCode)}</p>
        <p><strong>Tutar:</strong> ${amountLabel}</p>
      `

    const transporter = createMailTransporter()

    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: `Sipariş alındı — ${product.name} (${orderCode})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>Siparişiniz alındı</h2>
          <p>Merhaba ${safeName},</p>
          <p><strong>${escapeHtml(product.name)}</strong> için siparişiniz oluşturuldu.</p>
          <p><strong>Sipariş kodu:</strong> ${escapeHtml(orderCode)}</p>
          <h3>Havale / EFT bilgileri</h3>
          ${bankBlock}
          <p>Ödeme sonrası dekontu WhatsApp’tan gönderin; onaylanınca indirme linki e-posta ile gelir.</p>
          <p><a href="${thankYouUrl}">Sipariş özetini aç</a></p>
        </div>
      `,
    })

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_ADMIN,
      subject: `Yeni dijital sipariş: ${orderCode} — ${amountLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>Yeni havale siparişi</h2>
          <p><strong>Kod:</strong> ${escapeHtml(orderCode)}</p>
          <p><strong>Ürün:</strong> ${escapeHtml(product.name)}</p>
          <p><strong>Tutar:</strong> ${amountLabel}</p>
          <p><strong>Ad:</strong> ${safeName}</p>
          <p><strong>E-posta:</strong> ${safeEmail}</p>
          <p><strong>Telefon:</strong> ${safePhone || '-'}</p>
          <p>Ödeme gelince fulfill API ile onaylayın (INTERNAL_API_KEY).</p>
        </div>
      `,
    })

    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.INTERNAL_API_KEY
              ? { 'x-api-key': process.env.INTERNAL_API_KEY }
              : {}),
          },
          body: JSON.stringify({
            action: 'digital_order_created',
            data: {
              orderCode,
              productSlug: product.slug,
              amountTry: product.priceTry,
              name,
              email,
              phone,
            },
          }),
        })
      } catch {
        // n8n opsiyonel
      }
    }

    return NextResponse.json({
      success: true,
      orderCode,
      thankYouUrl,
      amountTry: product.priceTry,
      bank: {
        accountHolder: bank.accountHolder,
        bankName: bank.bankName,
        iban: bank.iban,
        configured: bank.configured,
        transferDescription: transferNote,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Order create error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
