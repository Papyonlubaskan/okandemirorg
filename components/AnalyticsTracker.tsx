'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const sessionId = useRef<string>('')
  const startTime = useRef<number>(0)

  useEffect(() => {
    // Generate session ID if not exists
    if (!sessionId.current) {
      sessionId.current = 
        typeof window !== 'undefined' 
          ? sessionStorage.getItem('analytics_session_id') || generateSessionId()
          : generateSessionId()
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('analytics_session_id', sessionId.current)
      }
    }
  }, [])

  useEffect(() => {
    // Track page view
    trackEvent('page_view', pathname)
    startTime.current = Date.now()

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackEvent('scroll', pathname, { depth: '25%' })
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackEvent('scroll', pathname, { depth: '50%' })
      } else if (scrollPercent >= 75 && scrollPercent < 90) {
        trackEvent('scroll', pathname, { depth: '75%' })
      } else if (scrollPercent >= 90) {
        trackEvent('scroll', pathname, { depth: '90%' })
      }
    }

    // Track time on page on unload
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
      trackEvent('time_on_page', pathname, { seconds: timeSpent })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleUnload)
      
      // Track time on page when component unmounts
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
      trackEvent('time_on_page', pathname, { seconds: timeSpent })
    }
  }, [pathname])

  const trackEvent = async (
    eventType: string,
    page: string,
    eventData?: Record<string, unknown>
  ) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          page,
          sessionId: sessionId.current,
          eventData,
        }),
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  return null
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

