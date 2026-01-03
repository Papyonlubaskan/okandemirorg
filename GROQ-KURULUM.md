# 🚀 Groq AI Kurulum Rehberi

**100% Ücretsiz - Kredi Kartı Gerektirmez** ✅

---

## ✨ Groq Nedir?

Groq, dünyanın en hızlı AI inference platformu. Llama 3.1 modellerini **ücretsiz** kullanmanı sağlıyor.

### Neden Groq?
- ✅ **Tamamen ücretsiz** - Kredi kartı gerektirmez
- ✅ **Çok hızlı** - ChatGPT'den 10x daha hızlı
- ✅ **Güçlü model** - Llama 3.1 70B (GPT-4 seviyesi)
- ✅ **Cömert limitler** - 14,400 request/gün
- ✅ **Kolay entegrasyon** - OpenAI API uyumlu

### Free Tier Limitleri
```
✅ Requests/Minute: 30 (senin için fazlasıyla yeterli)
✅ Requests/Day: 14,400 (günde 20 müşteri x 10 analiz = 200 request)
✅ Tokens/Minute: 6,000
✅ Model: llama-3.1-70b-versatile (en güçlü model)
✅ Süre: Limitsiz (sonsuza kadar ücretsiz)
```

**Hesaplama:**
- 20 müşteri x günde 10 analiz = 200 request/gün
- Limit: 14,400 request/gün
- **72 kat fazla kapasiten var!** 🎉

---

## 📋 Adım 1: Groq Hesabı Aç

### 1.1 Kayıt Ol
```
🔗 https://console.groq.com/
```

**Seçenekler:**
- 📧 Email ile kayıt
- 🔐 Google ile giriş
- 🐙 GitHub ile giriş

**ÖNEMLİ:** 
- ❌ Kredi kartı **gerektirmez**
- ❌ Ödeme bilgisi **gerektirmez**
- ✅ Sadece email doğrulama yeterli

### 1.2 Email Doğrula
```
1. Kayıt ol
2. Email'ini doğrula (inbox'ına link gelecek)
3. Giriş yap
```

---

## 🔑 Adım 2: API Key Al

### 2.1 API Keys Sayfası
```
Console > API Keys > Create API Key
```

### 2.2 Key Oluştur
```
Name: Okan Demir Digital - n8n
Description: Multi-client campaign analysis
```

**Copy API Key:**
```
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **UYARI:** Bu key'i hemen kopyala! Bir daha gösterilmeyecek.

---

## 🚀 Adım 3: Railway'e Ekle

### 3.1 Railway Dashboard
```
Railway > okandemirorg Project > Variables
```

### 3.2 Environment Variable Ekle
```env
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```

### 3.3 Deploy
```
Railway otomatik deploy edecek
Birkaç saniye içinde hazır!
```

---

## ✅ Adım 4: Test Et

### 4.1 API Test
```bash
# Test endpoint
curl -X POST https://okandemir.org/api/groq/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "clientData": {
      "name": "Test Müşteri",
      "company_name": "Test AŞ",
      "package_type": "standard",
      "today_spend": 500,
      "today_conversions": 25,
      "today_roas": 4.2,
      "target_roas": 3.0,
      "monthly_budget_limit": 15000
    },
    "analysisType": "performance"
  }'
