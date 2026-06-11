import Script from 'next/script'
import { OKAN_DEMIR, PERSON_ID, SITE_URL } from '@/lib/brand-seo'

/** Hakkımda sayfası için ProfilePage schema (Person global layout'ta) */
export default function OkanDemirProfileSchema() {
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/hakkimda#webpage`,
    url: `${SITE_URL}/hakkimda`,
    name: 'Okan Demir Kimdir?',
    description: OKAN_DEMIR.description,
    inLanguage: 'tr-TR',
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: OKAN_DEMIR.name },
    mainEntity: { '@id': PERSON_ID },
    about: { '@id': PERSON_ID },
  }

  return (
    <Script
      id="okan-demir-profilepage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
    />
  )
}
