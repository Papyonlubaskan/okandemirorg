-- AI orkestratör: görevler, adımlar, model çağrıları, sağlayıcı kullanımı

CREATE TABLE IF NOT EXISTS ai_tasks (
  id CHAR(36) NOT NULL PRIMARY KEY,
  workspace_id CHAR(36) NOT NULL,
  created_by CHAR(36) NULL,
  task_type VARCHAR(64) NOT NULL,
  status ENUM('queued', 'planning', 'running', 'awaiting_approval', 'retry_wait',
              'succeeded', 'failed', 'cancelled', 'expired') NOT NULL DEFAULT 'queued',
  input_json JSON NOT NULL,
  plan_json JSON NULL,
  result_json JSON NULL,
  error_code VARCHAR(64) NULL,
  error_message VARCHAR(1000) NULL,
  attempt_count INT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts INT UNSIGNED NOT NULL DEFAULT 3,
  idempotency_key VARCHAR(128) NULL,
  lease_owner CHAR(36) NULL,
  lease_until DATETIME(3) NULL,
  next_run_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  budget_usd DECIMAL(10,6) NOT NULL DEFAULT 0.050000,
  cost_usd DECIMAL(12,6) NOT NULL DEFAULT 0,
  model_calls INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  started_at DATETIME(3) NULL,
  finished_at DATETIME(3) NULL,
  UNIQUE KEY uq_ai_tasks_idem (workspace_id, idempotency_key),
  KEY idx_ai_tasks_ws_status (workspace_id, status, created_at),
  KEY idx_ai_tasks_queue (status, next_run_at),
  KEY idx_ai_tasks_lease (status, lease_until),
  CONSTRAINT fk_ai_tasks_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_task_steps (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id CHAR(36) NOT NULL,
  step_key VARCHAR(64) NOT NULL,
  agent_type VARCHAR(64) NOT NULL,
  tool VARCHAR(64) NOT NULL,
  status ENUM('pending', 'running', 'succeeded', 'failed', 'skipped', 'awaiting_approval') NOT NULL DEFAULT 'pending',
  input_json JSON NULL,
  output_json JSON NULL,
  error_code VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  started_at DATETIME(3) NULL,
  finished_at DATETIME(3) NULL,
  UNIQUE KEY uq_steps_task_key (task_id, step_key),
  KEY idx_steps_task_status (task_id, status),
  CONSTRAINT fk_steps_task FOREIGN KEY (task_id) REFERENCES ai_tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_model_calls (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id CHAR(36) NULL,
  workspace_id CHAR(36) NULL,
  provider VARCHAR(32) NOT NULL,
  model VARCHAR(128) NOT NULL,
  purpose VARCHAR(64) NOT NULL,
  input_tokens INT UNSIGNED NULL,
  output_tokens INT UNSIGNED NULL,
  estimated_cost DECIMAL(12,6) NOT NULL DEFAULT 0,
  latency_ms INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('ok', 'error', 'timeout', 'rate_limited', 'skipped') NOT NULL,
  error_code VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_calls_task (task_id, created_at),
  KEY idx_calls_ws (workspace_id, created_at),
  KEY idx_calls_provider (provider, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Günlük sayaç (period = YYYY-MM-DD, UTC). Kota bilinmiyorsa quota_status = 'unknown'
CREATE TABLE IF NOT EXISTS provider_usage (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  model VARCHAR(128) NOT NULL,
  period CHAR(10) NOT NULL,
  request_count INT UNSIGNED NOT NULL DEFAULT 0,
  error_count INT UNSIGNED NOT NULL DEFAULT 0,
  rate_limited_count INT UNSIGNED NOT NULL DEFAULT 0,
  input_tokens BIGINT UNSIGNED NOT NULL DEFAULT 0,
  output_tokens BIGINT UNSIGNED NOT NULL DEFAULT 0,
  estimated_cost DECIMAL(12,6) NOT NULL DEFAULT 0,
  quota_status ENUM('known', 'unknown', 'exhausted') NOT NULL DEFAULT 'unknown',
  quota_limit INT UNSIGNED NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_usage (provider, model, period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
