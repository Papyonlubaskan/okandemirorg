'use client'

import { useState } from 'react'

interface SurveyFormProps {
  token?: string
  customerName?: string
  customerEmail?: string
}

export default function SurveyForm({ token, customerName = '', customerEmail = '' }: SurveyFormProps) {
  const [formData, setFormData] = useState({
    customerName,
    customerEmail,
    overallRating: 0,
    communicationRating: 0,
    qualityRating: 0,
    timelinessRating: 0,
    valueRating: 0,
    whatWorkedWell: '',
    whatCouldImprove: '',
    wouldRecommend: true,
    testimonial: '',
    allowPublic: false,
  })

  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (field: string, rating: number) => {
    setFormData({ ...formData, [field]: rating })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.customerName || !formData.customerEmail) {
      alert('Lütfen adınızı ve e-postanızı girin')
      return
    }

    if (formData.overallRating === 0) {
      alert('Lütfen genel memnuniyetinizi değerlendirin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      })

      const data = await response.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        alert('Anket gönderilemedi: ' + data.error)
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (field: string, value: number) => {
    const currentRating = hoveredRating[field] || value

    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(field, star)}
            onMouseEnter={() => setHoveredRating({ ...hoveredRating, [field]: star })}
            onMouseLeave={() => setHoveredRating({ ...hoveredRating, [field]: 0 })}
            className="text-4xl transition-all hover:scale-110 focus:outline-none"
          >
            {star <= currentRating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Teşekkür Ederiz!
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-8">
            Görüşleriniz bizim için çok değerli. Geri bildiriminiz için teşekkür ederiz.
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl">
            <p className="font-bold text-lg">
              {formData.wouldRecommend
                ? '💙 Bizi tavsiye etmeyi düşünüyorsunuz, harika!'
                : 'Hizmetlerimizi iyileştirmek için çalışacağız.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              💬 Müşteri Memnuniyet Anketi
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Hizmetlerimizi değerlendirerek daha iyi olmamıza yardımcı olun
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            {!customerName && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">E-posta *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
              </div>
            )}

            {/* Overall Rating */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <label className="block font-black text-gray-900 text-xl mb-4">
                Genel Memnuniyet *
              </label>
              {renderStars('overallRating', formData.overallRating)}
              <p className="mt-2 text-sm text-gray-600 font-medium">
                {formData.overallRating === 5 && '🎉 Mükemmel!'}
                {formData.overallRating === 4 && '😊 Çok İyi'}
                {formData.overallRating === 3 && '👍 İyi'}
                {formData.overallRating === 2 && '😐 Orta'}
                {formData.overallRating === 1 && '😞 Geliştirilmeli'}
              </p>
            </div>

            {/* Detailed Ratings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-gray-700 mb-3">İletişim</label>
                {renderStars('communicationRating', formData.communicationRating)}
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-3">Kalite</label>
                {renderStars('qualityRating', formData.qualityRating)}
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-3">Zamanlama</label>
                {renderStars('timelinessRating', formData.timelinessRating)}
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-3">Fiyat/Değer</label>
                {renderStars('valueRating', formData.valueRating)}
              </div>
            </div>

            {/* Text Feedback */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Neyi beğendiniz?
              </label>
              <textarea
                rows={4}
                value={formData.whatWorkedWell}
                onChange={(e) => setFormData({ ...formData, whatWorkedWell: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                placeholder="En çok hangi yönlerimizi beğendiniz?"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Neyi geliştirebiliriz?
              </label>
              <textarea
                rows={4}
                value={formData.whatCouldImprove}
                onChange={(e) => setFormData({ ...formData, whatCouldImprove: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                placeholder="Hangi konularda daha iyi olabiliriz?"
              />
            </div>

            {/* Recommendation */}
            <div className="bg-yellow-50 p-6 rounded-xl">
              <label className="block font-bold text-gray-900 mb-3">
                Bizi tavsiye eder misiniz?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                  className={`flex-1 py-4 rounded-lg font-black text-lg transition-all ${
                    formData.wouldRecommend
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ✅ Evet
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                  className={`flex-1 py-4 rounded-lg font-black text-lg transition-all ${
                    !formData.wouldRecommend
                      ? 'bg-red-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ❌ Hayır
                </button>
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Referans Olarak Kullanılabilecek Yorum (İsteğe Bağlı)
              </label>
              <textarea
                rows={3}
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                placeholder="Yorumunuz web sitemizde yayınlanabilir..."
              />
              <label className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={formData.allowPublic}
                  onChange={(e) => setFormData({ ...formData, allowPublic: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">
                  Yorumum web sitesinde yayınlanabilir
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-black text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '📤 Gönderiliyor...' : '📤 Anketi Gönder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

