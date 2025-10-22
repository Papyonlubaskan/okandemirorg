import { generateBlogPosts } from '@/lib/blog-data'

export async function GET() {
  const posts = generateBlogPosts().slice(0, 100)
  
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Okan Demir - Dijital Pazarlama ve Web Tasarım</title>
    <description>Dijital pazarlama, web tasarım ve geliştirme konularında uzman içerikler</description>
    <link>https://okandemir.org</link>
    <atom:link href="https://okandemir.org/feed.xml" rel="self" type="application/rss+xml"/>
    <language>tr</language>
    <managingEditor>info@okandemir.org (Okan Demir)</managingEditor>
    <webMaster>info@okandemir.org (Okan Demir)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>https://okandemir.org/blog/${post.slug}</link>
      <guid isPermaLink="true">https://okandemir.org/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
      <author>info@okandemir.org (Okan Demir)</author>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}