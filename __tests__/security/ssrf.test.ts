/**
 * @jest-environment node
 */
import { assertPublicUrl, isPrivateIp, SsrfError } from '@/lib/security/ssrf'

describe('isPrivateIp', () => {
  it.each(['127.0.0.1', '10.1.2.3', '172.20.0.1', '192.168.1.1', '169.254.169.254', '0.0.0.0', '::1', 'fd00::1', '::ffff:127.0.0.1'])(
    '%s özel kabul edilir',
    (ip) => expect(isPrivateIp(ip)).toBe(true)
  )

  it.each(['8.8.8.8', '1.1.1.1', '2606:4700::1111'])('%s herkese açık', (ip) => {
    expect(isPrivateIp(ip)).toBe(false)
  })
})

describe('assertPublicUrl', () => {
  const publicResolver = async () => ['93.184.216.34']
  const privateResolver = async () => ['10.0.0.5']

  it('herkese açık alan adına izin verir', async () => {
    const url = await assertPublicUrl('https://example.com/a', publicResolver)
    expect(url.hostname).toBe('example.com')
  })

  it.each([
    'file:///etc/passwd',
    'http://localhost/',
    'http://127.0.0.1/',
    'http://169.254.169.254/latest/meta-data',
    'http://user:pass@example.com/',
    'http://example.com:8080/',
  ])('%s reddedilir', async (u) => {
    await expect(assertPublicUrl(u, publicResolver)).rejects.toBeInstanceOf(SsrfError)
  })

  it('özel IP’ye çözümlenen alan adını reddeder', async () => {
    await expect(assertPublicUrl('https://evil.example', privateResolver)).rejects.toBeInstanceOf(SsrfError)
  })
})
