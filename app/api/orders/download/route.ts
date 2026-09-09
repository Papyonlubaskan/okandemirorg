import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import { getProductBySlug } from '@/lib/digital-products'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/api-security'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`order-download:${ip}`, 20, 15 * 60 * 1000)) {
    return rateLimitResponse()
  }

  const token = request.nextUrl.searchParams.get('token')?.trim()
  if (!token || token.length < 20) {
    return NextResponse.json({ error: 'Geçersiz bağlantı' }, { status: 400 })
  }

  try {
    const connection = await pool.getConnection()
    let row: {
      status: string
      product_slug: string
      product_name: string
      order_code: string
    }

    try {
      const [rows] = await connection.execute(
        `SELECT status, product_slug, product_name, order_code
         FROM digital_orders WHERE access_token = ? LIMIT 1`,
        [token]
      )
      const list = rows as typeof row[]
      if (!list[0]) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }
      row = list[0]
    } finally {
      connection.release()
    }

    if (row.status !== 'paid') {
      return NextResponse.json(
        {
          error: 'Ödeme henüz onaylanmadı. Havale sonrası onay bekleniyor.',
          orderCode: row.order_code,
        },
        { status: 402 }
      )
    }

    const product = getProductBySlug(row.product_slug)
    if (!product) {
      return NextResponse.json({ error: 'Ürün dosyası yok' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'content', 'digital-products', product.contentFile)
    const content = await readFile(filePath, 'utf8')
    const filename = `${product.slug}.md`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Download error:', error)
    }
    return NextResponse.json({ error: 'İndirme başarısız' }, { status: 500 })
  }
}
