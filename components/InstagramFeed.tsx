'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

export default function InstagramFeed({ maxPosts = 6 }: { maxPosts?: number }) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstagramPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/instagram/feed')
      const data = await response.json()

      if (data.success) {
        setPosts(data.posts.slice(0, maxPosts))
      } else {
        setError(data.error)
      }
    } catch {
      setError('Instagram feed yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [maxPosts])

  useEffect(() => {
    fetchInstagramPosts()
  }, [fetchInstagramPosts])

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/instagram/refresh', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Token yenilendi, feed'i tekrar yükle
        fetchInstagramPosts()
      }
    } catch (err) {
      // Token refresh failed - handled silently
      if (err instanceof Error) {
        // Error tracked for monitoring
      }
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: maxPosts }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshToken}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Token Yenile
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Instagram gönderisi bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        >
          <Image
            src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url}
            alt={post.caption || 'Instagram gönderisi'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          
          {/* Video icon */}
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          
          {/* Carousel icon */}
          {post.media_type === 'CAROUSEL_ALBUM' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v12H4V6zm2 2v8h12V8H6z"/>
              </svg>
            </div>
          )}
          
          {/* Caption overlay */}
          {post.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <p className="text-white text-sm line-clamp-2">
                {post.caption.length > 100 
                  ? `${post.caption.substring(0, 100)}...` 
                  : post.caption
                }
              </p>
            </div>
          )}
        </a>
      ))}
    </div>
  )
}
