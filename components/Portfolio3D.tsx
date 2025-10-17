'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string
  tags: string[]
  link?: string
  color: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Ticaret Web Sitesi',
    category: 'Web Tasarım',
    description: 'Modern e-ticaret platformu, ödeme entegrasyonu ve yönetim paneli',
    image: '/project-1.jpg',
    tags: ['Next.js', 'E-Commerce', 'Payment'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Kurumsal Web Sitesi',
    category: 'Web Tasarım',
    description: 'Profesyonel kurumsal kimlik ve responsive tasarım',
    image: '/project-2.jpg',
    tags: ['Corporate', 'Responsive', 'SEO'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Dijital Pazarlama Kampanyası',
    category: 'Dijital Pazarlama',
    description: 'Google Ads ve Meta reklamları ile %300 ROI artışı',
    image: '/project-3.jpg',
    tags: ['Google Ads', 'Meta Ads', 'ROI'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    title: 'Marka Kimliği Tasarımı',
    category: 'Branding',
    description: 'Komple logo, kurumsal kimlik ve marka rehberi',
    image: '/project-4.jpg',
    tags: ['Logo', 'Brand Identity', 'Style Guide'],
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    title: 'SEO Optimizasyonu',
    category: 'SEO',
    description: 'Organik trafik %250 artışı ve ilk sayfa sıralaması',
    image: '/project-5.jpg',
    tags: ['SEO', 'Traffic', 'Rankings'],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 6,
    title: 'Mobil Uygulama',
    category: 'Development',
    description: 'React Native ile iOS ve Android uygulaması',
    image: '/project-6.jpg',
    tags: ['React Native', 'Mobile', 'Cross-Platform'],
    color: 'from-indigo-500 to-purple-500',
  },
]

export default function Portfolio3D() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext()
      }
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isAnimating, filteredProjects.length])

  const handleNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % filteredProjects.length)
      setIsAnimating(false)
    }, 300)
  }

  const handlePrev = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length)
      setIsAnimating(false)
    }, 300)
  }

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex
    const total = filteredProjects.length

    if (diff === 0) {
      // Active card - center front
      return {
        transform: 'translateX(0) translateZ(0) scale(1)',
        opacity: 1,
        zIndex: 50,
      }
    } else if (diff === 1 || diff === -(total - 1)) {
      // Next card - right
      return {
        transform: 'translateX(60%) translateZ(-200px) scale(0.8)',
        opacity: 0.7,
        zIndex: 40,
      }
    } else if (diff === -1 || diff === (total - 1)) {
      // Previous card - left
      return {
        transform: 'translateX(-60%) translateZ(-200px) scale(0.8)',
        opacity: 0.7,
        zIndex: 40,
      }
    } else {
      // Hidden cards
      return {
        transform: 'translateX(0) translateZ(-400px) scale(0.6)',
        opacity: 0,
        zIndex: 30,
      }
    }
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-medium text-xl">Bu kategoride proje bulunamadı</p>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            🎨 3D Portfolio Galerisi
          </h2>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Tamamladığımız projeler ve başarı hikayeleri
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat)
                setActiveIndex(0)
              }}
              className={`px-6 py-3 rounded-full font-black text-sm transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-110'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat === 'all' ? 'Tümü' : cat}
            </button>
          ))}
        </div>

        {/* 3D Card Carousel */}
        <div 
          className="relative h-[600px] flex items-center justify-center mb-16"
          style={{ perspective: '1500px' }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="absolute w-full max-w-2xl transition-all duration-500 ease-out"
              style={getCardStyle(index)}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-blue-500/50 transition-all">
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-40`}></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-4 py-2 rounded-full text-white text-sm font-black bg-gradient-to-r ${project.color}`}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-gray-900 mb-4">
                    {project.title}
                  </h3>

                  <p className="text-lg text-gray-600 font-medium mb-6 leading-tight">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-3xl">←</span>
          </button>

          {/* Progress dots */}
          <div className="flex gap-3">
            {filteredProjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setTimeout(() => {
                      setActiveIndex(idx)
                      setIsAnimating(false)
                    }, 300)
                  }
                }}
                className={`transition-all rounded-full ${
                  idx === activeIndex
                    ? 'w-12 h-4 bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'w-4 h-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-3xl">→</span>
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-8 text-white font-bold text-lg">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {activeIndex + 1}
          </span>
          <span className="text-gray-400"> / {filteredProjects.length}</span>
        </div>
      </div>
    </section>
  )
}

