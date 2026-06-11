# 🤖 n8n Dijital Pazarlama Otomasyon Rehberi

Railway'de kurulu n8n ile tam otomatik dijital pazarlama sistemi.

---

## 📋 Genel Bakış

### Yapılabilecekler:
- ✅ **Reklam Yönetimi** - Google Ads, Meta Ads, LinkedIn Ads
- ✅ **Hedef Kitle Analizi** - Segment oluşturma, analiz
- ✅ **Günlük Kontroller** - Performans, bütçe, ROI takibi
- ✅ **Otomatik Raporlama** - Email, WhatsApp, SMS
- ✅ **Akıllı Uyarılar** - Bütçe aşımı, düşük performans
- ✅ **Kampanya Optimizasyonu** - Otomatik durdurma/başlatma
- ✅ **A/B Test Yönetimi** - Test sonuçları analizi
- ✅ **Lead Yönetimi** - Form verileri, CRM entegrasyonu

### Sınırlamalar:
- ⚠️ Kreative üretim manuel (görsel/metin)
- ⚠️ Stratejik karar için AI API gerekli
- ⚠️ İlk kurulum karmaşık

---

## 🎯 1. Reklam Platform Entegrasyonları

### Google Ads API
```json
{
  "credentials": {
    "developer_token": "GOOGLE_ADS_DEVELOPER_TOKEN",
    "client_id": "GOOGLE_CLIENT_ID",
    "client_secret": "GOOGLE_CLIENT_SECRET",
    "refresh_token": "GOOGLE_REFRESH_TOKEN",
    "customer_id": "GOOGLE_ADS_CUSTOMER_ID"
  }
}
```

**Yapılabilecekler:**
- Kampanya performansı çekme
- Bütçe kontrolü
- Anahtar kelime analizi
- Teklif yönetimi
- Kampanya durdurma/başlatma
- Conversion tracking

### Meta Ads (Facebook/Instagram) API
```json
{
  "credentials": {
    "access_token": "META_ACCESS_TOKEN",
    "ad_account_id": "act_XXXXXXXXX",
    "app_id": "META_APP_ID",
    "app_secret": "META_APP_SECRET"
  }
}
```

**Yapılabilecekler:**
- Kampanya metrikleri (CTR, CPC, ROAS)
- Hedef kitle analizi
- Reklam setleri yönetimi
- Bütçe optimizasyonu
- Instagram/Facebook birlikte
- Pixel verileri

### LinkedIn Ads API
```json
{
  "credentials": {
    "access_token": "LINKEDIN_ACCESS_TOKEN",
    "account_id": "LINKEDIN_AD_ACCOUNT_ID"
  }
}
```

**Yapılabilecekler:**
- B2B kampanya takibi
- Lead gen formları
- Demografik analiz

---

## 🔄 2. Temel Workflow'lar

### A) Günlük Performans Kontrolü
```
[Schedule: Her gün 09:00]
  ↓
[Google Ads: Get Campaigns]
  ↓
[Meta Ads: Get Campaigns]
  ↓
[Analiz: ROI, CPC, CTR]
  ↓
[If: ROI < %100]
  ↓
[WhatsApp/Email: Uyarı Gönder]
```

### B) Bütçe Koruma
```
[Schedule: Her 2 saatte]
  ↓
[Get Campaign Spend]
  ↓
[If: Spend > Daily Budget * 0.8]
  ↓
[Pause Campaign]
  ↓
[Send Alert: "Kampanya durduruldu"]
```

### C) Hedef Kitle Analizi
```
[Schedule: Haftalık]
  ↓
[Get Audience Data]
  ↓
[ChatGPT API: Analiz Yap]
  ↓
[Create New Segments]
  ↓
[Save to Database]
  ↓
[Email: Öneriler Gönder]
```

### D) Lead Yönetimi
```
[Webhook: Form Submit]
  ↓
[Validate Data]
  ↓
[Save to MySQL]
  ↓
[Tag Lead Source]
  ↓
[If: High Value Lead]
  ↓
[WhatsApp: Hemen Bildir]
[Else]
  ↓
[Email: Daily Digest]
```

### E) Rekabetçi Analiz
```
[Schedule: Günlük]
  ↓
[Get Competitor Ads (Meta Ads Library)]
  ↓
[Analyze Keywords]
  ↓
[Compare with Your Campaigns]
  ↓
[Generate Insights]
  ↓
[Email Report]
```

---

## 🎯 3. Hedef Kitle Belirleme Sistemi

