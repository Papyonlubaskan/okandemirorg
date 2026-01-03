-- ============================================
-- Multi-Client Ajans Database Schema
-- Okan Demir Digital Marketing Agency
-- ============================================

-- Müşteriler tablosu
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Temel Bilgiler
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  tax_number VARCHAR(50),
  tax_office VARCHAR(100),
  address TEXT,
  
  -- Google Ads
  google_ads_customer_id VARCHAR(50),
  google_ads_enabled BOOLEAN DEFAULT false,
  
  -- Meta Ads
  meta_ad_account_id VARCHAR(100),
  meta_business_id VARCHAR(100),
  meta_ads_enabled BOOLEAN DEFAULT false,
  
  -- LinkedIn Ads (opsiyonel)
  linkedin_ad_account_id VARCHAR(100),
  linkedin_ads_enabled BOOLEAN DEFAULT false,
  
  -- Paket ve Fiyatlandırma
  package_type ENUM('basic', 'standard', 'premium', 'custom') DEFAULT 'standard',
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  management_fee_percent DECIMAL(5,2) DEFAULT 15.00,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  setup_fee_paid BOOLEAN DEFAULT false,
  
  -- Bütçe Limitleri
  daily_budget_limit DECIMAL(10,2),
  monthly_budget_limit DECIMAL(10,2),
  
  -- Hedefler
  target_roas DECIMAL(5,2) DEFAULT 3.00,
  target_cpa DECIMAL(10,2),
  target_ctr DECIMAL(5,2),
  
  -- Bildirimler
  alert_email VARCHAR(255),
  alert_phone VARCHAR(20),
  alert_whatsapp VARCHAR(20),
  alert_enabled BOOLEAN DEFAULT true,
  
  -- Raporlama
  report_frequency ENUM('daily', 'weekly', 'bi-weekly', 'monthly') DEFAULT 'weekly',
  report_day VARCHAR(20) DEFAULT 'Monday',
  report_time VARCHAR(10) DEFAULT '09:00',
  report_recipients TEXT, -- JSON array of emails
  
  -- Portal Access
  portal_enabled BOOLEAN DEFAULT true,
  portal_token VARCHAR(100) UNIQUE,
  
  -- Durum
  status ENUM('active', 'paused', 'cancelled', 'pending') DEFAULT 'pending',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_date DATE,
  
  -- Notlar
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  
  -- Indexes
  UNIQUE KEY unique_email (email),
  UNIQUE KEY unique_portal_token (portal_token),
  INDEX idx_status (status),
  INDEX idx_package (package_type),
  INDEX idx_google_customer (google_ads_customer_id),
  INDEX idx_meta_account (meta_ad_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Müşteri Kampanya Metrikleri
-- ============================================
CREATE TABLE IF NOT EXISTS client_campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  platform VARCHAR(50) NOT NULL, -- 'google_ads', 'meta_ads', 'linkedin_ads'
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  campaign_status VARCHAR(50),
  
  -- Temel Metrikler
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Hesaplanan Metrikler
  ctr DECIMAL(5,2) DEFAULT 0, -- Click-through rate
  cpc DECIMAL(5,2) DEFAULT 0, -- Cost per click
  cpa DECIMAL(10,2) DEFAULT 0, -- Cost per acquisition
  roas DECIMAL(5,2) DEFAULT 0, -- Return on ad spend
  roi DECIMAL(5,2) DEFAULT 0, -- Return on investment
  
  -- Ek Metrikler
  reach INT DEFAULT 0,
  frequency DECIMAL(5,2) DEFAULT 0,
  video_views INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Tarih
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client_date (client_id, date),
  INDEX idx_platform (platform),
  INDEX idx_campaign (campaign_id),
  UNIQUE KEY unique_metric (client_id, platform, campaign_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Müşteri Faturaları
-- ============================================
CREATE TABLE IF NOT EXISTS client_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Maliyetler
  ad_spend DECIMAL(10,2) DEFAULT 0,
  management_fee DECIMAL(10,2) DEFAULT 0,
  monthly_subscription_fee DECIMAL(10,2) DEFAULT 0,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  additional_fees DECIMAL(10,2) DEFAULT 0,
  additional_fees_description TEXT,
  
  -- Toplam
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  discount_reason VARCHAR(255),
  tax_rate DECIMAL(5,2) DEFAULT 20.00, -- KDV %20
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  currency VARCHAR(10) DEFAULT 'TRY',
  
  -- Durum
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  issued_date DATE,
  due_date DATE,
  paid_date DATE,
  payment_method VARCHAR(50),
  
  -- Notlar
  notes TEXT,
  internal_notes TEXT,
  
  -- PDF
  pdf_url VARCHAR(500),
  pdf_generated_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_status (status),
  INDEX idx_period (period_start, period_end),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Müşteri Events/Aksiyonlar
-- ============================================
CREATE TABLE IF NOT EXISTS client_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  event_type ENUM(
    'campaign_paused',
    'campaign_started', 
    'budget_alert',
    'budget_exceeded',
    'low_performance',
    'high_performance',
    'goal_achieved',
    'report_sent',
    'invoice_sent',
    'payment_received',
    'client_complaint',
    'meeting_scheduled',
    'optimization_applied',
    'other'
  ) NOT NULL,
  
  severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- İlgili veri
  related_campaign_id VARCHAR(255),
  related_platform VARCHAR(50),
  related_invoice_id INT,
  metadata JSON,
  
  -- Aksiyon
  action_required BOOLEAN DEFAULT false,
  action_taken BOOLEAN DEFAULT false,
  action_notes TEXT,
  action_taken_by VARCHAR(100),
  action_taken_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (related_invoice_id) REFERENCES client_invoices(id) ON DELETE SET NULL,
  INDEX idx_client_date (client_id, created_at),
  INDEX idx_event_type (event_type),
  INDEX idx_severity (severity),
  INDEX idx_action_required (action_required)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Müşteri Notları
-- ============================================
CREATE TABLE IF NOT EXISTS client_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  note_type ENUM('general', 'call', 'meeting', 'email', 'complaint', 'optimization') DEFAULT 'general',
  subject VARCHAR(255),
  content TEXT NOT NULL,
  
  created_by VARCHAR(100), -- Admin user name
  is_internal BOOLEAN DEFAULT false, -- Internal note (not shown to client)
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_type (note_type),
  INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AI Analiz Sonuçları (Groq)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  analysis_type ENUM('daily_check', 'weekly_report', 'optimization', 'alert') DEFAULT 'daily_check',
  
  -- Input
  input_data JSON NOT NULL,
  
  -- Output
  analysis_result TEXT NOT NULL,
  recommendations JSON,
  
  -- AI Model Info
  ai_provider VARCHAR(50) DEFAULT 'groq',
  ai_model VARCHAR(100) DEFAULT 'llama-3.1-70b-versatile',
  tokens_used INT,
  
  -- Actions
  actions_suggested JSON,
  actions_taken JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client_date (client_id, created_at),
  INDEX idx_type (analysis_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Hedef Kitle Segmentleri
-- ============================================
CREATE TABLE IF NOT EXISTS audience_segments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  
  platform VARCHAR(50) NOT NULL,
  segment_id VARCHAR(255) NOT NULL, -- Platform-specific ID
  segment_name VARCHAR(255) NOT NULL,
  segment_type VARCHAR(100), -- 'lookalike', 'custom', 'interest', etc.
  
  size INT DEFAULT 0,
  
  -- Performance
  total_spend DECIMAL(10,2) DEFAULT 0,
  total_conversions INT DEFAULT 0,
  avg_roas DECIMAL(5,2) DEFAULT 0,
  avg_cpa DECIMAL(10,2) DEFAULT 0,
  
  status ENUM('active', 'paused', 'deleted') DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_platform (platform),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- İlk Örnek Veri
-- ============================================

-- Örnek müşteri 1
INSERT INTO clients (
  name, email, phone, company_name,
  package_type, monthly_fee, management_fee_percent,
  google_ads_customer_id, google_ads_enabled,
  meta_ad_account_id, meta_ads_enabled,
  target_roas, daily_budget_limit, monthly_budget_limit,
  status, onboarding_completed,
  portal_token
) VALUES (
  'Ahmet Yılmaz',
  'ahmet@example.com',
  '+905551234567',
  'ABC Teknoloji AŞ',
  'standard',
  4500.00,
  15.00,
  '123-456-7890',
  true,
  'act_123456789',
  true,
  3.00,
  1000.00,
  30000.00,
  'active',
  true,
  UUID()
);

-- Örnek müşteri 2
INSERT INTO clients (
  name, email, phone, company_name,
  package_type, monthly_fee, management_fee_percent,
  google_ads_enabled,
  meta_ad_account_id, meta_ads_enabled,
  target_roas, daily_budget_limit, monthly_budget_limit,
  status, onboarding_completed,
  portal_token
) VALUES (
  'Ayşe Demir',
  'ayse@example.com',
  '+905559876543',
  'XYZ E-ticaret',
  'premium',
  8000.00,
  12.00,
  false,
  'act_987654321',
  true,
  4.00,
  2000.00,
  60000.00,
  'active',
  true,
  UUID()
);

-- ============================================
-- Useful Views
-- ============================================

-- Client Dashboard View
CREATE OR REPLACE VIEW client_dashboard AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.company_name,
  c.package_type,
  c.status,
  
  -- Today's metrics
  SUM(CASE WHEN ccm.date = CURDATE() THEN ccm.spend ELSE 0 END) as today_spend,
  SUM(CASE WHEN ccm.date = CURDATE() THEN ccm.conversions ELSE 0 END) as today_conversions,
  AVG(CASE WHEN ccm.date = CURDATE() THEN ccm.roas ELSE NULL END) as today_roas,
  
  -- This month's metrics
  SUM(CASE WHEN MONTH(ccm.date) = MONTH(CURDATE()) THEN ccm.spend ELSE 0 END) as month_spend,
  SUM(CASE WHEN MONTH(ccm.date) = MONTH(CURDATE()) THEN ccm.conversions ELSE 0 END) as month_conversions,
  
  -- Campaign count
  COUNT(DISTINCT ccm.campaign_id) as active_campaigns,
  
  -- Budget usage
  c.monthly_budget_limit,
  ROUND((SUM(CASE WHEN MONTH(ccm.date) = MONTH(CURDATE()) THEN ccm.spend ELSE 0 END) / c.monthly_budget_limit * 100), 2) as budget_usage_percent
  
FROM clients c
LEFT JOIN client_campaign_metrics ccm ON c.id = ccm.client_id 
  AND ccm.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
WHERE c.status = 'active'
GROUP BY c.id;

-- ============================================
-- Indexes for Performance
-- ============================================

-- Add composite indexes for common queries
CREATE INDEX idx_metrics_client_platform_date ON client_campaign_metrics(client_id, platform, date);
CREATE INDEX idx_events_client_type_date ON client_events(client_id, event_type, created_at);
CREATE INDEX idx_invoices_client_status_date ON client_invoices(client_id, status, due_date);

-- ============================================
-- Completed
-- ============================================
SELECT 'Database schema created successfully!' as message;

