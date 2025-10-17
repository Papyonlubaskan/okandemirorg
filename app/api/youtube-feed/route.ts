import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // YouTube kanal RSS feed URL'lerini dene
    const possibleUrls = [
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCITScioEO2DHLU5tvy01IzA',
      'https://www.youtube.com/feeds/videos.xml?user=PapyonluBaskan',
      'https://www.youtube.com/@PapyonluBaskan/videos.rss',
    ]
    
    let xmlText = ''
    let success = false
    let workingUrl = ''
    
    for (const rssUrl of possibleUrls) {
      try {
        console.log('Deneniyor:', rssUrl)
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
          console.log('✅ Başarılı URL:', rssUrl)
          break
        } else {
          console.log('❌ HTTP Error:', response.status, rssUrl)
        }
      } catch (err) {
        console.log('❌ Bu URL çalışmadı:', rssUrl, err instanceof Error ? err.message : 'Unknown error')
        continue
      }
    }
    
    if (!success) {
      console.log('❌ Hiçbir RSS feed URL\'si çalışmadı')
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
    
    console.log(`📹 ${entries.length} video entry'si bulundu`)
    
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
    
    console.log(`✅ ${videos.length} video parse edildi`)
    return NextResponse.json({ videos, workingUrl })
    
  } catch (error) {
    console.error('❌ YouTube feed hatası:', error)
    return NextResponse.json({ videos: [] }, { status: 500 })
  }
}

