import Script from 'next/script'
import { OKAN_BIRTH_DATE } from '@/lib/profile'
import { OKAN_DEMIR, PERSON_ID, SITE_URL } from '@/lib/brand-seo'

/** Hakkımda sayfası için ProfilePage + güçlendirilmiş Person schema */
export default function OkanDemirProfileSchema() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: OKAN_DEMIR.name,
    alternateName: OKAN_DEMIR.alternateName,
    jobTitle: OKAN_DEMIR.jobTitle,
    description: OKAN_DEMIR.description,
    url: SITE_URL,
    image: OKAN_DEMIR.image,
    email: OKAN_DEMIR.email,
    telephone: OKAN_DEMIR.phoneDisplay,
    birthDate: OKAN_BIRTH_DATE,
    birthPlace: { '@type': 'Place', name: OKAN_DEMIR.birthPlace },
    nationality: { '@type': 'Country', name: 'Türkiye' },
    sameAs: OKAN_DEMIR.sameAs,
    worksFor: {
      '@type': 'Organization',
      name: 'Okan Demir — Dijital Pazarlama',
      url: SITE_URL,
    },
    knowsAbout: [
      'Dijital Pazarlama',
      'Web Tasarım',
      'SEO',
      'Google Ads',
      'Meta Ads',
      'E-Ticaret',
    ],
  }

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
    <>
      <Script
        id="okan-demir-person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <Script
        id="okan-demir-profilepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
    </>
  )
}
