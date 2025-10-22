# 📱 WhatsApp Business API Setup Kılavuzu

WhatsApp Business API entegrasyonu için adım adım kurulum.

---

## 🔧 1. Meta Business Developer Console Setup

### Adım 1: WhatsApp Business Account Oluşturma
1. [Meta Business](https://business.facebook.com) > Create Account
2. **Account Type:** Business
3. **Business Name:** "Okan Demir Dijital Pazarlama"
4. **Contact Email:** info@okandemir.org

### Adım 2: WhatsApp Business API Ekleme
1. Meta Business Manager > **WhatsApp Business API**
2. **Get Started** > **Create App**
3. **App Type:** Business
4. **App Name:** "Okan Demir WhatsApp"

---

## 🔑 2. WhatsApp API Credentials

### Environment Variables (.env.local):
```env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
WHATSAPP_WEBHOOK_URL=https://okandemir.org/api/whatsapp/webhook
```

### Railway Environment Variables:
```env
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

---

## 🚀 3. Webhook Configuration

### Webhook URL:
```
https://okandemir.org/api/whatsapp/webhook
```

### Verify Token:
```
okandemir_whatsapp_2024
```

### Webhook Fields:
- ✅ **messages**
- ✅ **message_statuses**

---

## 📋 4. Test Etme

### API Endpoints:
```bash
# Webhook verification
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=CHALLENGE&hub.verify_token=VERIFY_TOKEN

# Send message
POST /api/whatsapp/send
{
  "to": "+905552677739",
  "message": "Test mesajı"
}

# Webhook receiver
POST /api/whatsapp/webhook
```

### Component Kullanımı:
```tsx
import WhatsAppWidget from '@/components/WhatsAppWidget'

// Layout'ta kullanın
<WhatsAppWidget />
```

---

## ⚠️ 5. Önemli Notlar

### Rate Limits:
- **1000 messages/day** (Free tier)
- **80 messages/second** (Rate limit)

### Message Types:
- ✅ **Text messages**
- ✅ **Media messages**
- ✅ **Template messages**

### Auto-Reply Keywords:
- "merhaba", "selam" → Hoş geldin mesajı
- "fiyat", "ücret" → Fiyat bilgisi
- "web tasarım" → Web tasarım bilgisi
- "seo" → SEO hizmetleri
- "sosyal medya" → Sosyal medya hizmetleri

---

## 🎯 6. Freelancer İçin Avantajlar

### Müşteri İletişimi:
- ✅ **7/24 otomatik yanıt**
- ✅ **Profesyonel görünüm**
- ✅ **Hızlı müşteri desteği**
- ✅ **Mesaj takibi**

### İş Akışı:
- ✅ **Form gönderimlerini WhatsApp'a yönlendirme**
- ✅ **Proje durumu güncellemeleri**
- ✅ **Fatura ve ödeme bildirimleri**

---

## 📚 7. Kaynaklar

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Manager](https://business.facebook.com)
- [Webhook Setup](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)

---

**Son Güncelleme:** 19 Ekim 2025
