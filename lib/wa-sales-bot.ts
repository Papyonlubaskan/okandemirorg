import { randomBytes } from 'crypto'
import pool from '@/lib/mysql'
import {
  DIGITAL_PRODUCTS,
  formatTry,
  getProductBySlug,
  type DigitalProduct,
} from '@/lib/digital-products'
import { getOwnerPhone, isOwnerPhone, sendWhatsAppText } from '@/lib/whatsapp-client'

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

export function buildMenuText(): string {
  const lines = [
    'Okan Demir — otomatik satış menüsü',
    '',
    'Numara yazın veya ürün adını yazın:',
    '',
  ]
  DIGITAL_PRODUCTS.forEach((p, i) => {
    lines.push(`${i + 1}) ${p.name} — ${formatTry(p.priceTry)}`)
  })
  lines.push(
    '',
    'Örnek: 1  veya  kit',
    'Sipariş durumu: DURUM OD-XXXX',
    '',
    'Ödeme bilgisi sitede yok; sipariş sonrası özel iletilir.',
    'Havale sonrası dekontu bu sohbete gönderin.'
  )
  return lines.join('\n')
}

function matchProduct(text: string): DigitalProduct | undefined {
  const t = text.toLowerCase().trim()
  const byIndex = Number.parseInt(t, 10)
  if (byIndex >= 1 && byIndex <= DIGITAL_PRODUCTS.length) {
    return DIGITAL_PRODUCTS[byIndex - 1]
  }
  if (t.includes('kit') || t.includes('başlangıç') || t.includes('baslangic')) {
    return getProductBySlug('kobi-dijital-baslangic-kiti')
  }
  if (t.includes('ai denetim') || t.includes('ai-seo') || t === 'ai') {
    return getProductBySlug('ai-seo-denetim')
  }
  if (t.includes('landing') || t.includes('sayfa üret') || t.includes('sayfa uret')) {
    return getProductBySlug('ai-landing-sayfa')
  }
  if (t.includes('denetim') && !t.includes('ai')) {
    return getProductBySlug('dijital-isletme-denetimi')
  }
  if (t.includes('bakım standart') || t.includes('bakim standart') || t.includes('standart')) {
    return getProductBySlug('dijital-bakim-standart')
  }
  if (t.includes('bakım') || t.includes('bakim') || t.includes('light')) {
    return getProductBySlug('dijital-bakim-light')
  }
  return DIGITAL_PRODUCTS.find((p) => t.includes(p.slug) || t.includes(p.name.toLowerCase()))
}

export async function createWaOrder(params: {
  phone: string
  productSlug: string
  customerName?: string
}): Promise<{ orderCode: string; product: DigitalProduct; amountLabel: string } | { error: string }> {
  const product = getProductBySlug(params.productSlug)
  if (!product) return { error: 'Ürün bulunamadı' }

  await ensureOrdersTable()
  const orderCode = generateOrderCode()
  const accessToken = generateAccessToken()
  const phone = params.phone.replace(/\D/g, '')
  const email = `${phone}@whatsapp.local`
  const name = params.customerName?.trim() || `WA ${phone.slice(-4)}`

  const connection = await pool.getConnection()
  try {
    await connection.execute(
      `INSERT INTO digital_orders
        (order_code, access_token, product_slug, product_name, amount_try, customer_name, customer_email, customer_phone, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')`,
      [
        orderCode,
        accessToken,
        product.slug,
        product.name,
        product.priceTry,
        name,
        email,
        phone,
        'source:whatsapp_bot',
      ]
    )
  } finally {
    connection.release()
  }

  return { orderCode, product, amountLabel: formatTry(product.priceTry) }
}

async function fulfillOrderInternal(orderCode: string): Promise<{
  ok: boolean
  message: string
  downloadUrl?: string | null
  customerPhone?: string | null
  productName?: string
}> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okandemir.org'
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute(
      `SELECT order_code, access_token, product_slug, product_name, amount_try,
              customer_name, customer_email, customer_phone, status
       FROM digital_orders WHERE order_code = ? LIMIT 1`,
      [orderCode]
    )
    const list = rows as Array<{
      order_code: string
      access_token: string
      product_slug: string
      product_name: string
      amount_try: number
      customer_name: string
      customer_email: string
      customer_phone: string | null
      status: string
    }>
    const order = list[0]
    if (!order) return { ok: false, message: 'Sipariş bulunamadı' }

    if (order.status !== 'paid') {
      await connection.execute(
        `UPDATE digital_orders SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE order_code = ?`,
        [orderCode]
      )
    }

    const product = getProductBySlug(order.product_slug)
    const downloadUrl =
      product?.kind === 'digital_download' && product.contentFile
        ? `${siteUrl}/api/orders/download?token=${order.access_token}`
        : null

    let portalUrl: string | null = null
    if (order.product_slug === 'ai-seo-denetim') {
      portalUrl = `${siteUrl}/hizmetler/ai-denetim/panel?token=${order.access_token}`
    } else if (order.product_slug === 'ai-landing-sayfa') {
      portalUrl = `${siteUrl}/hizmetler/ai-landing/panel?token=${order.access_token}`
    }

    if (order.customer_phone) {
      let body = `Ödemeniz onaylandı ✅\n\n${order.product_name}\nKod: ${order.order_code}\n`
      if (downloadUrl) body += `\nİndirme linki:\n${downloadUrl}\n`
      if (portalUrl) body += `\nPanel (işlem burada):\n${portalUrl}\n`
      if (!downloadUrl && !portalUrl) {
        body += `\nSüreç başlıyor. Kısa sürede bilgilendirileceksiniz.`
      }
      await sendWhatsAppText(order.customer_phone, body)
    }

    return {
      ok: true,
      message: 'Teslim edildi',
      downloadUrl: downloadUrl || portalUrl,
      customerPhone: order.customer_phone,
      productName: order.product_name,
    }
  } finally {
    connection.release()
  }
}

