import { lookup } from 'dns/promises'
import { isIP } from 'net'

export class SsrfError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SsrfError'
  }
}

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, p) => (acc << 8) + Number(p), 0) >>> 0
}

const BLOCKED_V4: Array<[string, number]> = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
]

export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip)
  if (version === 4) {
    const n = ipv4ToInt(ip)
    return BLOCKED_V4.some(([base, bits]) => {
      const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
      return (n & mask) === (ipv4ToInt(base) & mask)
    })
  }
  if (version === 6) {
    const v = ip.toLowerCase()
    if (v === '::' || v === '::1') return true
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isPrivateIp(mapped[1])
    return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v)
  }
  return true
}

/** URL'yi doğrular; yalnızca http/https, standart port ve herkese açık IP'lere izin verir */
export async function assertPublicUrl(
  input: string,
  resolver: (host: string) => Promise<string[]> = defaultResolver
): Promise<URL> {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new SsrfError('Geçersiz URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new SsrfError('Yalnızca http/https')
  if (url.username || url.password) throw new SsrfError('URL içinde kimlik bilgisi olamaz')
  if (url.port && url.port !== '80' && url.port !== '443') throw new SsrfError('Standart dışı port')

  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) {
    throw new SsrfError('İç ağ adresi')
  }

  const addresses = isIP(host) ? [host] : await resolver(host)
  if (addresses.length === 0) throw new SsrfError('Alan adı çözümlenemedi')
  if (addresses.some(isPrivateIp)) throw new SsrfError('İç ağ adresi')
  return url
}

async function defaultResolver(host: string): Promise<string[]> {
  try {
    const res = await lookup(host, { all: true, verbatim: true })
    return res.map((r) => r.address)
  } catch {
    return []
  }
}

/** Her yönlendirme adımında hedefi yeniden doğrulayan fetch */
export async function safeFetch(
  input: string,
  init: RequestInit & { maxRedirects?: number } = {}
): Promise<Response> {
  const { maxRedirects = 5, ...rest } = init
  let current = input
  for (let i = 0; i <= maxRedirects; i++) {
    const url = await assertPublicUrl(current)
    const res = await fetch(url, { ...rest, redirect: 'manual' })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, url).toString()
      continue
    }
    return res
  }
  throw new SsrfError('Çok fazla yönlendirme')
}
