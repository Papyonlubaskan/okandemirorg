'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'scale-in' | 'scale-up' | 'rotate-in'
  delay?: number
  threshold?: number
  className?: string
}

export default function ScrollReveal({
  children,
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold, triggerOnce: true })

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