### Otomatik Segmentasyon
```javascript
// n8n Function Node
const audiences = {
  high_value: items.filter(i => i.lifetime_value > 5000),
  engaged: items.filter(i => i.engagement_score > 0.7),
  cold: items.filter(i => i.days_since_interaction > 30),
  new: items.filter(i => i.days_since_first_visit < 7)
}

return audiences.map(segment => ({
  json: {
    name: segment.name,
    count: segment.users.length,
    action: segment.recommended_action
  }
}))
```

### Lookalike Audience Oluşturma
```
[Get Top Customers]
  ↓
[Meta API: Create Lookalike]
  ↓
[Set Budget & Schedule]
  ↓
[Launch Campaign]
  ↓
[Monitor Performance]
```

---

## 📊 4. Günlük Kontrol Dashboard'u

### Metrics Toplama
```json
{
  "daily_metrics": {
    "google_ads": {
      "impressions": 12500,
      "clicks": 450,
      "conversions": 23,
      "spend": 850,
      "ctr": 3.6,
      "cpc": 1.89,
      "cpa": 36.96,
      "roas": 4.2
    },
    "meta_ads": {
      "reach": 45000,
      "impressions": 78000,
      "clicks": 890,
      "conversions": 45,
      "spend": 1200,
      "ctr": 1.14,
      "cpc": 1.35,
      "cpa": 26.67,
      "roas": 5.8
    },
    "total": {
      "spend": 2050,
      "conversions": 68,
      "revenue": 8500,
      "roi": 314
    }
  }
}
```

### Otomatik Raporlama
```
[Collect All Metrics]
  ↓
[Generate Charts (QuickChart API)]
  ↓
[Create HTML Email]
  ↓
[Send to: okan@okandemir.org]
  ↓
[Save to MySQL]
  ↓
[Post to Slack/Discord]
```

---

## 🚨 5. Akıllı Uyarı Sistemi

### Kritik Uyarılar
```javascript
// Bütçe Uyarısı
if (dailySpend > dailyBudget * 0.9) {
  sendWhatsApp("⚠️ Günlük bütçenin %90'ına ulaştınız!")
}

// Düşük Performans
if (roas < 2) {
  sendEmail("📉 ROAS hedefin altında: " + roas)
}

// Yüksek CPA
if (cpa > targetCPA * 1.5) {
  pauseCampaign()
  sendAlert("🛑 Kampanya durduruldu - CPA çok yüksek")
}

// Fırsat
if (roas > 8) {
  sendAlert("🚀 Süper performans! Bütçe artırılabilir")
}
```

---

## 🤖 6. AI Destekli Karar Verme

### ChatGPT API Entegrasyonu
```json
{
  "node": "OpenAI",
  "prompt": `
    Kampanya Verileri:
    - ROAS: {{$json.roas}}
    - CPA: {{$json.cpa}}
    - CTR: {{$json.ctr}}
    - Conversion Rate: {{$json.cr}}
    
    Bu verilere göre:
    1. Kampanya durumu değerlendir
    2. Optimizasyon önerileri sun
    3. Bütçe önerisi yap
    4. Hedef kitle ayarlaması öner
  `,
  "model": "gpt-4"
}
```

### Otomatik Karar Alma
```
[Get Campaign Data]
  ↓
[ChatGPT: Analyze]
  ↓
[If: "pause" recommendation]
  → [Pause Campaign]
  ↓
[If: "increase budget" recommendation]
  → [Increase by 20%]
  ↓
[If: "change audience" recommendation]
  → [Update Targeting]
  ↓
[Log Decision to MySQL]
  ↓
[Send Report]
```

---

## 🔧 7. n8n Kurulumu

### Railway Environment Variables
```env
# n8n Basic
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password

# Webhook URL
WEBHOOK_URL=https://n8n.your-domain.com

# API Keys
GOOGLE_ADS_DEVELOPER_TOKEN=xxx
META_ACCESS_TOKEN=xxx
OPENAI_API_KEY=xxx

# Database Connection
MYSQL_HOST=your-mysql-host
MYSQL_DATABASE=okandemir_org
MYSQL_USER=xxx
MYSQL_PASSWORD=xxx

# Notification Channels
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_USER=xxx
EMAIL_SMTP_PASSWORD=xxx
```

### n8n Workflow Import/Export
```bash
# Export workflow
curl -u admin:password \
  https://n8n.your-domain.com/api/v1/workflows/1/export \
  -o workflow.json

# Import workflow
curl -u admin:password \
  -X POST \
  -H "Content-Type: application/json" \
  -d @workflow.json \
  https://n8n.your-domain.com/api/v1/workflows
```

---

## 📱 8. Webhook Entegrasyonları

