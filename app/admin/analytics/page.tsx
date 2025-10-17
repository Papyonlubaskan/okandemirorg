'use client'

import { useEffect, useState } from 'react'

interface AnalyticsStats {
  pageViews: {
    last24Hours: number
    last7Days: number
    last30Days: number
  }
  uniqueVisitors: {
    last24Hours: number
  }
  avgTimeOnSite: number
  submissions: {
    last24Hours: number
    last7Days: number
    last30Days: number
  }
  conversionRate: string
  topPages: Array<{ page: string; views: number }>
  eventsByType: Array<{ type: string; count: number }>
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium">Veri yüklenemedi</p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              📊 Canlı Performans Dashboard
            </h1>
            <p className="text-gray-600 font-medium">
              Gerçek zamanlı site istatistikleri ve kullanıcı davranışları
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300 font-medium"
            >
              <option value={10000}>10 saniye</option>
              <option value={30000}>30 saniye</option>
              <option value={60000}>1 dakika</option>
            </select>
            
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              Canlı
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Page Views */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold opacity-90">Sayfa Görüntüleme</div>
              <div className="text-3xl">👁️</div>
            </div>
            <div className="text-4xl font-black mb-2">{stats.pageViews.last24Hours}</div>
            <div className="text-sm opacity-75 font-medium">Son 24 saat</div>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs font-medium">
              <span>7 gün: {stats.pageViews.last7Days}</span>
              <span>30 gün: {stats.pageViews.last30Days}</span>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold opacity-90">Benzersiz Ziyaretçi</div>
              <div className="text-3xl">👥</div>
            </div>
            <div className="text-4xl font-black mb-2">{stats.uniqueVisitors.last24Hours}</div>
            <div className="text-sm opacity-75 font-medium">Son 24 saat</div>
            <div className="mt-4 pt-4 border-t border-white/20 text-xs font-medium">
              Aktif session sayısı
            </div>
          </div>

          {/* Average Time on Site */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold opacity-90">Ort. Kalış Süresi</div>
              <div className="text-3xl">⏱️</div>
            </div>
            <div className="text-4xl font-black mb-2">{formatTime(stats.avgTimeOnSite)}</div>
            <div className="text-sm opacity-75 font-medium">Session başına</div>
            <div className="mt-4 pt-4 border-t border-white/20 text-xs font-medium">
              {stats.avgTimeOnSite} saniye
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold opacity-90">Dönüşüm Oranı</div>
              <div className="text-3xl">🎯</div>
            </div>
            <div className="text-4xl font-black mb-2">{stats.conversionRate}%</div>
            <div className="text-sm opacity-75 font-medium">Form gönderimi</div>
            <div className="mt-4 pt-4 border-t border-white/20 text-xs font-medium">
              {stats.submissions.last24Hours} başvuru / 24h
            </div>
          </div>
        </div>

        {/* Submissions Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">24 Saat</h3>
              <div className="text-2xl">📅</div>
            </div>
            <div className="text-3xl font-black text-blue-600 mb-1">
              {stats.submissions.last24Hours}
            </div>
            <div className="text-sm text-gray-600 font-medium">Başvuru</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">7 Gün</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-3xl font-black text-purple-600 mb-1">
              {stats.submissions.last7Days}
            </div>
            <div className="text-sm text-gray-600 font-medium">Başvuru</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">30 Gün</h3>
              <div className="text-2xl">📈</div>
            </div>
            <div className="text-3xl font-black text-green-600 mb-1">
              {stats.submissions.last30Days}
            </div>
            <div className="text-sm text-gray-600 font-medium">Başvuru</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              🔥 En Popüler Sayfalar
            </h2>
            <div className="space-y-3">
              {stats.topPages.slice(0, 10).map((page, idx) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <div className="font-medium text-gray-700 truncate">{page.page}</div>
                  </div>
                  <div className="font-black text-blue-600">{page.views}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Events by Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              📱 Event Türleri
            </h2>
            <div className="space-y-3">
              {stats.eventsByType.map((event) => {
                const percentage = stats.eventsByType.length > 0
                  ? (event.count / stats.eventsByType.reduce((sum, e) => sum + e.count, 0)) * 100
                  : 0

                const eventIcons: Record<string, string> = {
                  page_view: '👁️',
                  click: '🖱️',
                  scroll: '📜',
                  form_submit: '📝',
                  time_on_page: '⏱️',
                }

                const eventLabels: Record<string, string> = {
                  page_view: 'Sayfa Görüntüleme',
                  click: 'Tıklama',
                  scroll: 'Scroll',
                  form_submit: 'Form Gönderimi',
                  time_on_page: 'Sayfa Süresi',
                }

                return (
                  <div key={event.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-gray-700">
                        <span className="text-xl">{eventIcons[event.type] || '📊'}</span>
                        {eventLabels[event.type] || event.type}
                      </div>
                      <div className="font-black text-gray-900">{event.count}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

