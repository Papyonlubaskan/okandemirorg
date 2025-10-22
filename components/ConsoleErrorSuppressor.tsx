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
      'www.youtube.com/generate_204',
      'www.youtube.com/youtubei/v1/log_event',
      'play.google.com/log?hasfast=true',
      'graph.instagram.com/logging_client_events',
      'www-embed-player.js',
      'base.js',
      '1255-34e899e36864ed0b.js',
      'eeEcOf6enZ4',
      'db_RQLQYjko.js',
      'nYrc6pjurGU.js',
      'ublock-filters',
      'setTimeout',
      'apply @ ublock-filters',
    ]
    
    console.error = (...args: unknown[]) => {
      const message = args[0]?.toString() || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      ) || args.some(arg => 
        typeof arg === 'string' && suppressPatterns.some(pattern => 
          arg.toLowerCase().includes(pattern.toLowerCase())
        )
      )
      
      if (!shouldSuppress) {
        originalError.apply(console, args)
      }
    }
    
    console.warn = (...args: unknown[]) => {
      const message = args[0]?.toString() || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      ) || args.some(arg => 
        typeof arg === 'string' && suppressPatterns.some(pattern => 
          arg.toLowerCase().includes(pattern.toLowerCase())
        )
      )
      
      if (!shouldSuppress) {
        originalWarn.apply(console, args)
      }
    }
    
    // Disable ALL console methods in production and development
    const noop = () => {}
    console.log = noop
    console.debug = noop
    console.info = noop
    console.table = noop
    console.trace = noop
    console.time = noop
    console.timeEnd = noop
    console.count = noop
    console.clear = noop
    console.group = noop
    console.groupEnd = noop
    console.groupCollapsed = noop
    console.assert = noop
    
    // Production'da console.error ve console.warn da kapalı
    if (process.env.NODE_ENV === 'production') {
      console.error = noop
      console.warn = noop
    }
    
    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
      const message = event.message || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      )
      
      if (shouldSuppress) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    })
    
    // Global unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.toString() || ''
      const shouldSuppress = suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      )
      
      if (shouldSuppress) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    })
  }, [])

  return null
}

