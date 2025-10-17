import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/okan-demir-logo.png',
  url = 'https://okandemir.org',
  type = 'website',
  author = 'Okan Demir',
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const fullTitle = `${title} | Okan Demir`
  const fullImage = image.startsWith('http') ? image : `https://okandemir.org${image}`
  
  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      'Okan Demir',
      'Dijital Pazarlama',
      'Web Tasarım',
      'SEO',
      'Google Ads',
      'Meta Business',
    ],
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale: 'tr_TR',
      url,
      title: fullTitle,
      description,
      siteName: 'Okan Demir',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@okandemir',
    },
    alternates: {
      canonical: url,
    },
  }
}

// JSON-LD Structured Data Generator
export function generateJSONLD(data: {
  type: 'Person' | 'WebSite' | 'Organization' | 'Service' | 'Article'
  name: string
  description?: string
  url?: string
  image?: string
  [key: string]: unknown
}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    description: data.description,
    url: data.url || 'https://okandemir.org',
    image: data.image || 'https://okandemir.org/okan-demir-profile.webp',
  }

  // Add type-specific properties
  if (data.type === 'Person') {
    return {
      ...baseData,
      jobTitle: 'Dijital Pazarlama Uzmanı',
      worksFor: {
        '@type': 'Organization',
        name: 'Okan Demir',
      },
      sameAs: [
        'https://www.linkedin.com/in/okan-demir-9a09982a6/',
        'https://www.instagram.com/okandemirbrand/',
        'https://www.youtube.com/@okandemirorg',
      ],
    }
  }

  if (data.type === 'Service') {
    return {
      ...baseData,
      provider: {
        '@type': 'Person',
        name: 'Okan Demir',
        url: 'https://okandemir.org',
      },
      areaServed: 'TR',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: 'https://okandemir.org/iletisim',
      },
    }
  }

  return baseData
}

