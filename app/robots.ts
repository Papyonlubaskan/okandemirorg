import { MetadataRoute } from 'next'

const PROGRAMMATIC_DISALLOW = [
  '/seo/',
  '/blog/sehir/',
  '/blog/sektor/',
  '/blog/kategori/',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', ...PROGRAMMATIC_DISALLOW],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', ...PROGRAMMATIC_DISALLOW],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', ...PROGRAMMATIC_DISALLOW],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', ...PROGRAMMATIC_DISALLOW],
      },
    ],
    sitemap: 'https://okandemir.org/sitemap.xml',
    host: 'https://okandemir.org',
  }
}
