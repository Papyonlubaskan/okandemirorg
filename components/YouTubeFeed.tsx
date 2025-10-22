'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Video {
  id: string
  title: string
  thumbnail: string
  url: string
  publishedAt: string
}

export default function YouTubeFeed() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    fetch('/api/youtube-feed')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos || [])
        if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0]) // İlk videoyu seç
        }
        setLoading(false)
      })
      .catch(err => {
        // Video load error - handled silently
        if (err instanceof Error && process.env.NODE_ENV === 'development') {
          // Development: errors visible in server logs
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="aspect-video w-full rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Videolar yüklenemedi</p>
        <a 
          href="https://www.youtube.com/@PapyonluBaskan/videos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-black transition-all duration-300 hover:scale-105"
        >
          YouTube Kanalına Git
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Ana Video Player */}
      {selectedVideo && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=0&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&showinfo=0&controls=1&disablekb=0&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            className="w-full h-full"
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>
      )}

      {/* Video Başlığı */}
      {selectedVideo && (
        <div className="px-2">
          <h4 className="text-lg font-black text-gray-900 dark:text-white line-clamp-2">
            {selectedVideo.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {new Date(selectedVideo.publishedAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Video Thumbnail Grid */}
      <div className="grid grid-cols-3 gap-3">
        {videos.slice(0, 6).map((video) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className={`group relative aspect-video rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
              selectedVideo?.id === video.id ? 'ring-2 ring-red-600' : ''
            }`}
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Kanal Linki */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <div>
          <p className="font-black text-gray-900 dark:text-white">@PapyonluBaskan</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">YouTube Kanalım</p>
        </div>
        <a 
          href="https://www.youtube.com/@PapyonluBaskan/videos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-black text-sm transition-all duration-300 hover:scale-105"
        >
          Tüm Videolar
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