### okandemir.org → n8n
```typescript
// app/api/n8n/trigger/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, data } = body
  
  // n8n webhook URL
  const n8nWebhook = process.env.N8N_WEBHOOK_URL
  
  const response = await fetch(n8nWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      data,
      timestamp: new Date().toISOString()
    })
  })
  
  return NextResponse.json({ success: true })
}
```

### Trigger Örnekleri
```javascript
// 1. Yeni lead geldiğinde
fetch('/api/n8n/trigger', {
  method: 'POST',
  body: JSON.stringify({
    action: 'new_lead',
    data: { email, phone, service }
  })
})

// 2. Form submission
fetch('/api/n8n/trigger', {
  method: 'POST',
  body: JSON.stringify({
    action: 'form_submit',
    data: formData
  })
})

// 3. Manuel kampanya kontrolü
fetch('/api/n8n/trigger', {
  method: 'POST',
  body: JSON.stringify({
    action: 'check_campaigns',
    data: { priority: 'high' }
  })
})
```

---

## 📊 9. Örnek Workflow: Tam Otomatik Sistem

### Master Campaign Manager
```
┌─────────────────────────────────────────┐
│  SCHEDULE: Her gün 08:00               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  1. GOOGLE ADS                         │
│  - Get all campaigns                   │
│  - Calculate metrics                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. META ADS                           │
│  - Get all campaigns                   │
│  - Calculate metrics                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. DATA PROCESSING                    │
│  - Merge data                          │
│  - Calculate ROI, ROAS                 │
│  - Identify issues                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  4. AI ANALYSIS (ChatGPT)              │
│  - Analyze performance                 │
│  - Generate recommendations            │
│  - Suggest actions                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  5. AUTOMATED ACTIONS                  │
│  - Pause low performers                │
│  - Increase winning campaigns          │
│  - Adjust bids                         │
│  - Update audiences                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  6. REPORTING                          │
│  - Email report                        │
│  - WhatsApp critical alerts            │
│  - Save to database                    │
│  - Update dashboard                    │
└─────────────────────────────────────────┘
```

---

## 💰 10. Maliyet Optimizasyonu

### Otomatik Bütçe Yönetimi
```javascript
// n8n Function Node
const campaigns = $input.all()

campaigns.forEach(campaign => {
  const { roas, spend, dailyBudget } = campaign.json
  
  let action = 'maintain'
  let newBudget = dailyBudget
  
  // Süper performans
  if (roas > 6) {
    action = 'increase'
    newBudget = dailyBudget * 1.2
  }
  
  // Kötü performans
  else if (roas < 2) {
    action = 'decrease'
    newBudget = dailyBudget * 0.5
  }
  
  // Çok kötü
  else if (roas < 1) {
    action = 'pause'
    newBudget = 0
  }
  
  campaign.json.action = action
  campaign.json.newBudget = newBudget
})

return campaigns
```

---

## 🎯 11. Hedef Kitle Optimizasyonu

### Audience Performance Tracker
```sql
-- MySQL'de audience performance
CREATE TABLE audience_performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audience_id VARCHAR(255),
  audience_name VARCHAR(255),
  platform VARCHAR(50),
  impressions INT,
  clicks INT,
  conversions INT,
  spend DECIMAL(10,2),
  revenue DECIMAL(10,2),
  roas DECIMAL(5,2),
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- En iyi performans gösteren kitleler
SELECT 
  audience_name,
  AVG(roas) as avg_roas,
  SUM(conversions) as total_conversions,
  SUM(spend) as total_spend
FROM audience_performance
WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY audience_name
HAVING avg_roas > 3
ORDER BY avg_roas DESC;
```

---

## 📈 12. A/B Test Otomasyonu

### Automated A/B Testing
```
[Create Campaign A]
    ↓
[Create Campaign B]
    ↓
[Set Equal Budgets]
    ↓
[Run for 7 days]
    ↓
[Compare Results]
    ↓
[Winner gets 80% budget]
[Loser gets 20% budget]
    ↓
[Continue monitoring]
```

---

## 🔐 13. Güvenlik

### API Key Management
```env
# Tüm sensitive data Railway secrets'ta
GOOGLE_ADS_API_KEY=***
META_ADS_API_KEY=***
N8N_ENCRYPTION_KEY=***
```

### Webhook Security
```javascript
// Signature verification
const crypto = require('crypto')

function verifyWebhook(payload, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  
  return hash === signature
}
```

---

## 🚀 14. İlk Kurulum Adımları

