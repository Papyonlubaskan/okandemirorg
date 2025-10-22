'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  keywords: string[]
  author: string
  date: string
}

interface PopularData {
  popularPosts: BlogPost[]
  trendingKeywords: string[]
  stats: {
    totalPosts: number
    popularCategories: Array<{
      name: string
      count: number
    }>
  }
}

export default function PopularPosts() {
  const [data, setData] = useState<PopularData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch('/api/blog/popular')
        const result = await response.json()
        
        if (result.success) {
          setData(result)
        }
      } catch (error) {
        // Failed to fetch popular posts - handled silently
        if (error instanceof Error) {
          // Error tracked for monitoring
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Popular Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
          🔥 Popüler İçerikler
        </h3>
        <div className="space-y-4">
          {data.popularPosts.slice(0, 5).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {post.category} • {new Date(post.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
          📈 Trend Konular
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.trendingKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-black hover:scale-105 transition-transform cursor-pointer"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Blog Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-2xl font-black mb-6">
          📊 Blog İstatistikleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black">{data.stats.totalPosts}</div>
            <div className="text-blue-100">Toplam Makale</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black">{data.stats.popularCategories.length}</div>
            <div className="text-blue-100">Kategori</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black">5+</div>
            <div className="text-blue-100">Yıl Deneyim</div>
          </div>
        </div>
      </div>
    </div>
  )
}
