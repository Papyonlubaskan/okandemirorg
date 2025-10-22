'use client'

import { useEffect, useState } from 'react'

export function useParallax() {
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset
      setScrollOffset(offset)
      
      // CSS custom property olarak scroll offset'i set et
      document.documentElement.style.setProperty('--scroll-offset', `${offset}px`)
    }

    // İlk scroll değerini set et
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollOffset
}
