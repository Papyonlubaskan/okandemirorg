import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    const channelId = process.env.YOUTUBE_CHANNEL_ID
    
    // Eğer API key ve channel ID varsa, YouTube Data API v3 kullan
    if (apiKey && channelId) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${apiKey}`,
          {
            next: { revalidate: 3600 },
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          const videos = data.items?.map((item: {
            id: { videoId: string };
            snippet: {
              title: string;
              thumbnails: {
                high?: { url: string };
                default?: { url: string };
              };
              publishedAt: string;
            };
          }) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            publishedAt: item.snippet.publishedAt
          })) || []
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ YouTube API ile ${videos.length} video alındı`)
          }
          return NextResponse.json({ videos, source: 'youtube_api' })
        }
      } catch (apiError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ YouTube API hatası, RSS feed deneniyor:', apiError)
        }
      }
    }
    
    // Fallback: RSS feed kullan
    const possibleUrls = [
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId || 'UCITScioEO2DHLU5tvy01IzA'}`,
      'https://www.youtube.com/feeds/videos.xml?user=PapyonluBaskan',
      'https://www.youtube.com/@PapyonluBaskan/videos.rss',
    ]
    
    let xmlText = ''
    let success = false
    let workingUrl = ''
    
    for (const rssUrl of possibleUrls) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Deneniyor:', rssUrl)
        }
        const response = await fetch(rssUrl, {
          next: { revalidate: 3600 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        
        if (response.ok) {
          xmlText = await response.text()
          success = true
          workingUrl = rssUrl
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Başarılı URL:', rssUrl)
          }
          break
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('❌ HTTP Error:', response.status, rssUrl)
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Bu URL çalışmadı:', rssUrl, err instanceof Error ? err.message : 'Unknown error')
        }
        continue
      }
    }
    
    if (!success) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Hiçbir RSS feed URL\'si çalışmadı')
      }
      return NextResponse.json({ 
        videos: [], 
        error: 'YouTube kanal RSS feed\'i bulunamadı',
        triedUrls: possibleUrls 
      }, { status: 404 })
    }
    
    // XML'den video bilgilerini parse et
    const videos = []
    const entryRegex = /<entry>[\s\S]*?<\/entry>/g
    const entries = xmlText.match(entryRegex) || []
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📹 ${entries.length} video entry'si bulundu`)
    }
    
    for (const entry of entries.slice(0, 6)) { // Son 6 video
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
      const titleMatch = entry.match(/<title>(.*?)<\/title>/)
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      
      if (videoIdMatch && titleMatch && publishedMatch) {
        videos.push({
          id: videoIdMatch[1],
          title: titleMatch[1],
          thumbnail: `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
          publishedAt: publishedMatch[1]
        })
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ RSS feed ile ${videos.length} video parse edildi`)
    }
    return NextResponse.json({ videos, workingUrl, source: 'rss_feed' })
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ YouTube feed hatası:', error)
    }
    return NextResponse.json({ videos: [] }, { status: 500 })
  }
}

