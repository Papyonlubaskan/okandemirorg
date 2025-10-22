import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (classNames merge)', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('handles falsy values', () => {
      const result = cn('base-class', false, null, undefined)
      expect(result).toBe('base-class')
    })

    it('overrides conflicting Tailwind classes', () => {
      // tailwind-merge should keep the last class
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })
  })
})

