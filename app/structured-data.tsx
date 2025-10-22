import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Okan Demir",
    "alternateName": "Okan",
    "jobTitle": "Dijital Pazarlama Uzmanı",
    "description": "Okan Demir - Türkiye'nin önde gelen dijital pazarlama uzmanı, web tasarımcı ve e-ticaret platform uzmanı. Ticimax, İdeasoft, İkas uzmanı.",
    "url": "https://okandemir.org",
    "image": "https://okandemir.org/okan-about-photo.webp",
    "birthDate": "1993-03-07",
    "birthPlace": {
      "@type": "Place",
      "name": "Bornova, İzmir, Türkiye"
    },
    "nationality": "Turkish",
    "sameAs": [
      "https://wa.me/+905552677739",
      "https://www.instagram.com/okandemirorg",
      "https://www.youtube.com/@PapyonluBaskan",
      "https://www.linkedin.com/in/okan-demir",
      "https://twitter.com/okandemirorg",
      "https://www.facebook.com/okandemirorg"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressRegion": "İzmir"
    },
    "offers": [
      {
        "@type": "Offer",
        "description": "Dijital Pazarlama ve Web Tasarım Hizmetleri",
        "category": "Digital Marketing Services"
      },
      {
        "@type": "Offer", 
        "description": "E-ticaret Platform Uzmanlığı - Ticimax, İdeasoft, İkas",
        "category": "E-commerce Services"
      }
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Dijital Pazarlama Uzmanı",
      "description": "Web tasarım, SEO, Google Ads, Meta Business, sosyal medya yönetimi, e-ticaret platform uzmanlığı"
    },
    "knowsAbout": [
      "Dijital Pazarlama",
      "Web Tasarım", 
      "SEO",
      "Google Ads",
      "Meta Business",
      "E-ticaret",
      "Ticimax",
      "İdeasoft", 
      "İkas",
      "Sosyal Medya Yönetimi"
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
