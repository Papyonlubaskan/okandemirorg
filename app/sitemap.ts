import { MetadataRoute } from 'next'
import { blogCategories, cities, industries, generateBlogPosts } from '@/lib/blog-data'
import { generateSEOPages } from '@/lib/seo-data-generator'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://okandemir.org'
  const now = new Date()
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projeler`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hizmetler`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hakkimda`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Hizmet Sayfaları
  const servicePages: MetadataRoute.Sitemap = [
    'web-tasarim',
    'gelisim',
    'marka-kimligi',
    'dijital-pazarlama',
    'wordpress-tasarim',
    'dijital-donusum',
  ].map((service) => ({
    url: `${baseUrl}/hizmetler/${service}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Blog Kategorileri (10 kategori)
  const categoryPages: MetadataRoute.Sitemap = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/kategori/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Şehir Sayfaları (81 il)
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/blog/sehir/${city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // Sektör Sayfaları (60+ sektör)
  const industryPages: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${baseUrl}/blog/sektor/${industry.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // Blog Postları (İlk 1000 tanesi)
  const posts = generateBlogPosts()
  const blogPages: MetadataRoute.Sitemap = posts.slice(0, 1000).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // SEO Sayfaları (İlk 1500 tanesi)
  const seoPages = generateSEOPages()
  const seoPageUrls: MetadataRoute.Sitemap = seoPages.slice(0, 1500).map((page) => ({
    url: `${baseUrl}/seo/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  // Tüm sayfaları birleştir
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...categoryPages,
    ...cityPages,
    ...industryPages,
    ...blogPages,
    ...seoPageUrls,
  ]

  console.log(`
    ========================================
    🚀 SITEMAP OLUŞTURULDU 🚀
    ========================================
    📊 Toplam Sayfa Sayısı: ${allPages.length}
    
    Detaylar:
    ✓ Statik Sayfalar: ${staticPages.length}
    ✓ Hizmet Sayfaları: ${servicePages.length}
    ✓ Blog Kategorileri: ${categoryPages.length}
    ✓ Şehir Sayfaları: ${cityPages.length}
    ✓ Sektör Sayfaları: ${industryPages.length}
    ✓ Blog Yazıları: ${blogPages.length}
    ✓ SEO Sayfaları: ${seoPageUrls.length}
    ========================================
  `)

  return allPages
}