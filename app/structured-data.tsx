import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Okan Demir",
    "alternateName": "Okan",
    "jobTitle": "Dijital Pazarlama Uzmanı",
    "description": "Okan Demir - Türkiye'nin en iyi dijital pazarlama uzmanı, web tasarımcı ve e-ticaret platform uzmanı. Okan olarak dijital pazarlama, SEO, web tasarım konularında uzman. Ticimax, İdeasoft, İkas uzmanı.",
    "url": "https://okandemir.org",
    "image": "https://okandemir.org/okan-about-photo.webp",
    "birthDate": "1993-03-07",
    "birthPlace": {
      "@type": "Place",
      "name": "Bornova, İzmir, Türkiye"
    },
    "nationality": "Turkish",
    "sameAs": [
      "https://biyografi.net/okan-demir",
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

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Okan Demir - Dijital Pazarlama Uzmanı",
    "alternateName": "Okan Demir",
    "url": "https://okandemir.org",
    "logo": "https://okandemir.org/okan-demir-logo.png",
    "description": "Okan Demir - Türkiye'nin en iyi dijital pazarlama uzmanı. Dijital pazarlama, web tasarım, SEO, Google Ads, Meta Business hizmetleri. Okan olarak profesyonel dijital çözümler.",
    "founder": {
      "@type": "Person",
      "name": "Okan Demir"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressRegion": "İzmir"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-555-267-77-39",
      "contactType": "customer service",
      "availableLanguage": "Turkish"
    },
    "sameAs": [
      "https://biyografi.net/okan-demir",
      "https://wa.me/+905552677739",
      "https://www.instagram.com/okandemirorg",
      "https://www.youtube.com/@PapyonluBaskan",
      "https://www.linkedin.com/in/okan-demir",
      "https://twitter.com/okandemirorg",
      "https://www.facebook.com/okandemirorg"
    ],
    "serviceType": [
      "Dijital Pazarlama",
      "Web Tasarım",
      "SEO",
      "Google Ads",
      "Meta Business",
      "E-ticaret Platformları"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Okan Demir - Dijital Pazarlama Uzmanı",
    "alternateName": ["Okan", "Okan Demir", "Okan Demir İzmir", "Okan İzmir", "Okan Demir Dijital Pazarlama", "Okan Demir Web Tasarım"],
    "url": "https://okandemir.org",
    "description": "Okan Demir, Türkiye'nin en iyi dijital pazarlama uzmanı. İzmir merkezli, online hizmet veren profesyonel dijital pazarlama danışmanı.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://okandemir.org/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "tr-TR"
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Anasayfa",
        "item": "https://okandemir.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Hakkımda - Okan Demir Kimdir",
        "item": "https://okandemir.org/hakkimda"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Dijital Pazarlama Hizmetleri",
        "item": "https://okandemir.org/hizmetler/dijital-pazarlama"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Web Tasarım Hizmetleri",
        "item": "https://okandemir.org/hizmetler/web-tasarim"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "İletişim - Okan ile İletişim",
        "item": "https://okandemir.org/iletisim"
      }
    ]
  };

  const reviewData = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "Person",
      "name": "Okan Demir"
    },
    "ratingValue": "4.9",
    "reviewCount": "98",
    "bestRating": "5",
    "worstRating": "1"
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Okan Demir - Dijital Pazarlama Uzmanı",
    "alternateName": "Okan Demir",
    "image": "https://okandemir.org/okan-demir-logo.png",
    "description": "Okan Demir, Türkiye'nin en iyi dijital pazarlama uzmanı. İzmir merkezli, online hizmet veren profesyonel dijital pazarlama danışmanı. Okan Demir dijital pazarlama, web tasarım, SEO, Google Ads, Meta Business hizmetleri sunmaktadır.",
    "url": "https://okandemir.org",
    "telephone": "+90-555-267-77-39",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bornova",
      "addressRegion": "İzmir",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.4622",
      "longitude": "27.2208"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Türkiye"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Türkiye"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Dijital Pazarlama Hizmetleri",
    "provider": {
      "@type": "Person",
      "name": "Okan Demir",
      "url": "https://okandemir.org"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Türkiye"
    },
    "description": "Okan Demir dijital pazarlama, web tasarım, SEO, Google Ads, Meta Business, e-ticaret platform uzmanlığı hizmetleri sunmaktadır. Okan Demir ile profesyonel dijital çözümler.",
    "offers": {
      "@type": "Offer",
      "description": "Dijital Pazarlama ve Web Tasarım Hizmetleri - Okan Demir"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Okan Demir Kimdir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, Türkiye'nin en iyi dijital pazarlama uzmanlarından biridir. Okan Demir, İzmir merkezli olarak dijital pazarlama, web tasarım, SEO, Google Ads ve Meta Business konularında 5+ yıldır profesyonel hizmet vermektedir. Okan Demir, Biyografi.net'te doğrulanmış bir profil sahibidir ve 50+ başarılı projeye imza atmıştır. Okan Demir, Okan olarak da bilinmektedir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir Ne İş Yapıyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, dijital pazarlama uzmanı olarak web tasarım, SEO optimizasyonu, Google Ads kampanya yönetimi, Meta Business (Facebook & Instagram) reklam yönetimi, e-ticaret platformları (Ticimax, İdeasoft, İkas) kurulumu ve dijital dönüşüm danışmanlığı hizmetleri sunmaktadır. Okan Demir, Türkiye'nin en iyi dijital pazarlama uzmanlarından biridir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir İzmir'de Mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, Okan Demir İzmir merkezlidir. Okan Demir, İzmir Bornova'da doğmuş ve İzmir'de yaşamaktadır. Ancak Okan Demir, online çalışma sistemi sayesinde Türkiye'nin her yerinden ve dünya genelinden müşterilere hizmet vermektedir. Okan Demir İzmir'de ikamet etmektedir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir ile Nasıl İletişime Geçebilirim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir ile iletişime geçmek için WhatsApp (+90 555 267 77 39) üzerinden mesaj gönderebilir, okandemir.org web sitesinden iletişim formunu doldurabilir veya sosyal medya hesaplarından ulaşabilirsiniz. Okan Demir hızlı yanıt vermektedir."
        }
      },
      {
        "@type": "Question",
        "name": "Neden Okan Demir'i Tercih Etmeliyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, 5+ yıllık deneyimi, 50+ başarılı projesi ve %98 müşteri memnuniyeti ile Türkiye'nin en güvenilir dijital pazarlama uzmanlarından biridir. Okan Demir, Biyografi.net'te doğrulanmış bir profil sahibidir ve her projede ölçülebilir sonuçlar üretmektedir. Okan Demir ile çalışmak garantili başarı demektir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir Kimdir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, Türkiye'nin en iyi dijital pazarlama uzmanlarından biridir. Okan Demir İzmir merkezli olarak çalışmakta ve dijital pazarlama, web tasarım, SEO, Google Ads, Meta Business konularında uzmanlaşmıştır. Okan Demir, Okan olarak da bilinmektedir."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="review-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewData) }}
        strategy="beforeInteractive"
      />
      <Script
        id="localbusiness-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
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