/** WhatsApp satış botu — gelen metni işle */
export async function handleWaSalesBot(from: string, rawText: string): Promise<void> {
  const text = (rawText || '').trim()
  const lower = text.toLowerCase()
  const phone = from.replace(/\D/g, '')

  // Owner: ONAY OD-XXXX
  const onayMatch = text.match(/^onay\s+(od-[a-z0-9]+)$/i)
  if (onayMatch) {
    if (!isOwnerPhone(phone)) {
      await sendWhatsAppText(phone, 'Bu komut yalnızca hesap sahibi içindir.')
      return
    }
    const code = onayMatch[1].toUpperCase()
    const result = await fulfillOrderInternal(code)
    await sendWhatsAppText(
      phone,
      result.ok
        ? `Onaylandı: ${code}\n${result.productName || ''}\nMüşteriye WhatsApp ile teslimat gönderildi.`
        : `Onay başarısız: ${result.message}`
    )
    return
  }

  if (
    lower === 'menü' ||
    lower === 'menu' ||
    lower === 'merhaba' ||
    lower === 'selam' ||
    lower === 'help' ||
    lower === 'yardım' ||
    lower === 'yardim'
  ) {
    await sendWhatsAppText(phone, buildMenuText())
    return
  }

  const durumMatch = text.match(/^(durum|status)\s+(od-[a-z0-9]+)$/i)
  if (durumMatch) {
    const code = durumMatch[2].toUpperCase()
    await ensureOrdersTable()
    const connection = await pool.getConnection()
    try {
      const [rows] = await connection.execute(
        `SELECT order_code, product_name, amount_try, status FROM digital_orders WHERE order_code = ? LIMIT 1`,
        [code]
      )
      const row = (rows as Array<{ order_code: string; product_name: string; amount_try: number; status: string }>)[0]
      if (!row) {
        await sendWhatsAppText(phone, 'Sipariş bulunamadı.')
        return
      }
      await sendWhatsAppText(
        phone,
        `${row.order_code}\n${row.product_name}\n${formatTry(Number(row.amount_try))}\nDurum: ${row.status}`
      )
    } finally {
      connection.release()
    }
    return
  }

  if (lower.includes('havale') || lower.includes('dekont') || lower.includes('ödeme yapt')) {
    await sendWhatsAppText(
      phone,
      'Dekontunuz alındı olarak işaretlendi. Onay sonrası ürün/panel linki otomatik gelecek.\nSipariş kodunuzu da yazın: örn. OD-XXXX'
    )
    await sendWhatsAppText(
      getOwnerPhone(),
      `🔔 Dekont/ödeme sinyali\nMüşteri WA: ${phone}\nMesaj: ${text.slice(0, 300)}\nOnay için: ONAY OD-XXXX`
    )
    return
  }

  const product = matchProduct(lower)
  if (product) {
    const created = await createWaOrder({ phone, productSlug: product.slug })
    if ('error' in created) {
      await sendWhatsAppText(phone, created.error)
      return
    }
    const customerMsg = [
      `Sipariş oluşturuldu ✅`,
      ``,
      `${created.product.name}`,
      `Tutar: ${created.amountLabel}`,
      `Kod: ${created.orderCode}`,
      ``,
      `Ödeme bilgisi bu sohbette özel iletilecek (sitede yok).`,
      `Havale açıklamasına kodu yazın ve dekontu buraya gönderin.`,
      ``,
      `Durum: DURUM ${created.orderCode}`,
    ].join('\n')
    await sendWhatsAppText(phone, customerMsg)

    await sendWhatsAppText(
      getOwnerPhone(),
      `🛒 Yeni WA sipariş\n${created.product.name}\n${created.amountLabel}\nKod: ${created.orderCode}\nMüşteri: ${phone}\n\nÖdeme gelince yazın:\nONAY ${created.orderCode}`
    )
    // Müşteriye hemen "ödeme için bekleyin" — owner ayrı mesajda IBAN iletecek
    await sendWhatsAppText(
      phone,
      'Bir sonraki mesajda ödeme bilgisi iletilecek. Lütfen bekleyin veya “menü” yazın.'
    )
    return
  }

  await sendWhatsAppText(
    phone,
    'Anlayamadım. “menü” yazarak ürün listesini açın.\nÖrnek: 1  veya  kit'
  )
}

export { fulfillOrderInternal }
