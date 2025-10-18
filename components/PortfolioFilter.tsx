'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const portfolioItems = [
  {
    id: 1,
    title: 'Dijital Pazarlama',
    category: 'Dijital Pazarlama',
    description: 'Meta Ads & Google Ads & Tiktok & LinkedIn platformlarında sürdürülebilir stratejiler ile mükemmel sonuçlar.',
    image: '/digital-marketing-icon.png',
    gradient: 'from-blue-500 to-blue-600',
    link: '/hizmetler/dijital-pazarlama',
  },
  {
    id: 2,
    title: 'WordPress Web Tasarımı',
    category: 'Web Tasarım',
    description: 'Kişisel ve E-Ticaret Web Tasarım Çözümleri ile Yanınızdayım!',
    image: '/wordpress-icon.png',
    gradient: 'from-purple-500 to-purple-600',
    link: '/hizmetler/wordpress-tasarim',
  },
  {
    id: 3,
    title: 'Özel Web Tasarımı',
    category: 'Web Tasarım',
    description: 'Tamamen özelleştirilmiş, modern ve responsive web siteleri.',
    image: '/web-design-icon.png',
    gradient: 'from-indigo-500 to-indigo-600',
    link: '/hizmetler/web-tasarim',
  },
  {
    id: 4,
    title: 'Dijital Dönüşüm',
    category: 'Dijital Dönüşüm',
    description: 'Dijital çağda sürdürülebilir stratejiler ile markanızın öncü tanınır olmasını sağlıyorum.',
    image: '/digital-transformation-icon.png',
    gradient: 'from-green-500 to-green-600',
    link: '/hizmetler/dijital-donusum',
  },
  {
    id: 5,
    title: 'Marka Kimliği',
    category: 'Marka Kimliği',
    description: 'En iyi kurumsal tasarımlar ile lider olmanızı sağlıyorum.',
    image: '/brand-identity-icon.png',
    gradient: 'from-orange-500 to-orange-600',
    link: '/hizmetler/marka-kimligi',
  },
  {
    id: 6,
    title: 'SEO Optimizasyonu',
    category: 'Dijital Pazarlama',
    description: 'Google\'da üst sıralarda yer alın, organik trafiğinizi artırın.',
    image: '/development-icon.png',
    gradient: 'from-teal-500 to-teal-600',
    link: '/hizmetler/dijital-pazarlama',
  },
]

const categories = ['Tümü', 'Dijital Pazarlama', 'Web Tasarım', 'Dijital Dönüşüm', 'Marka Kimliği']

export default function PortfolioFilter() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [animating, setAnimating] = useState(false)

  const filteredItems = selectedCategory === 'Tümü' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setAnimating(true)
    setSelectedCategory(category)
    setTimeout(() => setAnimating(false), 300)
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-full font-black transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-600">
            {filteredItems.length} sonuç bulundu
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
          animating ? 'opacity-50' : 'opacity-100'
        }`}>
          {filteredItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.link}
              className="block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out group hover:transform hover:scale-105 cursor-pointer animate-fade-in">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <div className={`w-full h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      width={100} 
                      height={100}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-black text-sm">{item.category}</span>
                  </div>

                  {/* View Icon */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600 transition-all duration-500">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Detayları Gör
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Sonuç Bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Bu kategoride henüz proje bulunmamaktadır.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

