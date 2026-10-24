import { randomUUID } from 'crypto'
import type { RowDataPacket } from 'mysql2/promise'
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters'
import { execute, query, queryOne } from '@/lib/mysql'
import { sha256Hex } from '@/lib/security/secrets'

/**
 * Auth.js için mysql2 adaptörü (database/migrations/001_auth.sql).
 * - Oturum token'ı açık metin saklanmaz (sha256).
 * - OAuth access/refresh/id token'ları saklanmaz: giriş için gerekmez.
 */

type Row = RowDataPacket & Record<string, unknown>

function toUser(r: Row): AdapterUser {
  return {
    id: String(r.id),
    name: (r.name as string) ?? null,
    email: String(r.email),
    emailVerified: (r.email_verified as Date) ?? null,
    image: (r.image as string) ?? null,
  }
}

const normEmail = (e: string) => e.trim().toLowerCase()

export function MySqlAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = user.id || randomUUID()
      await execute('INSERT INTO users (id, name, email, email_verified, image) VALUES (?, ?, ?, ?, ?)', [
        id,
        user.name ?? null,
        normEmail(user.email),
        user.emailVerified ?? null,
        user.image ?? null,
      ])
      return { ...user, id, email: normEmail(user.email) }
    },

    async getUser(id) {
      const r = await queryOne<Row>('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
      return r ? toUser(r) : null
    },

    async getUserByEmail(email) {
      const r = await queryOne<Row>('SELECT * FROM users WHERE email = ? LIMIT 1', [normEmail(email)])
      return r ? toUser(r) : null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const r = await queryOne<Row>(
        `SELECT u.* FROM accounts a JOIN users u ON u.id = a.user_id
         WHERE a.provider = ? AND a.provider_account_id = ? LIMIT 1`,
        [provider, providerAccountId]
      )
      return r ? toUser(r) : null
    },

    async updateUser(user) {
      const current = await queryOne<Row>('SELECT * FROM users WHERE id = ? LIMIT 1', [user.id])
      if (!current) throw new Error('Kullanıcı bulunamadı')
      const merged = { ...toUser(current), ...user }
      await execute('UPDATE users SET name = ?, email = ?, email_verified = ?, image = ? WHERE id = ?', [
        merged.name ?? null,
        normEmail(merged.email),
        merged.emailVerified ?? null,
        merged.image ?? null,
        user.id,
      ])
      return merged
    },

    async deleteUser(id) {
      await execute('DELETE FROM users WHERE id = ?', [id])
    },

    async linkAccount(account: AdapterAccount) {
      await execute(
        `INSERT INTO accounts (id, user_id, type, provider, provider_account_id) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE user_id = user_id`,
        [randomUUID(), account.userId, account.type, account.provider, account.providerAccountId]
      )
      return account
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await execute('DELETE FROM accounts WHERE provider = ? AND provider_account_id = ?', [provider, providerAccountId])
    },

    async createSession(session) {
      await execute('INSERT INTO sessions (id, session_token_hash, user_id, expires) VALUES (?, ?, ?, ?)', [
        randomUUID(),
        sha256Hex(session.sessionToken),
        session.userId,
        session.expires,
      ])
      return session
    },

    async getSessionAndUser(sessionToken) {
      const r = await queryOne<Row>(
        `SELECT s.user_id, s.expires, u.* FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.session_token_hash = ? LIMIT 1`,
        [sha256Hex(sessionToken)]
      )
      if (!r) return null
      const session: AdapterSession = { sessionToken, userId: String(r.user_id), expires: r.expires as Date }
      return { session, user: toUser(r) }
    },

    async updateSession(session) {
      if (session.expires) {
        await execute('UPDATE sessions SET expires = ? WHERE session_token_hash = ?', [session.expires, sha256Hex(session.sessionToken)])
      }
      const r = await queryOne<Row>('SELECT user_id, expires FROM sessions WHERE session_token_hash = ? LIMIT 1', [
        sha256Hex(session.sessionToken),
      ])
      return r ? { sessionToken: session.sessionToken, userId: String(r.user_id), expires: r.expires as Date } : null
    },

    async deleteSession(sessionToken) {
      await execute('DELETE FROM sessions WHERE session_token_hash = ?', [sha256Hex(sessionToken)])
    },

    async createVerificationToken(token: VerificationToken) {
      await execute('INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, ?)', [
        normEmail(token.identifier),
        token.token,
        token.expires,
      ])
      return token
    },

    async useVerificationToken({ identifier, token }) {
      const rows = await query<Row>('SELECT identifier, token, expires FROM verification_tokens WHERE identifier = ? AND token = ? LIMIT 1', [
        normEmail(identifier),
        token,
      ])
      if (!rows[0]) return null
      await execute('DELETE FROM verification_tokens WHERE identifier = ? AND token = ?', [normEmail(identifier), token])
      return { identifier: String(rows[0].identifier), token: String(rows[0].token), expires: rows[0].expires as Date }
    },
  }
}
