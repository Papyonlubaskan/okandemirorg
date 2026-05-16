import { calculateAge, OKAN_BIRTH_DATE } from '@/lib/profile'

describe('calculateAge', () => {
  it('doğum gününden sonra yaşı artırır', () => {
    expect(calculateAge(OKAN_BIRTH_DATE, new Date('2026-03-08'))).toBe(33)
  })

  it('doğum gününden önce bir yaş eksik gösterir', () => {
    expect(calculateAge(OKAN_BIRTH_DATE, new Date('2026-03-06'))).toBe(32)
  })

  it('doğum gününde doğru yaşı verir', () => {
    expect(calculateAge(OKAN_BIRTH_DATE, new Date('2026-03-07'))).toBe(33)
  })
})
