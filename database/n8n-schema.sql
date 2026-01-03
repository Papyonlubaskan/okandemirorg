-- ==========================================
-- n8n Dijital Pazarlama Otomasyon
-- Database Schema
-- ==========================================

-- Kampanya Metrikleri Tablosu
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL COMMENT 'google_ads, meta_ads, linkedin_ads',
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255) NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0 COMMENT 'Click-Through Rate',
  cpc DECIMAL(5,2) DEFAULT 0 COMMENT 'Cost Per Click',
  cpa DECIMAL(5,2) DEFAULT 0 COMMENT 'Cost Per Acquisition',
  roas DECIMAL(5,2) DEFAULT 0 COMMENT 'Return On Ad Spend',
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_platform (platform),
  INDEX idx_campaign (campaign_id),
  INDEX idx_campaign_date (campaign_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hedef Kitle Performans Tablosu
CREATE TABLE IF NOT EXISTS audience_performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  audience_id VARCHAR(255) NOT NULL,
  audience_name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL COMMENT 'google_ads, meta_ads',
  size INT DEFAULT 0 COMMENT 'Audience size',
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(5,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_audience (audience_id),
  INDEX idx_platform_date (platform, date),
  INDEX idx_audience_date (audience_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- n8n Workflow Execution Logs (Opsiyonel - debug için)
CREATE TABLE IF NOT EXISTS n8n_workflow_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_name VARCHAR(255),
  execution_id VARCHAR(255),
  status ENUM('success', 'error', 'running') DEFAULT 'running',
  action VARCHAR(100),
  platform VARCHAR(50),
  message TEXT,
  error_details TEXT,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_workflow (workflow_name),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



