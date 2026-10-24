/**
 * @jest-environment node
 */
const executeMock = jest.fn(async (..._args: unknown[]) => ({ affectedRows: 1, insertId: 0 }))
const queryOneMock = jest.fn(async (..._args: unknown[]): Promise<unknown> => undefined)

jest.mock('@/lib/mysql', () => ({
  __esModule: true,
  default: {},
  execute: (...a: unknown[]) => executeMock(...a),
  query: jest.fn(async () => []),
  queryOne: (...a: unknown[]) => queryOneMock(...a),
}))

import { MySqlAdapter } from '@/lib/auth/mysql-adapter'
import { sha256Hex } from '@/lib/security/secrets'

describe('MySqlAdapter', () => {
  beforeEach(() => {
    executeMock.mockClear()
    queryOneMock.mockClear()
  })

  it('oturum token’ını açık metin değil sha256 olarak yazar', async () => {
    const adapter = MySqlAdapter()
    await adapter.createSession!({ sessionToken: 'raw-session-token', userId: 'u1', expires: new Date() })
    const params = executeMock.mock.calls[0][1] as unknown[]
    expect(params).not.toContain('raw-session-token')
    expect(params).toContain(sha256Hex('raw-session-token'))
  })

  it('oturumu hash ile arar ve ham token’ı geri verir', async () => {
    queryOneMock.mockResolvedValueOnce({ user_id: 'u1', expires: new Date('2030-01-01'), id: 'u1', email: 'a@b.com', name: null })
    const res = await MySqlAdapter().getSessionAndUser!('raw')
    expect(queryOneMock.mock.calls[0][1]).toEqual([sha256Hex('raw')])
    expect(res?.session.sessionToken).toBe('raw')
    expect(res?.user.email).toBe('a@b.com')
  })

  it('e-postayı küçük harfe normalize eder; OAuth token’larını saklamaz', async () => {
    const adapter = MySqlAdapter()
    await adapter.createUser!({ id: 'u1', email: '  Okan@Example.COM ', emailVerified: null })
    expect((executeMock.mock.calls[0][1] as unknown[])[2]).toBe('okan@example.com')

    executeMock.mockClear()
    await adapter.linkAccount!({
      userId: 'u1',
      type: 'oidc',
      provider: 'google',
      providerAccountId: '123',
      access_token: 'ya29.SECRET',
      refresh_token: 'REFRESH',
      id_token: 'ID',
    })
    const sql = String(executeMock.mock.calls[0][0])
    const params = executeMock.mock.calls[0][1] as unknown[]
    expect(sql).not.toMatch(/access_token|refresh_token|id_token/)
    expect(params).not.toContain('ya29.SECRET')
  })
})
