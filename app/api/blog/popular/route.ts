import { NextRequest, NextResponse } from 'next/server'
import { generateBlogPosts } from '@/lib/blog-data'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/api-security'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`blog-popular:${ip}`, 60, 15 * 60 * 1000)) {
    return rateLimitResponse()
  }

  try {
    const allPosts = generateBlogPosts()
    
    // Popüler kategorilere göre sıralama
    const popularCategories = ['Dijital Pazarlama', 'SEO Optimizasyonu', 'Web Tasarım', 'Sosyal Medya', 'Google Ads']
    
    const popularPosts = allPosts
      .filter(post => popularCategories.includes(post.category))
      .sort((a, b) => {
        // Kategori önceliğine göre sırala
        const aIndex = popularCategories.indexOf(a.category)
        const bIndex = popularCategories.indexOf(b.category)
        return aIndex - bIndex
      })
      .slice(0, 10)

    // Trend anahtar kelimeler
    const trendingKeywords = [
      'dijital pazarlama 2025',
      'SEO teknikleri',
      'Google Ads optimizasyonu',
      'sosyal medya stratejisi',
      'web tasarım trendleri',
      'e-ticaret pazarlama',
      'Instagram algoritması',
      'YouTube SEO',
      'e-posta pazarlama',
      'dijital dönüşüm'
    ]

    return NextResponse.json({
      success: true,
      popularPosts,
      trendingKeywords,
      stats: {
        totalPosts: allPosts.length,
        popularCategories: popularCategories.map(cat => ({
          name: cat,
          count: allPosts.filter(post => post.category === cat).length
        }))
      }
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Popüler içerikler yüklenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
