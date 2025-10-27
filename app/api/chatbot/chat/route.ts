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
    return `Merhaba! Ben Okan Demir'in dijital asistanıyım. 

🚀 **Dijital Pazarlama Hizmetleri:**

📱 **Sosyal Medya Yönetimi**
- Instagram, Facebook, LinkedIn, TikTok
- İçerik planlama ve görsel tasarım
- Etkileşim artırma

🎯 **Hedef Odaklı Reklam Kampanyaları**
- Meta Ads (Facebook & Instagram)
- Google Ads yönetimi
- Hedef kitle analizi

📝 **İçerik & Görsel Tasarım**
- Markanıza özel özgün içerikler
- Reklam görselleri
- Yazılım dışı tasarım

📊 **Analiz & Raporlama**
- Veriye dayalı optimizasyon
- Aylık performans raporları
- ROI analizi

🌐 **SEO ve Web İçerik Optimizasyonu**
- Arama motoru optimizasyonu
- İçerik stratejisi

**Neden Okan Demir?**
✅ Strateji + Yaratıcılık + Analiz = Daha fazla müşteri
✅ Şeffaf iletişim, net sonuç
✅ Sektörünüze özel planlama
✅ Hızlı teslim ve kaliteli iş
✅ Mükemmel sürdürülebilirlik
✅ Tasarruflu ödeme planları

💡 **Esnek Çalışma Modeli:**
• Hem aylık hem uzun vadeli anlaşma seçenekleri
• İstediğiniz sürede başlayıp bırakabilirsiniz
• İhtiyacınıza göre özel paketler

Hangi konuda detaylı bilgi almak istersiniz? 💬`
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
    return `💰 **Dijital Pazarlama Paketleri:**

💼 **AYLIK ANLAŞMA SEÇENEĞİ:**
• Paket sınırlaması olmadan çalışabiliriz
• İstediğiniz zaman başlayın, bırakın
• Esnek fiyatlandırma
• Tüm hizmetleri alın, ihtiyacınıza göre özelleştirin

📋 **UZUN VADELİ PAKETLER:**

🚀 **Temel Paket** - 10.000₺/ay
• 1 Yıllık anlaşma
• 1 ay ücretsiz
• Yıllık ödemede %15 indirim
• Toplam: 93.500₺/yıl
• Tüm hizmetleri kapsar

📈 **Standart Paket** - 12.500₺/ay  
• 2 Yıllık anlaşma
• 1. yıl Temel Paket fiyatında + 1 ay bedava
• 2. yıl ilk ay %50 indirimli
• 2 Yıllık ödemede %20 indirim
• Toplam: 203.000₺/2 yıl

⭐ **Pro Paket** - 15.000₺/ay+
• 3 Yıllık anlaşma
• 1. yıl Temel Paket fiyatında + 1 ay bedava
• 2. yıl Standart Paket fiyatında + ilk ay %50 indirimli  
• 3. yıl bir ay %75 indirimli
• 3 Yıllık ödemede %25 indirim
• Toplam: 316.000₺/3 yıl

⚠️ **ÖNEMLİ:** Reklam ücretleri paketlere dahil değildir. Reklam bütçesi müşterinin aylık cirosuna göre belirlenir.

**Hizmetler:**
✅ Meta (Facebook & Instagram) Ads
✅ Google Ads  
✅ Hedef kitle analizi
✅ Reklam tipi önerileri
✅ Görsel & metin oluşturma
✅ Aylık hesap yönetimi
✅ Aksiyon planı
✅ Analiz & raporlama
✅ 10 revizyon hakkı

Detaylı bilgi için iletişime geçin! 📞`
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
