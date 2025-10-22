import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Instagram RSS feed URL'i
    const instagramRssUrl = 'https://rss.bridge.su/instagram.com/okandemirorg'
    
    const response = await fetch(instagramRssUrl)
    
    if (!response.ok) {
      throw new Error(`RSS feed error: ${response.status}`)
    }

    const rssData = await response.text()
    
    // RSS'i JSON'a çevir
    const posts = parseRssToJson(rssData)
    
    return NextResponse.json({
      success: true,
      posts: posts,
      count: posts.length,
      source: 'RSS Feed'
    })

  } catch (error) {
    // Error handled silently
    return NextResponse.json({
      success: false,
      error: 'Instagram RSS feed yüklenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function parseRssToJson(rssText: string) {
  try {
    // Basit RSS parser
    const posts = []
    const itemMatches = rssText.match(/<item>[\s\S]*?<\/item>/g)
    
    if (itemMatches) {
      for (const item of itemMatches.slice(0, 6)) { // Son 6 post
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
        const linkMatch = item.match(/<link>(.*?)<\/link>/)
        const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)
        const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)
        
        if (titleMatch && linkMatch) {
          posts.push({
            id: linkMatch[1].split('/').pop(),
            title: titleMatch[1],
            link: linkMatch[1],
            description: descriptionMatch ? descriptionMatch[1] : '',
            pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
            media_type: 'IMAGE'
          })
        }
      }
    }
    
    return posts
  } catch (_error) {
    // RSS parsing error - return empty array
    return []
  }
}
