import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://okandemir.org'
  // Stabil lastModified — her istekte "şimdi" üretme (crawl sinyali bozulmasın)
  const lastModified = new Date('2026-07-27')

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/hakkimda`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/hizmetler`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projeler`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/referanslar`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/iletisim`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/sss`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sosyal-medya`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${baseUrl}/blog/dijital-pazarlama-trendleri-2025`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms-conditions`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: `${baseUrl}/case-studies/ticimax-e-ticaret-basarisi`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies/tolgademir-portfolyo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/case-studies/hacettepe-isitme-samsun`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ]

  const servicePages: MetadataRoute.Sitemap = [
    'dijital-pazarlama',
    'web-tasarim',
    'gelisim',
    'marka-kimligi',
    'wordpress-tasarim',
    'dijital-donusum',
    'e-ticaret-platformlari',
    'dijital-baslangic-kiti',
    'izmir-dijital-pazarlama',
    'istanbul-dijital-pazarlama',
  ].map((service) => ({
    url: `${baseUrl}/hizmetler/${service}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority:
      service === 'dijital-pazarlama'
        ? 0.95
        : service === 'dijital-baslangic-kiti'
          ? 0.9
          : 0.85,
  }))

  return [...staticPages, ...servicePages]
}
