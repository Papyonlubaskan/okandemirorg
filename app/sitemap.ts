import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://okandemir.org'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/hakkimda`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/hizmetler`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projeler`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/referanslar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/sss`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sosyal-medya`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog/dijital-pazarlama-trendleri-2025`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/case-studies/ticimax-e-ticaret-basarisi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/case-studies/tolgademir-portfolyo`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/case-studies/hacettepe-isitme-samsun`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
  ]

  const servicePages: MetadataRoute.Sitemap = [
    'dijital-pazarlama',
    'web-tasarim',
    'gelisim',
    'marka-kimligi',
    'wordpress-tasarim',
    'dijital-donusum',
    'e-ticaret-platformlari',
    'izmir-dijital-pazarlama',
    'istanbul-dijital-pazarlama',
  ].map((service) => ({
    url: `${baseUrl}/hizmetler/${service}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: service === 'dijital-pazarlama' ? 0.95 : 0.85,
  }))

  return [...staticPages, ...servicePages]
}
