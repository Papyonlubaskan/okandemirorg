import { MetadataRoute } from 'next'

/**
 * Programatik thin content crawl'ını kes.
 * /blog (trailing slash yok) ve tek indexable yazı Allow ile açık kalır.
 */
const DISALLOW = [
  '/api/',
  '/_next/',
  '/admin/',
  '/seo/',
  '/blog/',
  '/blog/sehir/',
  '/blog/sektor/',
  '/blog/kategori/',
  '/data-deletion-status',
  '/user-data-deletion',
]

const ALLOW = ['/', '/blog', '/blog/dijital-pazarlama-trendleri-2025']

export default function robots(): MetadataRoute.Robots {
  const rule = {
    allow: ALLOW,
    disallow: DISALLOW,
  }

  return {
    rules: [
      { userAgent: '*', ...rule },
      { userAgent: 'Googlebot', ...rule },
      { userAgent: 'Bingbot', ...rule },
      { userAgent: 'Yandex', ...rule },
    ],
    sitemap: 'https://okandemir.org/sitemap.xml',
    host: 'https://okandemir.org',
  }
}
