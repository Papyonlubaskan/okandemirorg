-- AI landing taslakları. Yayın yalnızca onaylı `landing.publish` görevi ile (content_hash eşleşmeli).

CREATE TABLE IF NOT EXISTS site_drafts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  workspace_id CHAR(36) NOT NULL,
  task_id CHAR(36) NULL,
  slug VARCHAR(80) NOT NULL,
  title VARCHAR(255) NOT NULL,
  html MEDIUMTEXT NOT NULL,
  content_hash CHAR(64) NOT NULL,
  status ENUM('draft', 'published', 'unpublished') NOT NULL DEFAULT 'draft',
  published_hash CHAR(64) NULL,
  published_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_drafts_slug (slug),
  UNIQUE KEY uq_drafts_task (task_id),
  KEY idx_drafts_ws (workspace_id, created_at),
  CONSTRAINT fk_drafts_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
