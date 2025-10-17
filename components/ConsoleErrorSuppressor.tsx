'use client'

import { useEffect } from 'react'

export default function ConsoleErrorSuppressor() {
  useEffect(() => {
    // Suppress third-party errors in both dev and production
    const originalError = console.error
    const originalWarn = console.warn
    
    // Third-party error patterns to suppress
    const suppressPatterns = [
      'ERR_BLOCKED_BY_CLIENT',
      'generate_204',
      'log_event',
      'logging_client_events',
      'graph.instagram.com',
      'youtube.com/youtubei',
      'play.google.com/log',
      'Permissions-Policy',
      'interest-cohort',
      'third-party cookies',
      'net::ERR_BLOCKED',
      'adsbygoogle',
      'doubleclick',
    ]
    
    console.error = (...args: unknown[]) => {
      const message = args[0]?.toString() || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      )
      
      if (!shouldSuppress) {
        originalError.apply(console, args)
      }
    }
    
    console.warn = (...args: unknown[]) => {
      const message = args[0]?.toString() || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      )
      
      if (!shouldSuppress) {
        originalWarn.apply(console, args)
      }
    }
    
    if (process.env.NODE_ENV === 'production') {
      // Additional production-only suppressions
      const noop = () => {}
      console.log = noop
      console.debug = noop
      console.info = noop
    }
  }, [])

  return null
}

