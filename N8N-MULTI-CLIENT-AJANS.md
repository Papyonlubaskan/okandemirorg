# 🏢 n8n Multi-Client Dijital Pazarlama Ajans Sistemi

20+ müşteri hesabını tek platformdan yönet - Google Ads + Meta Ads

---

## 🎯 Sistem Genel Bakış

### Özellikler:
- ✅ **20+ müşteri hesabı** - Tek yerden yönetim
- ✅ **Google Ads MCC** - Manager hesap yapısı
- ✅ **Meta Business Manager** - Partner erişim
- ✅ **Müşteri bazlı raporlama** - Her müşteriye özel
- ✅ **Otomatik fiyat hesaplama** - Bütçe bazlı pricing
- ✅ **White-label raporlar** - Markalı PDF'ler
- ✅ **Groq AI analiz** - Ücretsiz AI
- ✅ **Müşteri dashboard** - Her müşteriye özel panel

---

## 📊 1. Müşteri Hesap Yapısı

### Database Schema

```sql
-- Müşteriler tablosu
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  
  -- Google Ads
  google_ads_customer_id VARCHAR(50),
  google_ads_enabled BOOLEAN DEFAULT false,
  
  -- Meta Ads
  meta_ad_account_id VARCHAR(100),
  meta_business_id VARCHAR(100),
  meta_ads_enabled BOOLEAN DEFAULT false,
  
  -- Paket ve Fiyatlandırma
  package_type ENUM('basic', 'standard', 'premium', 'custom') DEFAULT 'standard',
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  management_fee_percent DECIMAL(5,2) DEFAULT 15.00,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Bütçe Limitleri
  daily_budget_limit DECIMAL(10,2),
  monthly_budget_limit DECIMAL(10,2),
  
  -- Hedefler
  target_roas DECIMAL(5,2) DEFAULT 3.00,
  target_cpa DECIMAL(10,2),
  
  -- Bildirimler
  alert_email VARCHAR(255),
  alert_phone VARCHAR(20),
  alert_whatsapp VARCHAR(20),
  
  -- Raporlama
  report_frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'weekly',
  report_day VARCHAR(20),
  
  -- Durum
  status ENUM('active', 'paused', 'cancelled') DEFAULT 'active',
  onboarding_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_email (email),
  INDEX idx_status (status),
  INDEX idx_google_customer (google_ads_customer_id),
  INDEX idx_meta_account (meta_ad_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Müşteri kampanya metrikleri
CREATE TABLE client_campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  
  -- Metrikler
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Hesaplanan
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(5,2) DEFAULT 0,
  cpa DECIMAL(5,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client_date (client_id, date),
  INDEX idx_platform (platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Müşteri faturaları
CREATE TABLE client_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Maliyetler
  ad_spend DECIMAL(10,2) DEFAULT 0,
  management_fee DECIMAL(10,2) DEFAULT 0,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  additional_fees DECIMAL(10,2) DEFAULT 0,
  
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Durum
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  due_date DATE,
  paid_date DATE,
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_status (status),
  INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Müşteri aksiyonları/events
CREATE TABLE client_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  event_type ENUM('campaign_paused', 'budget_alert', 'low_performance', 'goal_achieved', 'report_sent', 'invoice_sent') NOT NULL,
  severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- İlgili veri
  related_campaign_id VARCHAR(255),
  related_platform VARCHAR(50),
  metadata JSON,
  
  -- Aksiyon alındı mı?
  action_taken BOOLEAN DEFAULT false,
  action_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client_date (client_id, created_at),
  INDEX idx_event_type (event_type),
  INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔧 2. Google Ads MCC (Manager) Setup

### MCC Account Yapısı
```
[Okan Demir Digital Agency MCC]
  │
  ├── [Müşteri 1 - Customer ID: 123-456-7890]
  ├── [Müşteri 2 - Customer ID: 234-567-8901]
  ├── [Müşteri 3 - Customer ID: 345-678-9012]
  ├── ...
  └── [Müşteri 20 - Customer ID: xxx-xxx-xxxx]
```

### MCC Kurulumu
```bash
# 1. Google Ads Manager Account oluştur
https://ads.google.com/home/tools/manager-accounts/

# 2. Müşteri hesaplarını bağla
- Option 1: Link existing accounts (müşteri onayı ile)
- Option 2: Create new accounts (yeni müşteriler için)