### 1. API Access Kurulumu
```bash
# Google Ads
1. Google Ads hesabı aç
2. API access iste (onay 24-48 saat)
3. Developer token al
4. OAuth credentials oluştur

# Meta Ads
1. Facebook Business Manager
2. App oluştur
3. Ads Management permission
4. Access token (60 gün / Long-lived)

# ChatGPT
1. OpenAI account
2. API key al
3. Billing setup
```

### 2. n8n Workflow Import
```bash
# 1. n8n'e giriş yap
https://your-n8n-domain.com

# 2. Import workflow
Settings > Import Workflow > workflow-dijital-pazarlama.json

# 3. Credentials ekle
Credentials > Add New > [Platform seç]

# 4. Test et
Execute Workflow > Debug mode
```

### 3. Database Setup
```sql
-- Kampanya verileri tablosu
CREATE TABLE campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50),
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  impressions INT,
  clicks INT,
  conversions INT,
  spend DECIMAL(10,2),
  revenue DECIMAL(10,2),
  ctr DECIMAL(5,2),
  cpc DECIMAL(5,2),
  cpa DECIMAL(5,2),
  roas DECIMAL(5,2),
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_platform (platform)
);
```

---

## 📱 15. Bildirim Kanalları

### WhatsApp Alerts
```javascript
// Kritik uyarılar için
async function sendWhatsAppAlert(message) {
  await fetch('https://okandemir.org/api/whatsapp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.INTERNAL_API_KEY!,
    },
    body: JSON.stringify({
      to: '+905552677739',
      message: `🚨 ${message}`
    })
  })
}
```

### Email Reports
```javascript
// Günlük raporlar için
async function sendDailyReport(data) {
  const html = `
    <h2>📊 Günlük Reklam Raporu</h2>
    <p><strong>Toplam Harcama:</strong> ₺${data.spend}</p>
    <p><strong>Dönüşüm:</strong> ${data.conversions}</p>
    <p><strong>ROAS:</strong> ${data.roas}</p>
    <p><strong>ROI:</strong> %${data.roi}</p>
  `
  
  await sendEmail({
    to: 'okan@okandemir.org',
    subject: 'Günlük Reklam Performansı',
    html
  })
}
```

---

## 🎓 16. Best Practices

### DO ✅
- Workflow'ları küçük ve modüler tut
- Error handling ekle
- Log tut (MySQL'e kaydet)
- Test mode'da başla
- Yavaş yavaş otomasyonu artır
- Manuel onay adımları ekle (kritik işlemler için)
- Backup al (workflow export)

### DON'T ❌
- Tüm kampanyaları aynı anda otomatize etme
- API rate limit'i göz ardı etme
- Tek workflow'da çok fazla işlem
- Error durumunda retry yapmama
- Log tutmama
- Test etmeden production'a alma

---

## 🆘 17. Troubleshooting

### Common Issues

**1. API Rate Limit**
```javascript
// Rate limiter ekle
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

for (const campaign of campaigns) {
  await processCampaign(campaign)
  await delay(1000) // 1 saniye bekle
}
```

**2. Token Expiration**
```javascript
// Auto-refresh token
if (response.status === 401) {
  await refreshToken()
  await retryRequest()
}
```

**3. Workflow Timeout**
```javascript
// Uzun işlemler için webhook + queue kullan
// Workflow 1: Trigger ve queue'ya ekle
// Workflow 2: Queue'dan al ve işle
```

---

## 📊 18. Success Metrics

### KPI Tracking
- **Workflow Execution Rate:** %98+ başarılı
- **Alert Response Time:** <5 dakika
- **Cost Reduction:** %20-30 (otomatik optimizasyon)
- **Time Saved:** 15-20 saat/hafta
- **ROI Improvement:** %40-60

---

## 🔄 19. Maintenance

### Haftalık
- [ ] Workflow execution logs kontrol
- [ ] API usage kontrol
- [ ] Error rate kontrol

### Aylık
- [ ] Workflow optimize et
- [ ] Yeni özellikler ekle
- [ ] API credentials yenile (gerekirse)
- [ ] Performance review

---

## 🎯 Özet

n8n ile **TAMAMEN OTOMATIK** dijital pazarlama mümkün:

✅ Reklam yönetimi
✅ Hedef kitle analizi
✅ Günlük kontroller
✅ Otomatik optimizasyon
✅ Akıllı uyarılar
✅ Raporlama

**Tek yapmanız gereken:**
1. API access alma (Google, Meta)
2. n8n workflow'ları kurma
3. Credentials ekleme
4. Test etme
5. Monitoring

---

## 📞 İletişim

**Okan Demir**
- 📧 okan@okandemir.org
- 📱 +90 555 267 77 39
- 🌐 okandemir.org

