# 🚀 n8n Dijital Pazarlama - Hızlı Başlangıç

5 adımda kurulum ve çalıştırma.

> ⚠️ **Eğer N8N konusunda hiçbir şey bilmiyorsan, önce şu dosyayı oku:**
> **👉 `N8N-ILK-ADIMLAR.md` - Sıfırdan başlayanlar için basit rehber**

---

## 1️⃣ API Access (1-3 gün)

### Google Ads API
```bash
# 1. https://ads.google.com/aw/overview
# 2. Tools & Settings > Setup > API Center
# 3. "Apply for access" (24-48 saat onay bekle)
# 4. OAuth2 credentials oluştur
```

**Gerekli Bilgiler:**
- Developer Token
- Client ID
- Client Secret  
- Refresh Token
- Customer ID

### Meta Ads API
```bash
# 1. https://business.facebook.com
# 2. Business Settings > Apps > Add App
# 3. Type: Business
# 4. Permissions: ads_management, ads_read
# 5. Generate Access Token (Long-lived)
```

**Gerekli Bilgiler:**
- Access Token (long-lived)
- Ad Account ID (act_xxxxx)
- App ID
- App Secret

---

## 2️⃣ Railway Setup

### Environment Variables Ekle
```bash
# Railway Dashboard > Project > Variables

N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/marketing
GOOGLE_ADS_DEVELOPER_TOKEN=xxx
META_ACCESS_TOKEN=xxx
OPENAI_API_KEY=sk-proj-xxx
```

**Tüm değişkenler:** `railway-n8n-env-template.txt`

---

## 3️⃣ n8n Workflow Import

### Workflow Dosyası
```bash
# 1. n8n'e giriş yap
https://your-n8n-domain.com

# 2. Import workflow
Settings > Import from File > N8N-WORKFLOW-ORNEKLERI.json

# 3. Credentials ekle
Credentials > Add New:
  - Google Ads API (OAuth2)
  - Meta Ads API (OAuth2)
  - OpenAI (API Key)
  - MySQL (okandemir.org database)
```

### Credentials Yapılandırma

**Google Ads:**
```json
{
  "authentication": "oAuth2",
  "developerToken": "{{$env.GOOGLE_ADS_DEVELOPER_TOKEN}}",
  "oauthTokenData": {
    "client_id": "{{$env.GOOGLE_ADS_CLIENT_ID}}",
    "client_secret": "{{$env.GOOGLE_ADS_CLIENT_SECRET}}",
    "refresh_token": "{{$env.GOOGLE_ADS_REFRESH_TOKEN}}"
  },
  "customerId": "{{$env.GOOGLE_ADS_CUSTOMER_ID}}"
}
```

**Meta Ads:**
```json
{
  "authentication": "accessToken",
  "accessToken": "{{$env.META_ACCESS_TOKEN}}"
}
```

**OpenAI:**
```json
{
  "apiKey": "{{$env.OPENAI_API_KEY}}"
}
```

---

## 4️⃣ Database Setup

### Campaign Metrics Table
```sql
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255) NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(5,2) DEFAULT 0,
  cpa DECIMAL(5,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_platform (platform),
  INDEX idx_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Audience Performance Table
```sql
CREATE TABLE IF NOT EXISTS audience_performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audience_id VARCHAR(255) NOT NULL,
  audience_name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  size INT DEFAULT 0,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_audience (audience_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 5️⃣ İlk Test

### Manuel Workflow Test
```bash
# n8n Dashboard
1. "Dijital Pazarlama Master Workflow" aç
2. "Execute Workflow" tıkla
3. Sonuçları kontrol et
```

### API Test
```bash
# Health check (INTERNAL_API_KEY tanımlıysa header zorunlu)
curl https://okandemir.org/api/n8n/trigger \
  -H "x-api-key: YOUR_INTERNAL_API_KEY"

# Manuel kampanya kontrolü
curl -X POST https://okandemir.org/api/n8n/campaigns \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INTERNAL_API_KEY" \
  -d '{
    "platform": "all",
    "action": "check_performance"
  }'
```

### Sonuç Kontrolü
```bash
# WhatsApp'a bildirim geldi mi?
# Email rapor geldi mi?
# MySQL'e veri yazıldı mı?

# MySQL kontrol
SELECT * FROM campaign_metrics 
WHERE date = CURDATE() 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ✅ Checklist

- [ ] Google Ads API access onaylandı
- [ ] Meta Ads API access onaylandı
- [ ] Railway environment variables eklendi
- [ ] n8n workflow import edildi
- [ ] n8n credentials eklendi
- [ ] Database tables oluşturuldu
- [ ] Manuel test başarılı
- [ ] WhatsApp bildirimi geldi
- [ ] Email rapor geldi
- [ ] MySQL'e veri yazıldı

---

## 🎯 İlk Workflow'u Aktive Et

### Günlük Performans Kontrolü (Önerilen)
```
Schedule: Her gün 09:00
Actions:
  ✅ Tüm kampanyaları çek
  ✅ Performans analizi
  ✅ Sorunları tespit et
  ✅ WhatsApp uyarı gönder
  ✅ Email rapor gönder
  ✅ MySQL'e kaydet
```

**Workflow'u aktive et:**
```bash
n8n Dashboard > "Dijital Pazarlama Master Workflow" > Active: ON
```

---

## 📱 İletişim Kanalları Test

### WhatsApp Test
```bash
curl -X POST https://okandemir.org/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INTERNAL_API_KEY" \
  -d '{
    "to": "+905552677739",
    "message": "🤖 n8n test mesajı"
  }'
```

### Email Test
```bash
# n8n'de "Email Send" node test et
To: okan@okandemir.org
Subject: n8n Test
Body: Test email from n8n
```

---

## 🔧 Troubleshooting

### API Bağlantı Hatası
```bash
# Google Ads
- Developer token doğru mu?
- OAuth refresh token geçerli mi?
- Customer ID doğru mu?

# Meta Ads
- Access token long-lived mi? (60 gün)
- Ad account permissions var mı?
```

### Workflow Çalışmıyor
```bash
# n8n logs kontrol
Railway > n8n > Logs

# Credentials kontrol
n8n > Credentials > Test Connection

# Manual execution
n8n > Workflow > Execute Workflow (debug mode)
```

### Bildirim Gelmiyor
```bash
# WhatsApp
- Access token geçerli mi?
- Phone number ID doğru mu?
- Message template onaylı mı?

# Email
- SMTP credentials doğru mu?
- Gmail app password kullanıldı mı?
```

---

## 🎓 Sonraki Adımlar

1. **Hedef Kitle Workflow'u** - Otomatik segment oluşturma
2. **Bütçe Optimizasyon** - Otomatik bütçe ayarlama
3. **A/B Test Automation** - Otomatik test yönetimi
4. **Competitor Analysis** - Rakip analizi
5. **Lead Scoring** - Otomatik lead puanlama

**Detaylar:** `N8N-DIJITAL-PAZARLAMA-OTOMASYON.md`

---

## 📞 Destek

Sorun mu yaşıyorsun? Bana ulaş:
- 📧 okan@okandemir.org
- 📱 +90 555 267 77 39

