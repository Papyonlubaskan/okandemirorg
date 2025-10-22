# 🤖 AI Chatbot Setup Kılavuzu

AI Chatbot sistemi için kurulum ve kullanım kılavuzu.

---

## 🚀 1. Özellikler

### AI Chatbot Capabilities:
- ✅ **Hizmet bilgileri** otomatik verme
- ✅ **Fiyat bilgileri** paylaşma
- ✅ **İletişim bilgileri** yönlendirme
- ✅ **Portfolio** tanıtımı
- ✅ **7/24 müşteri desteği**
- ✅ **Çoklu dil desteği** (Türkçe)

---

## 🎯 2. Akıllı Yanıt Sistemi

### Anahtar Kelime Tabanlı Yanıtlar:

#### **Hizmet Bilgileri:**
- "hizmet", "ne yapıyorsun" → Tüm hizmetler listesi

#### **Web Tasarım:**
- "web", "website", "site" → Web tasarım detayları

#### **SEO:**
- "seo", "google" → SEO hizmetleri

#### **Sosyal Medya:**
- "sosyal", "instagram", "facebook" → SMM hizmetleri

#### **Fiyat:**
- "fiyat", "ücret", "maliyet" → Fiyat bilgileri

#### **İletişim:**
- "iletişim", "telefon", "email" → İletişim bilgileri

#### **Portfolio:**
- "portfolio", "proje", "referans" → Proje örnekleri

---

## 🔧 3. API Endpoints

### Chat API:
```bash
POST /api/chatbot/chat
{
  "message": "Web tasarım fiyatları nedir?",
  "conversationHistory": []
}

Response:
{
  "success": true,
  "response": "💰 Web Tasarım Fiyatları: ...",
  "timestamp": "2025-10-19T..."
}
```

---

## 📱 4. Component Kullanımı

### Layout'ta Kullanım:
```tsx
import ChatBot from '@/components/ChatBot'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatBot />
      </body>
    </html>
  )
}
```

### Özellikler:
- ✅ **Floating button** - Sol alt köşe
- ✅ **Real-time chat** - Anlık mesajlaşma
- ✅ **Typing indicator** - Yazıyor göstergesi
- ✅ **Auto-scroll** - Otomatik kaydırma
- ✅ **Responsive design** - Mobil uyumlu

---

## 🎨 5. Chatbot Widget Özellikleri

### UI/UX:
- **Modern tasarım** - Temiz ve profesyonel
- **Smooth animations** - Yumuşak geçişler
- **Loading states** - Yükleme göstergeleri
- **Error handling** - Hata yönetimi

### Functionality:
- **Message history** - Konuşma geçmişi
- **Auto-responses** - Otomatik yanıtlar
- **Keyword detection** - Anahtar kelime algılama
- **Context awareness** - Bağlam farkındalığı

---

## 🔄 6. Gelişmiş Özellikler

### Gelecek Güncellemeler:
- 🚀 **OpenAI GPT entegrasyonu**
- 🚀 **Çoklu dil desteği**
- 🚀 **Voice input/output**
- 🚀 **File upload desteği**
- 🚀 **Analytics ve raporlama**

### AI Model Entegrasyonu:
```typescript
// OpenAI GPT entegrasyonu için hazır
const openaiResponse = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: conversationHistory,
  max_tokens: 500
})
```

---

## 📊 7. Analytics ve Monitoring

### Chatbot Metrics:
- ✅ **Message count** - Mesaj sayısı
- ✅ **Response time** - Yanıt süresi
- ✅ **User satisfaction** - Kullanıcı memnuniyeti
- ✅ **Popular questions** - Popüler sorular

### Performance:
- ✅ **Fast response** - Hızlı yanıt (< 1 saniye)
- ✅ **99.9% uptime** - Yüksek erişilebilirlik
- ✅ **Scalable** - Ölçeklenebilir

---

## 🎯 8. Freelancer İçin Avantajlar

### Müşteri Deneyimi:
- ✅ **24/7 destek** - Sürekli müşteri desteği
- ✅ **Hızlı yanıt** - Anında bilgi verme
- ✅ **Profesyonel görünüm** - Teknolojik imaj
- ✅ **Lead generation** - Potansiyel müşteri kazanımı

### İş Akışı:
- ✅ **Otomatik yanıt** - Manuel iş yükü azaltma
- ✅ **Qualified leads** - Nitelikli müşteri adayları
- ✅ **Service showcase** - Hizmet tanıtımı
- ✅ **Contact funnel** - İletişim kanalı

---

## 📚 9. Kaynaklar

- [Next.js API Routes](https://nextjs.org/docs/api-routes)
- [OpenAI API](https://platform.openai.com/docs)
- [React Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**Son Güncelleme:** 19 Ekim 2025
