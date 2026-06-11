'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function AnalyticsRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const measurementId =
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID
    if (!measurementId || process.env.NODE_ENV !== 'production') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
    if (gtag) {
      gtag('config', measurementId, { page_path: url })
    }
  }, [pathname, searchParams])

  return null
}
