'use client'

import { useEffect, useRef, useState } from 'react'

interface SwipeInput {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  minSwipeDistance?: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
}: SwipeInput) {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const touchEndY = useRef<number>(0)

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const distanceX = touchStartX.current - touchEndX.current
    const distanceY = touchStartY.current - touchEndY.current
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (distanceX > minSwipeDistance && onSwipeLeft) {
        onSwipeLeft()
      } else if (distanceX < -minSwipeDistance && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) {
        onSwipeUp()
      } else if (distanceY < -minSwipeDistance && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}

// Long press hook
export function useLongPress(callback: () => void, duration = 500) {
  const [pressing, setPressing] = useState(false)
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined)

  const start = () => {
    setPressing(true)
    timeout.current = setTimeout(callback, duration)
  }

  const stop = () => {
    setPressing(false)
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  return {
    pressing,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  }
}

// Pull to refresh hook
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const threshold = 80

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY.current)
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
    startY.current = 0
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, isRefreshing])

  return { isRefreshing, pullDistance }
}

