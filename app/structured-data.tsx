import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Okan Demir",
    "jobTitle": "Dijital Pazarlama Uzmanı",
    "description": "Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi uzmanı",
    "url": "https://okandemir.org",
    "image": "https://okandemir.org/okan-about-photo.webp",
    "sameAs": [
      "https://wa.me/+905552677739"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    },
    "offers": {
      "@type": "Offer",
      "description": "Dijital Pazarlama ve Web Tasarım Hizmetleri",
      "category": "Digital Marketing Services"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Dijital Pazarlama Uzmanı",
      "description": "Web tasarım, SEO, Google Ads, Meta Business, sosyal medya yönetimi"
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
