'use client'

import { useEffect, useState } from 'react'
import { generateAnalyticsInsights, AnalyticsSummary } from '@/lib/ai-analysis'

interface Submission {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  aiCategory: string | null
  aiSentiment: string | null
  aiPriority: string | null
  aiEstimatedBudget: string | null
  aiKeywords: string | null
  aiSummary: string | null
  aiConfidence: number | null
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      const data = await response.json()
      setSubmissions(data.submissions || [])
      
      if (data.submissions && data.submissions.length > 0) {
        const insights = generateAnalyticsInsights(data.submissions)
        setAnalytics(insights)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category: string | null) => {
    const labels: Record<string, string> = {
      web_design: 'Web Tasarım',
      digital_marketing: 'Dijital Pazarlama',
      seo: 'SEO',
      development: 'Yazılım Geliştirme',
      branding: 'Marka Kimliği',
      digital_transformation: 'Dijital Dönüşüm',
      consultancy: 'Danışmanlık',
      general: 'Genel',
    }
    return category ? labels[category] || category : 'N/A'
  }

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true
    if (filter === 'high-priority') return sub.aiPriority === 'high'
    if (filter === 'new') return sub.status === 'new'
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            🤖 AI Müşteri Analiz Dashboard
          </h1>
          <p className="text-gray-600 font-medium">
            Müşteri başvurularını AI ile analiz edin ve yönetin
          </p>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-bold text-gray-600 mb-2">Toplam Başvuru</div>
              <div className="text-3xl font-black text-blue-600">{analytics.totalSubmissions}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-bold text-gray-600 mb-2">Dönüşüm Oranı</div>
              <div className="text-3xl font-black text-green-600">
                {analytics.conversionRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-bold text-gray-600 mb-2">Ortalama Güven</div>
              <div className="text-3xl font-black text-purple-600">
                {(analytics.averageConfidence * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-bold text-gray-600 mb-2">Yüksek Öncelik</div>
              <div className="text-3xl font-black text-red-600">
                {analytics.byPriority.high || 0}
              </div>
            </div>
          </div>
        )}

        {/* Category Distribution */}
        {analytics && Object.keys(analytics.byCategory).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-4">Kategori Dağılımı</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.byCategory).map(([category, count]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-black text-blue-600">{count}</div>
                  <div className="text-sm font-medium text-gray-600">
                    {getCategoryLabel(category)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-bold ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tümü ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('high-priority')}
              className={`px-4 py-2 rounded-lg font-bold ${
                filter === 'high-priority'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Yüksek Öncelik
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg font-bold ${
                filter === 'new'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Yeni
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 font-medium">Henüz başvuru yok</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">
                      {submission.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {submission.email} {submission.phone && `• ${submission.phone}`}
                    </p>
                    {submission.company && (
                      <p className="text-sm text-gray-600 font-medium">
                        🏢 {submission.company}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">
                      {new Date(submission.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    {submission.aiConfidence && (
                      <div className="text-xs text-blue-600 font-bold">
                        Güven: {(submission.aiConfidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(submission.aiPriority)}`}>
                    {submission.aiPriority?.toUpperCase() || 'N/A'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSentimentColor(submission.aiSentiment)}`}>
                    {submission.aiSentiment?.toUpperCase() || 'N/A'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {getCategoryLabel(submission.aiCategory)}
                  </span>
                  {submission.aiEstimatedBudget && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      Bütçe: {submission.aiEstimatedBudget.toUpperCase()}
                    </span>
                  )}
                </div>

                {submission.aiSummary && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="text-xs font-bold text-blue-800 mb-1">AI Özet:</div>
                    <div className="text-sm text-gray-700 font-medium">{submission.aiSummary}</div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-2">Mesaj:</div>
                  <div className="text-sm text-gray-600 font-medium line-clamp-3">
                    {submission.message}
                  </div>
                </div>

                {submission.aiKeywords && JSON.parse(submission.aiKeywords).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {JSON.parse(submission.aiKeywords).map((keyword: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

