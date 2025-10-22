'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Selin Görkem',
    title: 'Girişimci',
    image: '/selin-gorkem.jpg',
    text: 'Okan Demir ile çalışmak inanılmaz bir deneyimdi. Dijital pazarlama stratejileri sayesinde satışlarımız %300 arttı. Profesyonelliği ve yaratıcılığı takdire şayan.',
    rating: 5,
    company: 'Selingoal',
  },
  {
    id: 2,
    name: 'Hakan Gazioğlu',
    title: 'E-Ticaret Sahibi',
    image: '/hakan-gazioglu.jpg',
    text: 'Web sitemiz yenilendikten sonra müşterilerimizden aldığımız geri dönüşler harika! Modern, hızlı ve kullanıcı dostu bir site için teşekkürler.',
    rating: 5,
    company: 'Hakan Gazioğlu',
  },
  {
    id: 3,
    name: 'Ahmet Yılmaz',
    title: 'Restoran Sahibi',
    image: '/testimonial-2-1.jpg',
    text: 'Sosyal medya yönetimi hizmeti sayesinde restoranımıza gelen müşteri sayısı iki katına çıktı. Her ay düzenli olarak yeni müşteriler kazanıyoruz.',
    rating: 5,
    company: 'Lezzetler Durağı',
  },
  {
    id: 4,
    name: 'Zeynep Kaya',
    title: 'Butik Sahibi',
    image: '/testimonial-2-2.jpg',
    text: 'Marka kimliğimizi sıfırdan oluşturdu ve harika bir iş çıkardı. Logo tasarımımız ve kurumsal kimliğimiz tam beklediğimiz gibi oldu.',
    rating: 5,
    company: 'Zey Butik',
  },
  {
    id: 5,
    name: 'Mehmet Demir',
    title: 'Yazılım Firması CEO',
    image: '/testimonial-2-3.jpg',
    text: 'Google Ads kampanyalarımız sayesinde yatırım getirimiz %400 arttı. Bütçe optimizasyonu ve hedef kitle analizindeki uzmanlığı etkileyici.',
    rating: 5,
    company: 'TechSolutions',
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlay(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
            ⭐ Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Birlikte çalıştığımız mutlu müşterilerimizin görüşleri
          </p>
        </div>

        {/* Slider Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-full blur-3xl opacity-30 -ml-32 -mb-32"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Quote Icon */}
              <div className="text-6xl text-blue-600 opacity-20 mb-4">&ldquo;</div>

              {/* Testimonial Text */}
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-8 leading-relaxed min-h-[120px]">
                {currentTestimonial.text}
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-100">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {currentTestimonial.title} - {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-blue-600 dark:hover:bg-gray-600"
            aria-label="Önceki"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-blue-600 dark:hover:bg-gray-600"
            aria-label="Sonraki"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-blue-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Testimoni ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Preview */}
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'scale-110 ring-4 ring-blue-600'
                    : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
                }`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Mutlu Müşteri</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">5.0</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Ortalama Puan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">%98</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Memnuniyet</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Tavsiye Oranı</div>
          </div>
        </div>
      </div>
    </section>
  )
}

