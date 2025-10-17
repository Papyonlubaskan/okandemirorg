'use client'

import { useEffect } from 'react'

export default function ConsoleErrorSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Suppress all console methods in production
      const noop = () => {}
      console.log = noop
      console.debug = noop
      console.info = noop
      console.warn = noop
      // Keep error for critical issues
      const originalError = console.error
      console.error = (...args: unknown[]) => {
        // Filter out known non-critical errors
        const message = args[0]?.toString() || ''
        const suppressPatterns = [
          'Image load',
          'Failed to load',
          'net::ERR',
          '404',
          'analytics',
          'Warning:',
        ]
        
        const shouldSuppress = suppressPatterns.some(pattern => 
          message.toLowerCase().includes(pattern.toLowerCase())
        )
        
        if (!shouldSuppress) {
          originalError.apply(console, args)
        }
      }
    }
  }, [])

  return null
}

