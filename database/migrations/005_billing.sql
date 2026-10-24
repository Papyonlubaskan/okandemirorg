-- Kredi defteri (bakiye = SUM(delta)), ödeme sonrası claim linkleri, ücretsiz mini denetim

-- ref benzersiz: aynı işlem (görev ücreti, iade, aylık hibe, claim) iki kez yazılamaz
CREATE TABLE IF NOT EXISTS credit_ledger (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  workspace_id CHAR(36) NOT NULL,
  delta INT NOT NULL,
  reason ENUM('task', 'refund', 'plan_grant', 'claim', 'admin') NOT NULL,
  ref VARCHAR(128) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_ledger_ref (ref),
  KEY idx_ledger_ws (workspace_id, created_at),
  CONSTRAINT fk_ledger_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Token açık metin saklanmaz (sha256). Sipariş başına tek claim.
CREATE TABLE IF NOT EXISTS workspace_claims (
  id CHAR(36) NOT NULL PRIMARY KEY,
  token_hash CHAR(64) NOT NULL,
  order_code VARCHAR(32) NOT NULL,
  product_slug VARCHAR(120) NOT NULL,
  credits INT UNSIGNED NOT NULL,
  status ENUM('pending', 'claimed', 'expired') NOT NULL DEFAULT 'pending',
  claimed_workspace_id CHAR(36) NULL,
  claimed_at DATETIME(3) NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_claims_token (token_hash),
  UNIQUE KEY uq_claims_order (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Görevden düşülen kredi (iade için)
ALTER TABLE ai_tasks ADD COLUMN credits_charged INT UNSIGNED NOT NULL DEFAULT 0;

-- Ücretsiz mini denetim: URL başına 24 saat önbellek, istek kaydı (IP hash'li)
CREATE TABLE IF NOT EXISTS mini_audit_cache (
  url_hash CHAR(64) NOT NULL PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  result_json JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mini_audit_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  score TINYINT UNSIGNED NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_mini_email (email, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