```

### 4.2 Beklenen Sonuç
```json
{
  "success": true,
  "analysis": "📈 PERFORMANS DEĞERLENDİRMESİ:\n\nTest Müşteri'nin bugünkü performansı hedeflerin üzerinde...",
  "tokensUsed": 450,
  "provider": "groq",
  "model": "llama-3.1-70b-versatile",
  "timestamp": "2025-11-03T..."
}
```

---

## 🔥 Adım 5: n8n'e Entegre Et

### 5.1 n8n HTTP Request Node

**Node Ayarları:**
```
Name: Groq AI Analysis
Type: HTTP Request
Method: POST
URL: https://api.groq.com/openai/v1/chat/completions
```

**Authentication:**
```
Authentication: Header Auth
Header Name: Authorization
Header Value: Bearer {{$env.GROQ_API_KEY}}
```

**Body (JSON):**
```json
{
  "model": "llama-3.1-70b-versatile",
  "messages": [
    {
      "role": "system",
      "content": "Sen bir dijital pazarlama uzmanısın. Türkçe analiz yap."
    },
    {
      "role": "user",
      "content": "Müşteri: {{$json.client_name}}\nHarcama: ₺{{$json.spend}}\nROAS: {{$json.roas}}x\n\nAnaliz yap ve öneriler sun."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1500
}
```

### 5.2 Response İşle

**Function Node:**
```javascript
// Groq response'u işle
const response = $input.first().json;

const analysis = response.choices[0].message.content;
const tokensUsed = response.usage.total_tokens;

return [{
  json: {
    analysis: analysis,
    tokensUsed: tokensUsed,
    timestamp: new Date().toISOString()
  }
}];
```

---

## 📊 Groq vs ChatGPT Karşılaştırma

| Özellik | Groq (Ücretsiz) | ChatGPT-3.5 | ChatGPT-4 |
|---------|-----------------|-------------|-----------|
| **Maliyet** | $0 🎉 | ~$6/ay | ~$90/ay |
| **Kredi Kartı** | ❌ Gerekmez | ✅ Gerekli | ✅ Gerekli |
| **Request/Gün** | 14,400 | ~3,000 | ~1,000 |
| **Hız** | ⚡⚡⚡ Çok hızlı | ⚡⚡ Orta | ⚡ Yavaş |
| **Kalite** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Model** | Llama 3.1 70B | GPT-3.5 | GPT-4 |

**Sonuç:** Senin kullanım için Groq **mükemmel** bir seçim! 🚀

---

## 💡 Kullanım Örnekleri

### 1. Kampanya Analizi
```javascript
const prompt = `
Müşteri: ${client.name}
Platform: Google Ads + Meta Ads
Harcama: ₺${metrics.spend}
ROAS: ${metrics.roas}x
Hedef: ${client.target_roas}x

Analiz yap:
1. Performans değerlendirmesi
2. Optimizasyon önerileri
3. Acil aksiyonlar
`;
```

### 2. Uyarı Analizi
```javascript
const prompt = `
⚠️ DÜŞÜK PERFORMANS UYARISI

Müşteri: ${client.name}
Kampanya: ${campaign.name}
Sorun: ROAS hedefin altında
Mevcut: ${campaign.roas}x
Hedef: ${client.target_roas}x

Ne yapılmalı?
`;
```

### 3. Rapor Hazırlama
```javascript
const prompt = `
📊 HAFTALIK RAPOR

Müşteri: ${client.name}
Dönem: ${period}

Performans:
- Harcama: ₺${total_spend}
- Dönüşüm: ${conversions}
- ROAS: ${roas}x

Müşteriye gönderilecek rapor için:
- Başarılar
- İyileştirmeler
- Öneriler

Pozitif ve motive edici bir dil kullan.
`;
```

---

## 📈 Günlük Kullanım Planı

**20 Müşteri İçin:**

```
Her Müşteri İçin Günlük:
├── 1x Sabah performans kontrolü
├── 1x Öğle bütçe kontrolü  
├── 1x Akşam özet rapor
└── 2x Kritik uyarı (gerekirse)
═══════════════════════════
TOPLAM: ~5 request/müşteri/gün

20 müşteri x 5 = 100 request/gün
Limit: 14,400 request/gün
Kullanım: %0.7 (çok düşük!) ✅
```

---

## 🎯 Prompt Best Practices

### İYİ Prompt ✅
```
Müşteri: ABC Şirketi
Paket: Standard
Harcama: ₺12,500
ROAS: 2.8x (Hedef: 3.0x)
Dönüşüm: 45

Kısa analiz ve 3 somut öneri ver.
```

### KÖTÜ Prompt ❌
```
Bu müşterinin durumu nasıl?
```

### ÇOK UZUN Prompt ❌
```
[10 sayfa veri...]
Her şeyi detaylı analiz et...
```

**Optimal Token Kullanımı:**
- Input: 200-500 tokens
- Output: 500-1000 tokens
- Toplam: ~1500 tokens/request

---

## 🔧 Troubleshooting

### Hata: 401 Unauthorized
```
❌ Sorun: API key yanlış veya eksik
✅ Çözüm: 
- Railway'de GROQ_API_KEY var mı kontrol et
- Key'i yeniden kopyala
```

### Hata: 429 Rate Limit
```
❌ Sorun: Dakikada 30 request aşıldı
✅ Çözüm:
- n8n'de rate limiting ekle
- Request'ler arasında 2-3 saniye bekle
```

### Hata: Model Not Found
```
❌ Sorun: Model adı yanlış
✅ Çözüm:
- Model: "llama-3.1-70b-versatile" kullan
- Tam model listesi: https://console.groq.com/docs/models
```

---

## 📚 Groq Modelleri

### Önerilen: Llama 3.1 70B
```
Model: llama-3.1-70b-versatile
Tokens/Min: 6,000
Kullanım: Kampanya analizi, raporlama
Kalite: ⭐⭐⭐⭐⭐
```

### Alternatif: Llama 3.1 8B (Daha hızlı)
```
Model: llama-3.1-8b-instant
Tokens/Min: 20,000
Kullanım: Basit uyarılar, hızlı kontroller
Kalite: ⭐⭐⭐⭐
```

### Alternatif: Mixtral 8x7B
```
Model: mixtral-8x7b-32768
Context: 32K tokens (çok uzun metinler için)
Kalite: ⭐⭐⭐⭐
```

---

## 💰 Maliyet Karşılaştırması

**20 Müşteri - Aylık:**

| Servis | Request/Ay | Maliyet |
|--------|------------|---------|
| **Groq** | 3,000 | **$0** 🎉 |
| ChatGPT-3.5 | 3,000 | ~$6 |
| ChatGPT-4 | 3,000 | ~$90 |
| Claude | 3,000 | ~$60 |

**Yıllık Tasarruf:** $720 - $1,080 💰

---

## 🎉 Özet

### ✅ Groq Avantajları
1. **100% Ücretsiz** - Kredi kartı gerektirmez
2. **Çok hızlı** - Anında sonuç
3. **Cömert limitler** - 14,400 req/day
4. **Güçlü model** - Llama 3.1 70B
5. **Kolay setup** - 5 dakikada hazır

### 🚀 Hemen Başla

1. **https://console.groq.com** → Kayıt ol
2. API Key al
3. Railway'e ekle
4. Test et
5. n8n'e entegre et

**Sonuç:** 20 müşteri için **mükemmel** ve **tamamen ücretsiz**! 🎯

---

## 📞 Destek

**Groq Documentation:**
- 📖 https://console.groq.com/docs
- 💬 https://console.groq.com/support

**Senin Destek:**
- 📧 okan@okandemir.org
- 📱 +90 555 267 77 39

