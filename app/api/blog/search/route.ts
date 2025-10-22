import { NextRequest, NextResponse } from 'next/server'
import { generateBlogPosts, blogCategories } from '@/lib/blog-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const allPosts = generateBlogPosts()
    let filteredPosts = allPosts

    // Arama sorgusu varsa filtrele
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      )
    }

    // Kategori filtresi
    if (category) {
      const categoryObj = blogCategories.find(cat => cat.slug === category)
      if (categoryObj) {
        filteredPosts = filteredPosts.filter(post => post.category === categoryObj.name)
      }
    }

    // Sayfalama
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)
    const totalCount = filteredPosts.length

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      query: {
        search: query,
        category: category
      }
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Arama yapılamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
