'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Story {
  id: number
  name: string
  company: string
  role: string
  image: string
  story: string
  results: {
    metric: string
    value: string
    icon: string
  }[]
  rating: number
}

const stories: Story[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    company: 'TechStart A.Ş.',
    role: 'CEO',
    image: '/testimonial-1-1.jpg',
    story: 'Okan Bey ile çalışmak firmamız için dönüm noktası oldu. Web sitemizi yeniledi ve SEO çalışmaları sayesinde online görünürlüğümüz %300 arttı. Müşteri başvurularımız inanılmaz derecede yükseldi.',
    results: [
      { metric: 'Trafik Artışı', value: '+300%', icon: '📈' },
      { metric: 'Dönüşüm', value: '+250%', icon: '🎯' },
      { metric: 'Müşteri Memnuniyeti', value: '98%', icon: '⭐' },
    ],
    rating: 5,
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    company: 'Fashion Boutique',
    role: 'Kurucu',
    image: '/testimonial-1-2.jpg',
    story: 'E-ticaret sitemizi sıfırdan kurdu ve dijital pazarlama stratejileri geliştirdi. İlk 3 ayda hedefimizin 2 katı satış yaptık. Profesyonel yaklaşımı ve sürekli destek vermesi çok değerliydi.',
    results: [
      { metric: 'Aylık Satış', value: '+180%', icon: '💰' },
      { metric: 'Sosyal Medya', value: '+400%', icon: '📱' },
      { metric: 'Müşteri Sayısı', value: '+220%', icon: '👥' },
    ],
    rating: 5,
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    company: 'Kaya İnşaat',
    role: 'Genel Müdür',
    image: '/testimonial-1-3.jpg',
    story: 'Kurumsal kimlik çalışmamızı ve dijital dönüşüm sürecimizi yönetti. Hem görsel kimliğimiz hem de dijital altyapımız modern ve profesyonel seviyeye ulaştı. Rakiplerimizden pozitif anlamda ayrıştık.',
    results: [
      { metric: 'Marka Bilinirliği', value: '+150%', icon: '🏆' },
      { metric: 'Online Görünürlük', value: '+280%', icon: '🌐' },
      { metric: 'İş Verimliliği', value: '+90%', icon: '⚡' },
    ],
    rating: 5,
  },
  {
    id: 4,
    name: 'Zeynep Arslan',
    company: 'Wellness Center',
    role: 'İşletme Sahibi',
    image: '/testimonial-1-4.jpg',
    story: 'Google Ads ve Meta reklamları ile randevu sayımızı katladı. ROI odaklı çalışması ve detaylı raporlama sistemi sayesinde her kuruşun neye gittiğini görüyoruz. Gerçekten sonuç odaklı bir partner.',
    results: [
      { metric: 'Randevu Artışı', value: '+320%', icon: '📅' },
      { metric: 'ROI', value: '450%', icon: '💎' },
      { metric: 'Reklam Verimi', value: '+280%', icon: '🎨' },
    ],
    rating: 5,
  },
  {
    id: 5,
    name: 'Can Öztürk',
    company: 'Gourmet Restaurant',
    role: 'Restoran Müdürü',
    image: '/testimonial-1-5.jpg',
    story: 'Sosyal medya yönetimi ve influencer iş birlikleri ile restoranımızın popülaritesi fırladı. Rezervasyon sistemi entegrasyonu ve online menü tasarımı da harika oldu. Her detayı düşünen bir profesyonel.',
    results: [
      { metric: 'Rezervasyonlar', value: '+260%', icon: '🍽️' },
      { metric: 'Sosyal Erişim', value: '+500%', icon: '📲' },
      { metric: 'Müşteri Sadakati', value: '95%', icon: '❤️' },
    ],
    rating: 5,
  },
]

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 8000) // Auto-advance every 8 seconds

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length)
      setIsAnimating(false)
    }, 500)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
      setIsAnimating(false)
    }, 500)
  }

  const currentStory = stories[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            ✨ Müşteri Başarı Hikayeleri
          </h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Birlikte çalıştığımız markaların gerçek sonuçları ve başarı hikayeleri
          </p>
        </div>

        {/* Main Story Card */}
        <div
          className={`max-w-6xl mx-auto transition-all duration-500 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Profile & Story */}
              <div className="p-8 md:p-12">
                {/* Profile */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4">
                    <Image
                      src={currentStory.image}
                      alt={currentStory.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{currentStory.name}</h3>
                    <p className="text-lg font-medium text-blue-600">{currentStory.role}</p>
                    <p className="text-gray-600 font-medium">{currentStory.company}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(currentStory.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Story */}
                <blockquote className="text-lg text-gray-700 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6">
                  &ldquo;{currentStory.story}&rdquo;
                </blockquote>
              </div>

              {/* Right Side - Results */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 md:p-12 text-white">
                <h4 className="text-3xl font-black mb-8">🎯 Sonuçlar</h4>
                
                <div className="space-y-6">
                  {currentStory.results.map((result, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium">{result.metric}</span>
                        <span className="text-3xl">{result.icon}</span>
                      </div>
                      <div className="text-4xl font-black">{result.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm font-medium opacity-90">
                    Bu sonuçlar {currentStory.company} ile yapılan 6 aylık iş birliği sonucunda elde edilmiştir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-12">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Önceki"
          >
            <span className="text-2xl">←</span>
          </button>

          {/* Dots */}
          <div className="flex gap-3">
            {stories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setTimeout(() => {
                      setCurrentIndex(idx)
                      setIsAnimating(false)
                    }, 500)
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-12 h-3 bg-blue-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Hikaye ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sonraki"
          >
            <span className="text-2xl">→</span>
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/iletisim"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Siz de Başarı Hikayenizi Yazın
            <span className="text-2xl">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

