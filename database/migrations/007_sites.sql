-- Site oluşturucu: siteler, sürümler (şema JSON), formlardan gelen adaylar; plan bitiş tarihi

CREATE TABLE IF NOT EXISTS sites (
  id CHAR(36) NOT NULL PRIMARY KEY,
  workspace_id CHAR(36) NOT NULL,
  created_task_id CHAR(36) NULL,
  slug VARCHAR(60) NOT NULL,
  name VARCHAR(120) NOT NULL,
  status ENUM('draft', 'published', 'suspended') NOT NULL DEFAULT 'draft',
  current_version INT UNSIGNED NOT NULL DEFAULT 0,
  published_version INT UNSIGNED NULL,
  published_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_sites_slug (slug),
  UNIQUE KEY uq_sites_task (created_task_id),
  KEY idx_sites_ws (workspace_id, created_at),
  CONSTRAINT fk_sites_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_versions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id CHAR(36) NOT NULL,
  version INT UNSIGNED NOT NULL,
  schema_json JSON NOT NULL,
  content_hash CHAR(64) NOT NULL,
  source ENUM('ai', 'template', 'manual') NOT NULL,
  task_id CHAR(36) NULL,
  created_by CHAR(36) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_site_versions (site_id, version),
  UNIQUE KEY uq_site_versions_task (task_id),
  CONSTRAINT fk_site_versions_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id CHAR(36) NOT NULL,
  workspace_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NULL,
  email VARCHAR(120) NULL,
  message VARCHAR(1000) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_leads_ws (workspace_id, created_at),
  KEY idx_leads_site (site_id, created_at),
  CONSTRAINT fk_leads_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE workspaces ADD COLUMN plan_expires_at DATETIME(3) NULL;
