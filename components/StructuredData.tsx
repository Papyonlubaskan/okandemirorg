export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "O Copyright© Dijital Pazarlama & Yazılım | Okan Demir",
    "alternateName": ["Okan Demir", "O Copyright Dijital Pazarlama", "Okan Demir Dijital Pazarlama"],
    "url": "https://okandemir.org",
    "logo": "https://okandemir.org/okan-demir-logo.png",
    "image": "https://okandemir.org/okan-demir-profile.webp",
    "description": "Okan Demir - Türkiye'nin En Deneyimli Dijital Pazarlama Uzmanı. SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi, Web Tasarım, WordPress Geliştirme ve Dijital Dönüşüm Hizmetleri.",
    "founder": {
      "@type": "Person",
      "name": "Okan Demir",
      "jobTitle": "Dijital Pazarlama Uzmanı & Web Tasarımcı",
      "image": "https://okandemir.org/okan-demir-profile.webp",
      "url": "https://okandemir.org/about",
      "sameAs": [
        "https://www.facebook.com/ocopyrightdijitalpazarlamayazilim/",
        "https://x.com/papyonlubaskan",
        "https://www.instagram.com/okandemirorg",
        "https://www.tiktok.com/@papyonlubaskan",
        "https://www.youtube.com/@PapyonluBaskan",
        "https://www.linkedin.com/in/okan-demir-55a022224/"
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": "Türkiye"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-555-267-77-39",
      "contactType": "customer service",
      "email": "info@okandemir.org",
      "availableLanguage": "Turkish"
    },
    "sameAs": [
      "https://www.facebook.com/ocopyrightdijitalpazarlamayazilim/",
      "https://x.com/papyonlubaskan",
      "https://www.instagram.com/okandemirorg",
      "https://www.tiktok.com/@papyonlubaskan",
      "https://www.youtube.com/@PapyonluBaskan",
      "https://www.linkedin.com/in/okan-demir-55a022224/"
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Su 09:00-18:00",
    "areaServed": {
      "@type": "Country",
      "name": "Turkey"
    },
    "serviceType": [
      "Dijital Pazarlama",
      "Web Tasarımı",
      "Google Ads",
      "Meta Ads",
      "SEO",
      "WordPress Geliştirme",
      "Marka Kimliği",
      "Sosyal Medya Yönetimi"
    ]
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Okan Demir",
    "url": "https://okandemir.org",
    "image": "https://okandemir.org/okan-demir-profile.webp",
    "jobTitle": "Dijital Pazarlama Uzmanı & Web Tasarımcı",
    "worksFor": {
      "@type": "Organization",
      "name": "O Copyright Dijital Pazarlama & Yazılım"
    },
    "sameAs": [
      "https://www.facebook.com/ocopyrightdijitalpazarlamayazilim/",
      "https://x.com/papyonlubaskan",
      "https://www.instagram.com/okandemirorg",
      "https://www.tiktok.com/@papyonlubaskan",
      "https://www.youtube.com/@PapyonluBaskan",
      "https://www.linkedin.com/in/okan-demir-55a022224/"
    ],
    "email": "info@okandemir.org",
    "telephone": "+90-555-267-77-39",
    "knowsAbout": [
      "Dijital Pazarlama",
      "Web Tasarımı",
      "Google Ads",
      "Meta Ads",
      "SEO",
      "WordPress",
      "Marka Kimliği",
      "Sosyal Medya"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Okan Demir",
    "url": "https://okandemir.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://okandemir.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://okandemir.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Hizmetler",
        "item": "https://okandemir.org/hizmetler"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Hakkımda",
        "item": "https://okandemir.org/hakkimda"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "İletişim",
        "item": "https://okandemir.org/iletisim"
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Okan Demir kimdir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, Türkiye'nin en deneyimli dijital pazarlama uzmanlarından biridir. SEO, Google Ads, Meta Business, sosyal medya yönetimi, web tasarım ve dijital dönüşüm alanlarında profesyonel hizmet vermektedir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir hangi hizmetleri sunuyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir; dijital pazarlama, SEO, Google Ads, Meta Business Suite kurulumu, sosyal medya yönetimi, web tasarım, WordPress geliştirme, e-ticaret çözümleri ve dijital dönüşüm danışmanlığı hizmetleri sunmaktadır."
        }
      },
      {
        "@type": "Question",
        "name": "Dijital pazarlama nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dijital pazarlama, internet ve dijital kanallar aracılığıyla ürün veya hizmetlerin tanıtımı ve satışının yapılması sürecidir. SEO, Google Ads, sosyal medya pazarlama, email pazarlama ve içerik pazarlaması gibi yöntemleri içerir."
        }
      },
      {
        "@type": "Question",
        "name": "SEO nedir ve neden önemlidir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO (Search Engine Optimization - Arama Motoru Optimizasyonu), web sitenizin Google gibi arama motorlarında üst sıralarda çıkmasını sağlayan teknik ve stratejik çalışmalardır. Organik trafik artışı ve marka bilinirliği için kritik önem taşır."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

