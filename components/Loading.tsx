'use client'

import { useState, useEffect } from 'react'

export default function Loading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-2xl">O</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
          O Copyright© Dijital Pazarlama & Yazılım
        </h2>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 dark:text-gray-300 mt-4 animate-pulse">
          Yükleniyor...
        </p>
      </div>
    </div>
  )
}
