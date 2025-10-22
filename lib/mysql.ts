import mysql from 'mysql2/promise'

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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Tablolar oluşturuldu!')
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

// Query helper function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('MySQL query error:', error)
    throw error
  }
}

export default pool
