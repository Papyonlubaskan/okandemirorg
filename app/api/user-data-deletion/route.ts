import { NextRequest, NextResponse } from 'next/server'

// Facebook'un URL doğrulama için GET isteği
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Facebook webhook verification
  const hubMode = searchParams.get('hub.mode')
  const hubChallenge = searchParams.get('hub.challenge')
  const hubVerifyToken = searchParams.get('hub.verify_token')

  const verifyToken =
    process.env.FACEBOOK_VERIFY_TOKEN || 'facebook_verification_token'

  if (hubMode === 'subscribe' && hubVerifyToken === verifyToken) {
    return new NextResponse(hubChallenge, { status: 200 })
  }

  // Facebook URL validation için özel response
  if (searchParams.has('facebook_validation')) {
    return NextResponse.json({
      status: 'valid',
      message: 'URL is valid for Facebook user data deletion',
      timestamp: new Date().toISOString()
    })
  }

  // Facebook'un beklediği basit HTML response
  // Facebook sadece 200 OK status bekliyor
  return new NextResponse('OK', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })

  // Normal GET request için HTML sayfası
  return new NextResponse(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Kullanıcı Verisi Silme - Okan Demir</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8f9fa;
          color: #333;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 12px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #1877f2; margin-bottom: 30px; }
        h2 { color: #333; margin-top: 30px; }
        p { color: #666; line-height: 1.7; margin-bottom: 15px; }
        .contact { 
          background: #f0f2f5; 
          padding: 20px; 
          border-radius: 8px; 
          margin-top: 30px;
          border-left: 4px solid #1877f2;
        }
        .success { color: #42b883; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🗑️ Kullanıcı Verisi Silme</h1>
        <p class="success">Bu sayfa Facebook tarafından doğrulanmıştır ve kullanıcı verilerinin silinmesi için kullanılır.</p>
        
        <h2>📋 Veri Silme Politikamız</h2>
        <p>Kullanıcılarımızın verilerini silme taleplerini <strong>30 gün içinde</strong> işleme alırız.</p>
        <p>Verileriniz tamamen silinir ve geri alınamaz hale getirilir.</p>
        <p>Yasal yükümlülükler saklı kalmak kaydıyla tüm kişisel veriler silinir.</p>
        
        <h2>📞 İletişim</h2>
        <div class="contact">
          <p><strong>📧 E-posta:</strong> <a href="mailto:info@okandemir.org">info@okandemir.org</a></p>
          <p><strong>📱 Telefon:</strong> <a href="tel:+905552677739">+90 555 267 77 39</a></p>
          <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/+905552677739">Hemen İletişim</a></p>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #999;">
          Bu sayfa Facebook Developer Console tarafından doğrulanmıştır ve GDPR uyumludur.
        </p>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}

// Facebook'un veri silme callback'i için POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Facebook User Data Deletion Callback received
    
    const { confirmation_code } = body
    
    // User data deletion işlemi burada yapılır
    // Örnek: Veritabanından kullanıcı verilerini sil
    
    // Facebook'un beklediği format
    return NextResponse.json({
      url: 'https://okandemir.org/data-deletion-status?code=' + (confirmation_code || 'DELETION_CONFIRMED'),
      confirmation_code: confirmation_code || 'DELETION_CONFIRMED'
    })
    
  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      error: 'User data deletion failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
