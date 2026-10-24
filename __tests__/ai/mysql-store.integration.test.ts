/**
 * @jest-environment node
 *
 * Gerçek MySQL'e karşı kuyruk SQL'i. Yalnızca ayrı bir TEST veritabanı ile çalıştırın:
 *   TEST_MYSQL_HOST=... TEST_MYSQL_USER=... TEST_MYSQL_PASSWORD=... TEST_MYSQL_DATABASE=okd_test npx jest mysql-store
 * Tanımlı değilse atlanır. ASLA canlı veritabanı adı vermeyin: tablolar oluşturulur ve test verisi yazılır.
 */
import { randomUUID } from 'crypto'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'

const enabled = Boolean(process.env.TEST_MYSQL_HOST && process.env.TEST_MYSQL_DATABASE)
const d = enabled ? describe : describe.skip

if (enabled) {
  process.env.MYSQL_HOST = process.env.TEST_MYSQL_HOST
  process.env.MYSQL_PORT = process.env.TEST_MYSQL_PORT || '3306'
  process.env.MYSQL_USER = process.env.TEST_MYSQL_USER
  process.env.MYSQL_PASSWORD = process.env.TEST_MYSQL_PASSWORD
  process.env.MYSQL_DATABASE = process.env.TEST_MYSQL_DATABASE
}

d('MysqlTaskStore (entegrasyon)', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mysql = require('@/lib/mysql') as typeof import('@/lib/mysql')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MysqlTaskStore } = require('@/lib/ai/store') as typeof import('@/lib/ai/store')
  const store = new MysqlTaskStore()
  const userId = randomUUID()
  const wsId = randomUUID()

  beforeAll(async () => {
    const dir = path.join(process.cwd(), 'database', 'migrations')
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
      const sql = readFileSync(path.join(dir, file), 'utf8')
        .split(/\r?\n/)
        .filter((l) => !l.trim().startsWith('--'))
        .join('\n')
      for (const stmt of sql.split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter(Boolean)) {
        await mysql.default.query(stmt)
      }
    }
    await mysql.execute('INSERT INTO users (id, email) VALUES (?, ?)', [userId, `${userId}@test.local`])
    await store.createWorkspace({ id: wsId, name: 'it', ownerUserId: userId })
  })

  afterAll(async () => {
    await mysql.execute('DELETE FROM workspaces WHERE id = ?', [wsId])
    await mysql.execute('DELETE FROM users WHERE id = ?', [userId])
    await mysql.default.end()
  })

  const newTask = (over: Record<string, unknown> = {}) => ({
    id: randomUUID(),
    workspaceId: wsId,
    createdBy: userId,
    taskType: 'echo.test',
    input: { message: 'x' },
    idempotencyKey: null as string | null,
    budgetUsd: 0.05,
    maxAttempts: 2,
    ...over,
  })

  it('idempotency anahtarı ikinci satır oluşturmaz', async () => {
    const key = `it-${randomUUID()}`
    const a = await store.createTask(newTask({ idempotencyKey: key }))
    const b = await store.createTask(newTask({ idempotencyKey: key }))
    expect(a.created).toBe(true)
    expect(b.created).toBe(false)
    expect(b.task.id).toBe(a.task.id)
  })

  it('eşzamanlı claim aynı görevi iki kez vermez', async () => {
    await store.createTask(newTask())
    const claims = await Promise.all(Array.from({ length: 5 }, () => store.claimNextTask(60_000)))
    const ids = claims.filter(Boolean).map((t) => t!.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('guarded transition yanlış lease ile başarısız, doğru lease ile başarılı', async () => {
    const { task } = await store.createTask(newTask())
    let claimed = await store.claimNextTask(60_000)
    while (claimed && claimed.id !== task.id) claimed = await store.claimNextTask(60_000)
    expect(claimed).not.toBeNull()
    expect(await store.transition(task.id, 'yanlis-lease', ['planning'], 'running')).toBe(false)
    expect(await store.transition(task.id, claimed!.leaseOwner, ['planning'], 'running')).toBe(true)
    expect(await store.transition(task.id, claimed!.leaseOwner, ['planning'], 'running')).toBe(false)
  })

  it('süresi dolan lease kurtarılır, deneme sınırında failed olur', async () => {
    const { task } = await store.createTask(newTask({ maxAttempts: 1 }))
    await mysql.execute(
      "UPDATE ai_tasks SET status = 'running', lease_owner = ?, lease_until = DATE_SUB(NOW(3), INTERVAL 1 SECOND) WHERE id = ?",
      [randomUUID(), task.id]
    )
    await store.recoverExpiredLeases()
    const t = await store.getTask(task.id, wsId)
    expect(t).toMatchObject({ status: 'failed', errorCode: 'lease_expired', attemptCount: 1 })
  })

  it('model çağrısı kaydı kullanım sayacını artırır', async () => {
    const model = `it-model-${randomUUID().slice(0, 8)}`
    await store.recordModelCall({ entryKey: 'x', provider: 'mock', model, purpose: 'plan', estimatedCost: 0.001, latencyMs: 5, status: 'ok', taskId: null, workspaceId: wsId })
    await store.recordModelCall({ entryKey: 'x', provider: 'mock', model, purpose: 'plan', estimatedCost: 0, latencyMs: 5, status: 'rate_limited', taskId: null, workspaceId: wsId })
    const snap = await store.getUsageSnapshot()
    expect(snap[`mock|${model}`]).toMatchObject({ requests: 2, exhausted: false })
    expect(await store.workspaceSpendThisMonth(wsId)).toBeGreaterThanOrEqual(0.001)
  })
})
