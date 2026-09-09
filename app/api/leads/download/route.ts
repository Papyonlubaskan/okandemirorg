import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/api-security'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`lead-dl:${ip}`, 30, 15 * 60 * 1000)) {
    return rateLimitResponse()
  }

  const token = request.nextUrl.searchParams.get('token')?.trim()
  if (!token || token.length < 20) {
    return NextResponse.json({ error: 'Geçersiz bağlantı' }, { status: 400 })
  }

  try {
    const connection = await pool.getConnection()
    let ok = false
    try {
      const [rows] = await connection.execute(
        `SELECT id FROM funnel_leads WHERE access_token = ? LIMIT 1`,
        [token]
      )
      ok = Array.isArray(rows) && (rows as unknown[]).length > 0
    } finally {
      connection.release()
    }

    if (!ok) {
      return NextResponse.json({ error: 'Link geçersiz veya süresi dolmuş' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'content', 'digital-products', '7-seo-hatasi.md')
    const content = await readFile(filePath, 'utf8')
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="7-seo-hatasi.md"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error(error)
    return NextResponse.json({ error: 'İndirme başarısız' }, { status: 500 })
  }
}
