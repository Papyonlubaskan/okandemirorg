'use client'

import { useEffect, useState } from 'react'

export default function AccessibilityHelper() {
  const [skipToContent, setSkipToContent] = useState(false)

  useEffect(() => {
    // Add keyboard navigation hints
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip to content on Tab
      if (e.key === 'Tab' && !skipToContent) {
        setSkipToContent(true)
      }
      
      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const event = new CustomEvent('escapePressed')
        window.dispatchEvent(event)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [skipToContent])

  const handleSkipToContent = () => {
    const main = document.querySelector('main')
    if (main) {
      main.focus()
      main.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className={`fixed top-4 left-4 z-[9999] bg-blue-600 text-white px-6 py-3 rounded-lg font-black shadow-lg transition-transform ${
          skipToContent ? 'translate-x-0' : '-translate-x-[200%]'
        } focus:translate-x-0`}
        aria-label="Ana içeriğe atla"
      >
        Ana İçeriğe Atla
      </a>

      {/* Screen Reader Only Announcements */}
      <div
        id="sr-announcements"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Focus Indicator Enhancement */}
      <style jsx global>{`
        /* Enhanced focus styles for accessibility */
        *:focus-visible {
          outline: 3px solid #2563eb;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Skip link styles */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          * {
            border-width: 2px !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  )
}

// Screen reader announcement helper
export function announceToScreenReader(message: string) {
  const announcer = document.getElementById('sr-announcements')
  if (announcer) {
    announcer.textContent = message
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }
}

// Focus trap for modals
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])
}