# 3. API Access
- MCC seviyesinde API access
- Tüm alt hesaplara otomatik erişim
```

### Environment Variables
```env
GOOGLE_ADS_MCC_CUSTOMER_ID=123-456-7890
GOOGLE_ADS_DEVELOPER_TOKEN=your-token
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-secret
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
```

---

## 📱 3. Meta Business Manager Setup

### Partner Access Yapısı
```
[Okan Demir Digital - Business Manager]
  │
  ├── [İstek Gönder] → Müşteri onaylar
  │   ├── Ad Accounts (reklam hesapları)
  │   ├── Pages (sayfalar)
  │   └── Pixels (piksel erişimi)
  │
  └── [Partner Access]
      ├── Müşteri 1 Ad Account (act_111111)
      ├── Müşteri 2 Ad Account (act_222222)
      └── ...
```

### Kurulum
```bash
# 1. Business Manager oluştur
https://business.facebook.com

# 2. Partner erişimi iste
Business Settings > Partners > Add Partner
Permissions: Manage Ad Accounts, View Pages, View Pixels

# 3. Müşteri onaylasın
Müşteri business manager'dan onay verir

# 4. API Access
- Business Manager App oluştur
- System User oluştur (otomatik yönetim için)
- Ad Account permissions ver
```

---

## 🤖 4. Groq AI Entegrasyonu (100% Ücretsiz - Kredi Kartı Gerekmez)

### Neden Groq?
- ✅ **Tamamen ücretsiz** - Kredi kartı **gerektirmez**
- ✅ **Hızlı** - ChatGPT'den 10x daha hızlı
- ✅ **Güçlü** - Llama 3.1 70B modeli
- ✅ **Cömert limitler** - 14,400 request/gün (20 müşteri için fazlasıyla yeterli)

### API Setup
```env
# 100% Ücretsiz - Sadece email ile kayıt yeterli
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```

**Kurulum:** `GROQ-KURULUM.md` dosyasına bak (5 dakika)

### n8n Function: Groq Analysis
```javascript
// Müşteri kampanyalarını Groq ile analiz et
async function analyzeWithGroq(clientData) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Sen bir dijital pazarlama ajansı yöneticisisin. Müşteri kampanyalarını analiz edip öneriler sunuyorsun.'
        },
        {
          role: 'user',
          content: `
            Müşteri: ${clientData.name}
            Paket: ${clientData.package_type}
            
            Kampanya Performansı:
            - Harcama: ₺${clientData.spend}
            - Bütçe Limiti: ₺${clientData.budget_limit}
            - ROAS: ${clientData.roas} (Hedef: ${clientData.target_roas})
            - CPA: ₺${clientData.cpa} (Hedef: ₺${clientData.target_cpa})
            - Dönüşüm: ${clientData.conversions}
            
            Analiz yap:
            1. Performans değerlendirmesi
            2. Hedeflere göre durum
            3. Optimizasyon önerileri
            4. Acil aksiyonlar (varsa)
            5. Müşteriye raporlama önerileri
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });
  
  const result = await response.json();
  return result.choices[0].message.content;
}
```

---

## 📊 5. Paket Fiyatlandırma Sistemi

### Standart Paketler

```javascript
const pricingPackages = {
  basic: {
    name: 'Temel Paket',
    monthlyFee: 2500,
    managementFeePercent: 20,
    setupFee: 1500,
    features: [
      'Google Ads VEYA Meta Ads',
      'Haftalık rapor',
      'Email destek',
      'Maksimum 5 kampanya',
      'Aylık toplantı'
    ],
    maxMonthlyBudget: 10000,
    minMonthlyBudget: 2000
  },
  
  standard: {
    name: 'Standart Paket',
    monthlyFee: 4500,
    managementFeePercent: 15,
    setupFee: 2500,
    features: [
      'Google Ads + Meta Ads',
      '2x haftalık rapor',
      'Email + WhatsApp destek',
      'Maksimum 10 kampanya',
      'Haftalık toplantı',
      'A/B test yönetimi'
    ],
    maxMonthlyBudget: 30000,
    minMonthlyBudget: 5000
  },
  
  premium: {
    name: 'Premium Paket',
    monthlyFee: 8000,
    managementFeePercent: 12,
    setupFee: 5000,
    features: [
      'Google Ads + Meta Ads + LinkedIn',
      'Günlük rapor',
      '7/24 destek (WhatsApp)',
      'Sınırsız kampanya',
      'Günlük toplantı (isteğe bağlı)',
      'Advanced A/B testing',
      'Özel kreative destek',
      'Landing page optimizasyon'
    ],
    maxMonthlyBudget: 100000,
    minMonthlyBudget: 15000
  },
  
  custom: {
    name: 'Özel Paket',
    monthlyFee: 'custom', // Müşteriye özel
    managementFeePercent: 10,
    setupFee: 'custom',
    features: [
      'Tüm özellikler',
      'Özel SLA',
      'Dedicated account manager',
      'Özel entegrasyonlar'
    ]
  }
};

// Otomatik fiyat hesaplama
function calculateClientFee(client, monthlyAdSpend) {
  const pkg = pricingPackages[client.package_type];
  
  let managementFee = monthlyAdSpend * (pkg.managementFeePercent / 100);
  let monthlyFee = pkg.monthlyFee;
  
  // Bütçe bazlı indirim
  if (monthlyAdSpend > 50000) {
    managementFee *= 0.9; // %10 indirim
  } else if (monthlyAdSpend > 100000) {
    managementFee *= 0.85; // %15 indirim
  }
  
  return {
    adSpend: monthlyAdSpend,
    managementFee: managementFee,
    monthlyFee: monthlyFee,
    total: monthlyAdSpend + managementFee + monthlyFee,
    breakdown: {
      adSpend: monthlyAdSpend,
      managementFee: managementFee,
      subscriptionFee: monthlyFee
    }
  };
}
```

---

## 🔄 6. Master Multi-Client Workflow

### n8n Workflow: Daily Client Check

```json
{
  "name": "Multi-Client Daily Check",
  "nodes": [
    {
      "name": "Schedule - 08:00",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 8 * * *"}]
        }
      }
    },
    {
      "name": "Get Active Clients",
      "type": "n8n-nodes-base.mySql",
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM clients WHERE status = 'active'"
      }
    },
    {
      "name": "Loop Through Clients",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 5
      }
    },
    {
      "name": "Get Google Ads Data",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Her müşteri için Google Ads verisini çek..."
      }
    },
    {
      "name": "Get Meta Ads Data",
      "type": "n8n-nodes-base.function"
    },
    {
      "name": "Analyze with Groq",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://api.groq.com/openai/v1/chat/completions"
      }
    },
    {
      "name": "Check Thresholds",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {"value1": "={{$json.roas}}", "operation": "smaller", "value2": "={{$json.target_roas}}"}
          ]
        }
      }
    },
    {
      "name": "Send Client Alert",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Save Metrics",
      "type": "n8n-nodes-base.mySql"
    },
    {
      "name": "Generate Report",
      "type": "n8n-nodes-base.function"
    }
  ]
}
```

---

## 📧 7. White-Label Raporlama

### Müşteriye Özel Email Rapor

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #0066cc; color: white; padding: 20px; }
    .metrics { display: flex; gap: 20px; }
    .metric-card { 
      background: #f5f5f5; 
      padding: 15px; 
      border-radius: 8px;
      flex: 1;
    }
    .metric-value { font-size: 32px; font-weight: bold; }
    .metric-label { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{client_name}} - Haftalık Performans Raporu</h1>
    <p>{{period_start}} - {{period_end}}</p>
  </div>
  
  <div style="padding: 20px;">
    <h2>📊 Genel Performans</h2>
    
    <div class="metrics">
      <div class="metric-card">
        <div class="metric-value">₺{{total_spend}}</div>
        <div class="metric-label">Toplam Harcama</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-value">{{total_conversions}}</div>
        <div class="metric-label">Dönüşüm</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-value">{{roas}}x</div>
        <div class="metric-label">ROAS</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-value">₺{{cpa}}</div>
        <div class="metric-label">CPA</div>
      </div>
    </div>
    
    <h2>🤖 AI Analizi</h2>
    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0066cc;">
      {{groq_analysis}}
    </div>
    
    <h2>📈 Kampanya Performansları</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th>Kampanya</th>
          <th>Platform</th>
          <th>Harcama</th>
          <th>Dönüşüm</th>
          <th>ROAS</th>
          <th>Durum</th>
        </tr>
      </thead>
      <tbody>
        {{#each campaigns}}
        <tr>
          <td>{{name}}</td>
          <td>{{platform}}</td>
          <td>₺{{spend}}</td>
          <td>{{conversions}}</td>
          <td>{{roas}}x</td>
          <td>{{status}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    
    <h2>💡 Öneriler</h2>
    <ul>
      {{#each recommendations}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
    
    <hr>
    <p style="color: #666; font-size: 12px;">
      Bu rapor Okan Demir Digital tarafından otomatik olarak oluşturulmuştur.<br>
      Sorularınız için: okan@okandemir.org | +90 555 267 77 39
    </p>
  </div>
</body>
</html>
```

---

## 🎛️ 8. Client Management Dashboard API

### API Endpoints

```typescript
// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

// Tüm müşterileri listele
export async function GET() {
  const clients = await query(`
    SELECT 
      c.*,
      COUNT(DISTINCT ccm.campaign_id) as total_campaigns,
      SUM(ccm.spend) as total_spend_today,
      AVG(ccm.roas) as avg_roas
    FROM clients c
    LEFT JOIN client_campaign_metrics ccm ON c.id = ccm.client_id 
      AND ccm.date = CURDATE()
    WHERE c.status = 'active'
    GROUP BY c.id
    ORDER BY c.name
  `)
  
  return NextResponse.json({ success: true, clients })
}

// Yeni müşteri ekle
export async function POST(request: NextRequest) {
  const data = await request.json()
  
  const result = await query(`
    INSERT INTO clients 
    (name, email, phone, company_name, package_type, monthly_fee, management_fee_percent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    data.name,
    data.email,
    data.phone,
    data.company_name,
    data.package_type,
    data.monthly_fee,
    data.management_fee_percent
  ])
  
  // n8n'e onboarding workflow tetikle
  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'client_onboarding',
      clientId: result.insertId,
      data
    })
  })
  
  return NextResponse.json({ 
    success: true, 
    clientId: result.insertId 
  })
}

// app/api/clients/[id]/route.ts
// Müşteri detayları
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id
  
  // Müşteri bilgileri
  const [client] = await query(`
    SELECT * FROM clients WHERE id = ?
  `, [clientId])
  
  // Son 30 gün metrikleri
  const metrics = await query(`
    SELECT 
      date,
      platform,
      SUM(spend) as daily_spend,
      SUM(conversions) as daily_conversions,
      AVG(roas) as daily_roas
    FROM client_campaign_metrics
    WHERE client_id = ? 
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY date, platform
    ORDER BY date DESC
  `, [clientId])
  
  // Aktif kampanyalar
  const campaigns = await query(`
    SELECT DISTINCT
      campaign_id,
      campaign_name,
      platform,
      SUM(spend) as total_spend,
      SUM(conversions) as total_conversions,
      AVG(roas) as avg_roas
    FROM client_campaign_metrics
    WHERE client_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY campaign_id, campaign_name, platform
  `, [clientId])
  
  return NextResponse.json({
    success: true,
    client,
    metrics,
    campaigns
  })
}

// app/api/clients/[id]/report/route.ts
// Müşteri raporu oluştur ve gönder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id
  const { reportType = 'weekly' } = await request.json()
  
  // n8n'e report generation tetikle
  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generate_client_report',
      clientId,
      reportType
    })
  })
  
  return NextResponse.json({
    success: true,
    message: 'Rapor oluşturma başlatıldı'
  })
}

// app/api/clients/[id]/invoice/route.ts
// Fatura oluştur
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id
  const { periodStart, periodEnd } = await request.json()
  
  // Müşteri bilgileri
  const [client] = await query(`
    SELECT * FROM clients WHERE id = ?
  `, [clientId])
  
  // Dönem içi harcama
  const [spending] = await query(`
    SELECT SUM(spend) as total_ad_spend
    FROM client_campaign_metrics
    WHERE client_id = ?
      AND date BETWEEN ? AND ?
  `, [clientId, periodStart, periodEnd])
  
  const adSpend = spending.total_ad_spend || 0
  const managementFee = adSpend * (client.management_fee_percent / 100)
  const monthlyFee = client.monthly_fee
  const subtotal = managementFee + monthlyFee
  const tax = subtotal * 0.20 // KDV %20
  const total = subtotal + tax
  
  // Fatura oluştur
  const invoiceNumber = `INV-${client.id}-${Date.now()}`
  
  await query(`
    INSERT INTO client_invoices
    (client_id, invoice_number, period_start, period_end, 
     ad_spend, management_fee, subtotal, tax, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
  `, [clientId, invoiceNumber, periodStart, periodEnd, 
      adSpend, managementFee, subtotal, tax, total])
  
  return NextResponse.json({
    success: true,
    invoice: {
      invoiceNumber,
      adSpend,
      managementFee,
      monthlyFee,
      subtotal,
      tax,
      total
    }
  })
}
```

---

## 📱 9. Client Portal (Opsiyonel)

### Müşteriye Özel Dashboard

```typescript
// app/portal/[clientToken]/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ClientPortal({ params }: { params: { clientToken: string } }) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Client token ile veri çek
    fetch(`/api/portal/${params.clientToken}`)
      .then(r => r.json())
      .then(setData)
  }, [params.clientToken])
  
  if (!data) return <div>Yükleniyor...</div>
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {data.client.company_name} - Dashboard
      </h1>
      
      {/* Metrikler */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Günlük Harcama"
          value={`₺${data.metrics.daily_spend}`}
          change="+12%"
        />
        <MetricCard 
          title="Dönüşüm"
          value={data.metrics.conversions}
          change="+8%"
        />
        <MetricCard 
          title="ROAS"
          value={`${data.metrics.roas}x`}
          change="+15%"
        />
        <MetricCard 
          title="CPA"
          value={`₺${data.metrics.cpa}`}
          change="-5%"
        />
      </div>
      
      {/* Grafikler */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Son 30 Gün Performans</h2>
        {/* Chart component */}
      </div>
      
      {/* Kampanyalar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Aktif Kampanyalar</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Kampanya</th>
              <th>Platform</th>
              <th>Harcama</th>
              <th>ROAS</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{campaign.platform}</td>
                <td>₺{campaign.spend}</td>
                <td>{campaign.roas}x</td>
                <td>{campaign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## 🚀 10. Hızlı Kurulum

### Adım 1: Database Setup
```bash
# MySQL'e bağlan ve tabloları oluştur
mysql -u root -p okandemir_org < client-schema.sql
```

### Adım 2: Environment Variables
```env
# Railway'e ekle
GROQ_API_KEY=gsk_xxxxx
GOOGLE_ADS_MCC_CUSTOMER_ID=123-456-7890
META_BUSINESS_MANAGER_ID=your-bm-id
N8N_WEBHOOK_URL=https://n8n.okandemir.org/webhook/multi-client
```

### Adım 3: İlk Müşteri Ekle
```bash
curl -X POST https://okandemir.org/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Müşteri",
    "email": "test@example.com",
    "phone": "+905551234567",
    "company_name": "Test AŞ",
    "package_type": "standard",
    "monthly_fee": 4500,
    "management_fee_percent": 15,
    "google_ads_customer_id": "123-456-7890",
    "meta_ad_account_id": "act_123456"
  }'
```

### Adım 4: n8n Workflow Aktive Et
```bash
# n8n'e gir
# "Multi-Client Daily Check" workflow'u import et
# Credentials ekle
# Active: ON
```

---

## 💰 11. Pricing Calculator

### Örnek Hesaplama

**Müşteri: ABC Şirketi**
- Paket: Standard
- Aylık Reklam Bütçesi: ₺20,000

```javascript
Reklam Harcaması:      ₺20,000
Yönetim Ücreti (%15):  ₺3,000
Aylık Abonelik:        ₺4,500
─────────────────────────────
TOPLAM:                ₺27,500

Müşteriye Giden Fatura: ₺27,500
Senin Gelirin:          ₺7,500 (sabit)
```

**20 Müşteri ile Aylık Gelir:**
- Ortalama reklam bütçesi: ₺15,000
- Ortalama yönetim + abonelik: ₺6,750
- **20 müşteri x ₺6,750 = ₺135,000/ay**

---

## 📊 12. Dashboard Özeti

```
┌─────────────────────────────────────────┐
│  Multi-Client Ajans Dashboard          │
├─────────────────────────────────────────┤
│  Aktif Müşteri: 20                     │
│  Toplam Aylık Bütçe: ₺300,000         │
│  Toplam Gelir (bu ay): ₺135,000       │
│  Ortalama ROAS: 4.2x                   │
│  Aktif Kampanya: 87                    │
└─────────────────────────────────────────┘

🟢 Mükemmel Performans: 14 müşteri
🟡 Dikkat Gerekli: 4 müşteri  
🔴 Kritik Durum: 2 müşteri
```

---

## ✅ Sonraki Adımlar

1. **Google Ads MCC hesabı** oluştur
2. **Meta Business Manager** setup
3. **Groq API key** al (ücretsiz)
4. **Database tabloları** oluştur
5. **API endpoints** deploy et
6. **n8n workflow** import et
7. **İlk 3 müşteri** ekle ve test et

Hazır mısın? 🚀

