-- Onaylar (payload hash + sürüm + süre), denetim kaydı ve DB tabanlı rate limit

CREATE TABLE IF NOT EXISTS ai_approvals (
  id CHAR(36) NOT NULL PRIMARY KEY,
  workspace_id CHAR(36) NOT NULL,
  task_id CHAR(36) NOT NULL,
  step_key VARCHAR(64) NOT NULL,
  action_type VARCHAR(64) NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  payload_version INT UNSIGNED NOT NULL DEFAULT 1,
  summary_json JSON NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'expired', 'consumed') NOT NULL DEFAULT 'pending',
  expires_at DATETIME(3) NOT NULL,
  approved_by CHAR(36) NULL,
  approved_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_approvals_version (task_id, step_key, payload_version),
  KEY idx_approvals_ws (workspace_id, status, expires_at),
  KEY idx_approvals_task (task_id, step_key),
  CONSTRAINT fk_approvals_task FOREIGN KEY (task_id) REFERENCES ai_tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_approvals_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- metadata_json sır içermez (lib/security/secrets.ts redact ile yazılır)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  workspace_id CHAR(36) NULL,
  actor_type ENUM('user', 'system', 'worker') NOT NULL,
  actor_id CHAR(36) NULL,
  action VARCHAR(64) NOT NULL,
  target_type VARCHAR(64) NOT NULL,
  target_id VARCHAR(64) NULL,
  outcome ENUM('ok', 'denied', 'error') NOT NULL,
  metadata_json JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_audit_ws (workspace_id, created_at),
  KEY idx_audit_action (action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sabit pencereli sayaç: bucket_key = '<kapsam>:<kimlik>', window_start = pencere başlangıcı (epoch sn)
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket_key VARCHAR(191) NOT NULL,
  window_start BIGINT UNSIGNED NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 0,
  expires_at DATETIME(3) NOT NULL,
  PRIMARY KEY (bucket_key, window_start),
  KEY idx_rate_limits_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
