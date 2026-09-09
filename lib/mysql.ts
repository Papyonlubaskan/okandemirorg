import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise'

export type QueryParam = string | number | boolean | null | Date | Buffer

// MySQL bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Bağlantıyı test et
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ MySQL bağlantısı başarılı!')
    }
    connection.release()
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ MySQL bağlantı hatası:', error)
    }
    return false
  }
}

// Tabloları oluştur
export async function createTables() {
  try {
    const connection = await pool.getConnection()
    
    // Contact submissions tablosu
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        subject VARCHAR(500),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // n8n - Campaign Metrics tablosu
    await connection.execute(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_platform (platform),
        INDEX idx_campaign (campaign_id),
        INDEX idx_campaign_date (campaign_id, date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // n8n - Audience Performance tablosu
    await connection.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        status ENUM('active', 'unsubscribed') DEFAULT 'active',
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS digital_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(32) NOT NULL UNIQUE,
        access_token VARCHAR(64) NOT NULL UNIQUE,
        product_slug VARCHAR(120) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        amount_try DECIMAL(10,2) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        status ENUM('pending_payment', 'paid', 'cancelled') DEFAULT 'pending_payment',
        notes TEXT,
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_email (customer_email),
        INDEX idx_product (product_slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company_name VARCHAR(255),
        package_type ENUM('basic', 'standard', 'premium', 'custom') DEFAULT 'standard',
        monthly_budget_limit DECIMAL(10,2),
        target_roas DECIMAL(5,2) DEFAULT 3.00,
        status ENUM('active', 'paused', 'cancelled', 'pending') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS client_campaign_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        campaign_id VARCHAR(255),
        campaign_name VARCHAR(255),
        impressions INT DEFAULT 0,
        clicks INT DEFAULT 0,
        conversions INT DEFAULT 0,
        spend DECIMAL(10,2) DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        ctr DECIMAL(5,2) DEFAULT 0,
        cpc DECIMAL(5,2) DEFAULT 0,
        cpa DECIMAL(10,2) DEFAULT 0,
        roas DECIMAL(5,2) DEFAULT 0,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        INDEX idx_client_date (client_id, date),
        INDEX idx_platform (platform)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // n8n - Workflow Logs tablosu (opsiyonel)
    await connection.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Tablolar oluşturuldu! (contact_submissions, campaign_metrics, audience_performance, n8n_workflow_logs)')
    }
    connection.release()
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Tablo oluşturma hatası:', error)
    }
    return false
  }
}

export async function query<T = RowDataPacket>(
  sql: string,
  params?: QueryParam[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('MySQL query error:', error)
    throw error
  }
}

export async function queryOne<T = RowDataPacket>(
  sql: string,
  params?: QueryParam[]
): Promise<T | undefined> {
  const rows = await query<T>(sql, params)
  return rows[0]
}

export async function execute(
  sql: string,
  params?: QueryParam[]
): Promise<ResultSetHeader> {
  try {
    const [result] = await pool.execute<ResultSetHeader>(sql, params)
    return result
  } catch (error) {
    console.error('MySQL execute error:', error)
    throw error
  }
}

export default pool
