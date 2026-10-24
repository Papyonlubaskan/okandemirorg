#!/usr/bin/env node
/**
 * Sürümlü SQL migration runner — database/migrations/NNN_ad.sql
 *
 * Varsayılan: DRY-RUN (hiçbir şey yazmaz; bekleyen migration'ları listeler).
 *   npm run db:migrate
 * Uygulamak için hedef veritabanı adını açıkça onaylayın:
 *   npm run db:migrate -- --apply --confirm=<MYSQL_DATABASE>
 * Railway:  railway run npm run db:migrate -- --apply --confirm=railway
 *
 * Not: MySQL DDL otomatik commit eder; migration'lar IF NOT EXISTS ile tekrar çalıştırılabilir yazılır.
 * Uygulamadan önce mutlaka yedek alın.
 */
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'database', 'migrations')

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const confirm = args.find((a) => a.startsWith('--confirm='))?.split('=')[1]

export function splitStatements(sql) {
  const withoutComments = sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
  return withoutComments
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean)
}

async function loadMigrations() {
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => /^\d{3}_[a-z0-9_]+\.sql$/.test(f)).sort()
  return Promise.all(
    files.map(async (file) => {
      const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8')
      return {
        version: file.slice(0, 3),
        name: file,
        sql,
        checksum: createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex'),
      }
    })
  )
}

async function main() {
  const migrations = await loadMigrations()
  const hasDb = Boolean(process.env.MYSQL_HOST && process.env.MYSQL_DATABASE)

  if (!hasDb) {
    if (apply) {
      console.error('MYSQL_* değişkenleri tanımlı değil; uygulanamaz.')
      process.exit(1)
    }
    console.log('Veritabanı bağlantısı yok (offline dry-run). Dosyalar:')
    for (const m of migrations) {
      console.log(`  ${m.name}  (${splitStatements(m.sql).length} ifade, sha256 ${m.checksum.slice(0, 12)})`)
    }
    return
  }

  const mysql = (await import('mysql2/promise')).default
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  try {
    const [[{ version }]] = await conn.query('SELECT VERSION() AS version')
    const major = parseInt(String(version).split('.')[0], 10)
    console.log(`MySQL ${version} · veritabanı: ${process.env.MYSQL_DATABASE}`)
    console.log(`SKIP LOCKED desteği: ${major >= 8 ? 'var' : 'yok'} (kuyruk atomik UPDATE lease kullanır; ikisinde de çalışır)`)

    const [tables] = await conn.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schema_migrations'`,
      [process.env.MYSQL_DATABASE]
    )
    const applied = new Map()
    if (tables.length) {
      const [rows] = await conn.query('SELECT version, name, checksum FROM schema_migrations ORDER BY version')
      for (const r of rows) applied.set(r.version, r)
    }

    const pending = []
    for (const m of migrations) {
      const done = applied.get(m.version)
      if (!done) pending.push(m)
      else if (done.checksum !== m.checksum) {
        console.error(`HATA: ${m.name} uygulandıktan sonra değiştirilmiş (checksum farklı). Yeni bir migration yazın.`)
        process.exit(1)
      }
    }

    if (!pending.length) {
      console.log('Bekleyen migration yok.')
      return
    }

    console.log('Bekleyen migration\'lar:')
    for (const m of pending) console.log(`  ${m.name}  (${splitStatements(m.sql).length} ifade)`)

    if (!apply) {
      console.log('\nDRY-RUN: hiçbir değişiklik yapılmadı. Uygulamak için: --apply --confirm=<veritabanı adı>')
      return
    }
    if (confirm !== process.env.MYSQL_DATABASE) {
      console.error(`Onay eksik/yanlış. --confirm=${process.env.MYSQL_DATABASE} gerekli.`)
      process.exit(1)
    }

    await conn.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version CHAR(3) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      checksum CHAR(64) NOT NULL,
      applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    for (const m of pending) {
      console.log(`Uygulanıyor: ${m.name}`)
      for (const stmt of splitStatements(m.sql)) {
        await conn.query(stmt)
      }
      await conn.query('INSERT INTO schema_migrations (version, name, checksum) VALUES (?, ?, ?)', [
        m.version,
        m.name,
        m.checksum,
      ])
    }
    console.log('Tamam.')
  } finally {
    await conn.end()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Migration hatası:', err?.code || '', err?.sqlMessage || err?.message || err)
    process.exit(1)
  })
}
