import Script from 'next/script';
import { OKAN_BIRTH_DATE } from '@/lib/profile';
import { OKAN_DEMIR, PERSON_ID, SITE_URL } from '@/lib/brand-seo';

export default function StructuredData() {
  const personData = {
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
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressRegion: 'İzmir',
    },
    knowsAbout: [
      'Dijital Pazarlama',
      'Web Tasarım',
      'SEO',
      'Google Ads',
      'Meta Ads',
      'E-Ticaret',
      'Ticimax',
      'İkas',
    ],
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Okan Demir — Dijital Pazarlama',
    alternateName: OKAN_DEMIR.name,
    url: SITE_URL,
    logo: OKAN_DEMIR.logo,
    description: OKAN_DEMIR.description,
    founder: { '@id': PERSON_ID },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-555-267-77-39',
      contactType: 'customer service',
      availableLanguage: 'Turkish',
    },
    sameAs: OKAN_DEMIR.sameAs,
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Okan Demir — Resmi Web Sitesi',
    alternateName: ['Okan Demir', 'okandemir.org'],
    url: SITE_URL,
    author: { '@id': PERSON_ID },
    description: OKAN_DEMIR.description,
    inLanguage: 'tr-TR',
  };

  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Dijital Pazarlama Hizmetleri',
    provider: { '@id': PERSON_ID },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    description: OKAN_DEMIR.description,
  };

  return (
    <>
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="service-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
        strategy="beforeInteractive"
      />
    </>
  );
}
