'use client'

import { usePullToRefresh } from '@/hooks/useSwipe'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
}

export default function PullToRefresh({ onRefresh }: PullToRefreshProps) {
  const { isRefreshing, pullDistance } = usePullToRefresh(onRefresh)

  if (pullDistance === 0 && !isRefreshing) return null

  const progress = Math.min(pullDistance / 80, 1)
  const rotation = progress * 360

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-opacity duration-300"
      style={{
        opacity: progress,
        transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
      }}
    >
      <div className="bg-white dark:bg-gray-700 rounded-full shadow-lg p-3 mt-4">
        {isRefreshing ? (
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="w-6 h-6 text-blue-600"
            style={{ transform: `rotate(${rotation}deg)` }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

