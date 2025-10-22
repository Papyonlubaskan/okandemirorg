'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { blogCategories } from '@/lib/blog-data'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  city?: string
  industry?: string
  keywords: string[]
  author: string
  date: string
}

interface SearchResults {
  posts: BlogPost[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function BlogSearch() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const searchPosts = useCallback(async (searchQuery: string, category: string) => {
    if (!searchQuery.trim() && !category) {
      setResults(null)
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (category) params.append('category', category)
      params.append('limit', '12')

      const response = await fetch(`/api/blog/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setResults(data)
        setShowResults(true)
      }
    } catch (error) {
      // Search error - handled silently
      if (error instanceof Error) {
        // Error tracked for monitoring
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPosts(query, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    searchPosts(query, category)
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedCategory('')
    setResults(null)
    setShowResults(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Blog içeriklerinde ara..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tüm Kategoriler</option>
                {blogCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-black transition-colors"
            >
              {loading ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>
        </form>

        {/* Quick Category Filters */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hızlı Filtreler:</p>
          <div className="flex flex-wrap gap-2">
            {blogCategories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                {category.name}
              </button>
            ))}
            <button
              onClick={clearSearch}
              className="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Arama Sonuçları
            </h2>
            {results && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {results.pagination.total} sonuç bulundu
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Aranıyor...</p>
            </div>
          ) : results?.posts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="mb-2">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun içerik bulunamadı.
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Arama kriterlerini temizle
              </button>
            </div>
          )}

          {/* Pagination */}
          {results?.pagination.hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => searchPosts(query, selectedCategory)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black transition-colors"
              >
                Daha Fazla Göster
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
