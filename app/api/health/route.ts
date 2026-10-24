import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Railway health check (düz http; middleware HTTPS yönlendirmesinden muaf) */
export async function GET() {
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
