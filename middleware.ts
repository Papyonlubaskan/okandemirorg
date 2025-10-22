import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Eski cihazlar için SSL/TLS uyumluluğu
  const userAgent = request.headers.get('user-agent') || ''
  const isOldDevice = /Android [1-4]\.|iPhone OS [1-9]_|iPad.*OS [1-9]_/.test(userAgent)
  
  if (isOldDevice) {
    // Eski cihazlar için özel güvenlik ayarları
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // SSL downgrade saldırılarına karşı koruma
    response.headers.set('Strict-Transport-Security', 'max-age=31536000')
  }
  
  // HTTPS yönlendirmesi (Railway otomatik yapar ama yine de ekleyelim)
  const url = request.nextUrl.clone()
  if (url.protocol === 'http:' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }
  
  // Güvenlik başlıkları
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Cache control
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
  } else if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
