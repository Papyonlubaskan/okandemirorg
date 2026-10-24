/**
 * @jest-environment node
 */
import { getToolRegistry } from '@/lib/agents/registry'
import { validatePlan } from '@/lib/agents/validate-plan'

const registry = getToolRegistry()
const opts = { registry, allowedTools: ['echo.test', 'seo.audit'] }
const errorsOf = (r: ReturnType<typeof validatePlan>) => ('errors' in r ? r.errors : [])

describe('validatePlan', () => {
  it('geçerli planı kabul eder (```json bloğu dahil)', () => {
    const raw = '```json\n{"version":1,"taskType":"auto","steps":[{"key":"a","tool":"seo.audit","input":{"url":"example.com"}}]}\n```'
    const r = validatePlan(raw, opts)
    expect(r.ok).toBe(true)
  })

  it('JSON olmayan çıktıyı reddeder', () => {
    expect(validatePlan('rm -rf /', opts)).toEqual({ ok: false, errors: ['Plan JSON olarak ayrıştırılamadı'] })
  })

  it('izin listesinde olmayan aracı reddeder', () => {
    const r = validatePlan({ version: 1, taskType: 'auto', steps: [{ key: 'x', tool: 'shell.exec', input: { cmd: 'ls' } }] }, opts)
    expect(r.ok).toBe(false)
    expect(errorsOf(r)[0]).toContain('izin listesinde değil')
  })

  it('kayıtlı ama görev türüne izinli olmayan aracı reddeder', () => {
    const r = validatePlan(
      { version: 1, taskType: 'echo.test', steps: [{ key: 'x', tool: 'seo.audit', input: { url: 'a.com' } }] },
      { registry, allowedTools: ['echo.test'] }
    )
    expect(r.ok).toBe(false)
  })

  it('araç girdi şemasına uymayan adımı reddeder', () => {
    const r = validatePlan({ version: 1, taskType: 'auto', steps: [{ key: 'x', tool: 'echo.test', input: { message: '', extra: 1 } }] }, opts)
    expect(r.ok).toBe(false)
  })

  it('adım sınırını ve tekrar eden anahtarı reddeder', () => {
    const step = { key: 'a', tool: 'echo.test', input: { message: 'hi' } }
    const r = validatePlan({ version: 1, taskType: 'auto', steps: [step, step, step, step] }, opts)
    expect(r.ok).toBe(false)
    expect(errorsOf(r).some((e) => e.includes('En fazla'))).toBe(true)
    expect(errorsOf(r).some((e) => e.includes('tekrar'))).toBe(true)
  })

  it('ek alanları (ör. sql) reddeder', () => {
    const r = validatePlan({ version: 1, taskType: 'auto', sql: 'DROP TABLE users', steps: [{ key: 'a', tool: 'echo.test', input: { message: 'x' } }] }, opts)
    expect(r.ok).toBe(false)
  })
})
