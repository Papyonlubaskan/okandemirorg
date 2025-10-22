import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Mesaj gerekli'
      }, { status: 400 })
    }

    // AI Chatbot response generation
    const response = await generateChatbotResponse(message, conversationHistory)

    return NextResponse.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Chatbot yanıtı oluşturulamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generateChatbotResponse(message: string, _history: ChatMessage[]): Promise<string> {
  const lowerMessage = message.toLowerCase()
  
  // Hizmet bilgileri
  if (lowerMessage.includes('hizmet') || lowerMessage.includes('ne yapıyorsun')) {
    return `Merhaba! Ben Okan Demir'in dijital asistanıyım. Size şu hizmetler konusunda yardımcı olabilirim:

🎨 **Web Tasarım & Geliştirme**
- Responsive web siteleri
- WordPress geliştirme
- E-ticaret çözümleri

📈 **Dijital Pazarlama**
- SEO optimizasyonu
- Google Ads yönetimi
- Sosyal medya pazarlama

📱 **Sosyal Medya Yönetimi**
- Instagram, Facebook yönetimi
- İçerik stratejisi
- Reklam kampanyaları

Hangi konuda detaylı bilgi almak istersiniz?`
  }

  // Web tasarım
  if (lowerMessage.includes('web') || lowerMessage.includes('website') || lowerMessage.includes('site')) {
    return `🌐 **Web Tasarım Hizmetlerim:**

✅ Responsive web tasarım
✅ WordPress geliştirme
✅ E-ticaret çözümleri
✅ SEO uyumlu kodlama
✅ Hızlı yükleme süreleri
✅ Mobil uyumlu tasarım

**Süreç:**
1. Analiz ve planlama
2. Damla tasarım
3. Geliştirme
4. Test ve optimizasyon
5. Canlıya alma

**Fiyat:** Proje kapsamına göre değişir
**Süre:** 2-4 hafta

Detaylı bilgi için: info@okandemir.org`
  }

  // SEO
  if (lowerMessage.includes('seo') || lowerMessage.includes('google')) {
    return `🔍 **SEO Hizmetlerim:**

✅ Anahtar kelime araştırması
✅ Teknik SEO optimizasyonu
✅ İçerik optimizasyonu
✅ Backlink stratejisi
✅ Google Analytics kurulumu
✅ Search Console yönetimi

**Hedefler:**
- Google'da üst sıralarda yer alma
- Organik trafik artışı
- Marka bilinirliği

**Süre:** 3-6 ay (ilk sonuçlar için)

Detaylı analiz için iletişime geçin!`
  }

  // Sosyal medya
  if (lowerMessage.includes('sosyal') || lowerMessage.includes('instagram') || lowerMessage.includes('facebook')) {
    return `📱 **Sosyal Medya Hizmetlerim:**

✅ Instagram hesap yönetimi
✅ Facebook sayfa yönetimi
✅ İçerik planlama
✅ Reklam kampanyaları
✅ Influencer işbirlikleri
✅ Analitik raporlama

**Platformlar:**
- Instagram
- Facebook
- LinkedIn
- TikTok

**Aylık Paketler:**
- 15 gönderi/ay
- Story yönetimi
- Etkileşim artırma

Detaylı paket bilgisi için iletişime geçin!`
  }

  // Fiyat
  if (lowerMessage.includes('fiyat') || lowerMessage.includes('ücret') || lowerMessage.includes('maliyet')) {
    return `💰 **Fiyat Bilgileri:**

**Web Tasarım:** 2.500₺ - 15.000₺
**SEO Paketleri:** 1.500₺ - 5.000₺/ay
**Sosyal Medya:** 1.000₺ - 3.000₺/ay
**Google Ads:** 500₺ - 2.000₺/ay + reklam bütçesi

**Özel Projeler:** Teklif üzerine

**Ödeme Seçenekleri:**
- Peşin ödeme (10% indirim)
- 3 taksit
- Aylık ödeme (SEO/SMM)

Detaylı teklif için projenizi anlatın!`
  }

  // İletişim
  if (lowerMessage.includes('iletişim') || lowerMessage.includes('telefon') || lowerMessage.includes('email')) {
    return `📞 **İletişim Bilgileri:**

📧 **Email:** info@okandemir.org
📱 **Telefon:** +90 555 267 77 39
💬 **WhatsApp:** +90 555 267 77 39
🌐 **Website:** https://okandemir.org
📍 **Lokasyon:** İzmir, Türkiye

**Çalışma Saatleri:**
Pazartesi - Cuma: 09:00 - 18:00
Cumartesi: 10:00 - 16:00

**Hızlı İletişim:**
- WhatsApp'tan anında mesaj
- Email'den 24 saat içinde yanıt
- Telefon görüşmesi için randevu`
  }

  // Portfolio/Projeler
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('proje') || lowerMessage.includes('referans')) {
    return `🎨 **Portfolio & Projeler:**

**Web Tasarım Projeleri:**
- E-ticaret siteleri
- Kurumsal web siteler
- Restoran web siteleri
- Blog platformları

**Başarılı SEO Projeleri:**
- Google'da 1. sayfa başarıları
- %300+ trafik artışları
- Yerel SEO optimizasyonları

**Sosyal Medya Başarıları:**
- 10K+ takipçi artışları
- Viral içerik kampanyaları
- Marka bilinirliği artışları

Detaylı portfolio için: https://okandemir.org/referanslar`
  }

  // Genel yanıt
  if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hello')) {
    return `Merhaba! 👋 

Ben Okan Demir'in dijital asistanıyım. Size dijital pazarlama, web tasarım ve sosyal medya konularında yardımcı olabilirim.

**Size nasıl yardımcı olabilirim?**
- Web tasarım hizmetleri
- SEO optimizasyonu
- Sosyal medya yönetimi
- Google Ads kampanyaları
- Fiyat bilgileri

Hangi konuda bilgi almak istersiniz?`
  }

  // Varsayılan yanıt
  return `Teşekkürler mesajınız için! 

Size daha iyi yardımcı olabilmem için şu konulardan birini seçebilirsiniz:

🎨 **Web Tasarım**
🔍 **SEO Hizmetleri** 
📱 **Sosyal Medya**
💰 **Fiyat Bilgileri**
📞 **İletişim**
🎯 **Portfolio**

Veya doğrudan WhatsApp'tan iletişime geçebilirsiniz: +90 555 267 77 39`
}
