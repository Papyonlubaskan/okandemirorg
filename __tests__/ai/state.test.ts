/**
 * @jest-environment node
 */
import { assertTransition, canTransition, InvalidTransitionError, isTerminal, sourcesFor } from '@/lib/agents/state'

describe('görev durum makinesi', () => {
  it('mutlu yol geçişlerine izin verir', () => {
    expect(canTransition('queued', 'planning')).toBe(true)
    expect(canTransition('planning', 'running')).toBe(true)
    expect(canTransition('running', 'succeeded')).toBe(true)
    expect(canTransition('running', 'awaiting_approval')).toBe(true)
    expect(canTransition('awaiting_approval', 'queued')).toBe(true)
    expect(canTransition('retry_wait', 'queued')).toBe(true)
  })

  it('terminal durumlardan çıkışa izin vermez', () => {
    for (const s of ['succeeded', 'failed', 'cancelled', 'expired'] as const) {
      expect(isTerminal(s)).toBe(true)
      expect(canTransition(s, 'queued')).toBe(false)
    }
  })

  it('atlamalı geçişi reddeder', () => {
    expect(canTransition('queued', 'succeeded')).toBe(false)
    expect(() => assertTransition('queued', 'running')).toThrow(InvalidTransitionError)
  })

  it('kaynak durumları hesaplar', () => {
    expect(sourcesFor('succeeded')).toEqual(['running'])
    expect(sourcesFor('planning')).toEqual(['queued'])
  })
})
