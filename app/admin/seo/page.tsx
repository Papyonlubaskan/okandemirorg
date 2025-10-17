'use client'

import { useState } from 'react'
import { SEOAnalysis } from '@/lib/seo-analyzer'

export default function SEOAnalyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!url) return

    setLoading(true)
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        alert('Analiz yapılamadı: ' + data.error)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            🔍 Gelişmiş SEO Analiz Aracı
          </h1>
          <p className="text-gray-600 font-medium">
            Web sitenizin SEO performansını analiz edin ve iyileştirme önerileri alın
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-black hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Analiz Ediliyor...' : '🔍 Analiz Et'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-2">SEO Skoru</h2>
                  <p className="text-blue-100 font-medium">
                    {analysis.score >= 85
                      ? '✅ Mükemmel'
                      : analysis.score >= 70
                      ? '⚡ İyi'
                      : '⚠️ Geliştirilmeli'}
                  </p>
                </div>
                <div className="text-7xl font-black">{analysis.score}</div>
              </div>
              <div className="mt-4 h-4 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">📄 Meta Bilgiler</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">Başlık:</span>
                    <span className={`text-sm font-medium ${
                      analysis.meta.titleLength >= 50 && analysis.meta.titleLength <= 60
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {analysis.meta.titleLength} karakter
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium bg-gray-50 p-3 rounded">
                    {analysis.meta.title || '(Başlık yok)'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">Açıklama:</span>
                    <span className={`text-sm font-medium ${
                      analysis.meta.descriptionLength >= 150 && analysis.meta.descriptionLength <= 160
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {analysis.meta.descriptionLength} karakter
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium bg-gray-50 p-3 rounded">
                    {analysis.meta.description || '(Açıklama yok)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Content Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">📝 İçerik Analizi</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Kelime Sayısı:</span>
                    <span className="font-black text-blue-600">{analysis.content.wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">H1 Başlıkları:</span>
                    <span className={`font-black ${
                      analysis.content.headings.h1 === 1 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analysis.content.headings.h1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">H2 Başlıkları:</span>
                    <span className="font-black text-blue-600">{analysis.content.headings.h2}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">H3 Başlıkları:</span>
                    <span className="font-black text-blue-600">{analysis.content.headings.h3}</span>
                  </div>
                </div>
              </div>

              {/* Images & Links */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">🖼️ Görseller & Linkler</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Toplam Görsel:</span>
                    <span className="font-black text-blue-600">{analysis.content.images.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Alt Text Var:</span>
                    <span className="font-black text-green-600">{analysis.content.images.withAlt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Alt Text Yok:</span>
                    <span className={`font-black ${
                      analysis.content.images.withoutAlt > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {analysis.content.images.withoutAlt}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">İç Linkler:</span>
                    <span className="font-black text-blue-600">{analysis.content.links.internal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Dış Linkler:</span>
                    <span className="font-black text-blue-600">{analysis.content.links.external}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  ⚠️ Tespit Edilen Sorunlar ({analysis.issues.length})
                </h2>
                <div className="space-y-3">
                  {analysis.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`border-l-4 p-4 rounded ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-black text-sm uppercase">{issue.category}</span>
                        <span className="font-bold text-xs px-2 py-1 rounded">
                          {issue.severity === 'critical' ? '🔴 KRİTİK' :
                           issue.severity === 'warning' ? '🟡 UYARI' : '🔵 BİLGİ'}
                        </span>
                      </div>
                      <p className="font-medium mb-2">{issue.message}</p>
                      <p className="text-sm font-medium opacity-75">💡 Çözüm: {issue.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  💡 İyileştirme Önerileri
                </h2>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <span className="font-black text-blue-600">{idx + 1}.</span>
                      <p className="font-medium text-gray-700 flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical SEO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">⚙️ Teknik SEO</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(analysis.technical).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700">
                      {key === 'hasSSL' ? 'SSL Sertifikası' :
                       key === 'isMobileFriendly' ? 'Mobil Uyumlu' :
                       key === 'hasStructuredData' ? 'Structured Data' :
                       key === 'hasRobotsTxt' ? 'Robots.txt' :
                       key === 'hasSitemap' ? 'Sitemap' : key}
                    </span>
                    <span className={`font-black ${value ? 'text-green-600' : 'text-red-600'}`}>
                      {value ? '✅ Var' : '❌ Yok'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

