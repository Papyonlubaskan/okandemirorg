'use client'

import { useEffect, useState } from 'react'

interface Survey {
  id: string
  customerName: string
  customerEmail: string
  overallRating: number
  communicationRating: number
  qualityRating: number
  timelinessRating: number
  valueRating: number
  whatWorkedWell: string | null
  whatCouldImprove: string | null
  wouldRecommend: boolean
  testimonial: string | null
  allowPublic: boolean
  completedAt: string
}

interface Stats {
  total: number
  averageOverallRating: number
  averageCommunicationRating: number
  averageQualityRating: number
  averageTimelinessRating: number
  averageValueRating: number
  recommendationRate: number
  ratingDistribution: {
    [key: number]: number
  }
}

export default function SurveysDashboard() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/survey/results')
      const data = await response.json()
      if (data.success) {
        setSurveys(data.surveys)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xl">
            {star <= rating ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            📋 Müşteri Memnuniyet Anketleri
          </h1>
          <p className="text-gray-600 font-medium">
            Müşteri geri bildirimlerini görüntüleyin ve analiz edin
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="text-sm font-bold opacity-90 mb-2">Toplam Anket</div>
              <div className="text-4xl font-black">{stats.total}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="text-sm font-bold opacity-90 mb-2">Ortalama Puan</div>
              <div className="text-4xl font-black">
                {stats.averageOverallRating.toFixed(1)}
              </div>
              <div className="text-sm opacity-75 mt-1">/ 5.0</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="text-sm font-bold opacity-90 mb-2">Tavsiye Oranı</div>
              <div className="text-4xl font-black">
                {stats.recommendationRate.toFixed(0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <div className="text-sm font-bold opacity-90 mb-2">5 Yıldız</div>
              <div className="text-4xl font-black">
                {stats.ratingDistribution[5] || 0}
              </div>
              <div className="text-sm opacity-75 mt-1">anket</div>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">📊 Detaylı İstatistikler</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-700 mb-4">Kategori Ortalamaları</h3>
                <div className="space-y-3">
                  {[
                    { label: 'İletişim', value: stats.averageCommunicationRating },
                    { label: 'Kalite', value: stats.averageQualityRating },
                    { label: 'Zamanlama', value: stats.averageTimelinessRating },
                    { label: 'Fiyat/Değer', value: stats.averageValueRating },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{item.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-blue-600">{item.value.toFixed(1)}</span>
                        {renderStars(Math.round(item.value))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 mb-4">Puan Dağılımı</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="font-medium text-gray-700 w-8">{rating} ⭐</span>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{
                            width: `${((stats.ratingDistribution[rating] || 0) / stats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-gray-700 w-12 text-right">
                        {stats.ratingDistribution[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Surveys List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900">📝 Tüm Anketler</h2>
          
          {surveys.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 font-medium">Henüz anket yok</p>
            </div>
          ) : (
            surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{survey.customerName}</h3>
                    <p className="text-sm text-gray-600 font-medium">{survey.customerEmail}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {new Date(survey.completedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-blue-600 mb-1">
                      {survey.overallRating.toFixed(1)}
                    </div>
                    {renderStars(survey.overallRating)}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">İletişim</div>
                    <div className="font-black text-blue-600">{survey.communicationRating}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Kalite</div>
                    <div className="font-black text-green-600">{survey.qualityRating}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Zamanlama</div>
                    <div className="font-black text-purple-600">{survey.timelinessRating}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Fiyat/Değer</div>
                    <div className="font-black text-orange-600">{survey.valueRating}</div>
                  </div>
                </div>

                {survey.whatWorkedWell && (
                  <div className="mb-4">
                    <div className="font-bold text-gray-700 mb-2">✅ Beğenilen Yönler:</div>
                    <p className="text-gray-600 font-medium bg-green-50 p-3 rounded">
                      {survey.whatWorkedWell}
                    </p>
                  </div>
                )}

                {survey.whatCouldImprove && (
                  <div className="mb-4">
                    <div className="font-bold text-gray-700 mb-2">💡 İyileştirme Önerileri:</div>
                    <p className="text-gray-600 font-medium bg-yellow-50 p-3 rounded">
                      {survey.whatCouldImprove}
                    </p>
                  </div>
                )}

                {survey.testimonial && (
                  <div className="mb-4">
                    <div className="font-bold text-gray-700 mb-2">
                      💬 Referans {survey.allowPublic && '(Yayınlanabilir)'}
                    </div>
                    <blockquote className="text-gray-600 font-medium bg-blue-50 p-4 rounded italic border-l-4 border-blue-500">
                      &ldquo;{survey.testimonial}&rdquo;
                    </blockquote>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className={`px-4 py-2 rounded-full font-bold ${
                    survey.wouldRecommend
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {survey.wouldRecommend ? '✅ Tavsiye Eder' : '❌ Tavsiye Etmez'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

