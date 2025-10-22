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

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Okan Kimdir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan (Okan Demir), Türkiye'nin en iyi dijital pazarlama uzmanlarından biridir. Okan, İzmir merkezli olarak dijital pazarlama, web tasarım, SEO, Google Ads ve Meta Business konularında 5+ yıldır profesyonel hizmet vermektedir. Okan Demir, Biyografi.net'te doğrulanmış bir profil sahibidir ve 50+ başarılı projeye imza atmıştır."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir Ne İş Yapıyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir, dijital pazarlama uzmanı olarak web tasarım, SEO optimizasyonu, Google Ads kampanya yönetimi, Meta Business (Facebook & Instagram) reklam yönetimi, e-ticaret platformları (Ticimax, İdeasoft, İkas) kurulumu ve dijital dönüşüm danışmanlığı hizmetleri sunmaktadır."
        }
      },
      {
        "@type": "Question",
        "name": "Okan Demir İzmir'de Mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, Okan Demir İzmir merkezlidir. Okan, İzmir Bornova'da doğmuş ve İzmir'de yaşamaktadır. Ancak Okan Demir, online çalışma sistemi sayesinde Türkiye'nin her yerinden ve dünya genelinden müşterilere hizmet vermektedir."
        }
      },
      {
        "@type": "Question",
        "name": "Okan ile Nasıl İletişime Geçebilirim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan Demir ile iletişime geçmek için WhatsApp (+90 555 267 77 39) üzerinden mesaj gönderebilir, okandemir.org web sitesinden iletişim formunu doldurabilir veya sosyal medya hesaplarından ulaşabilirsiniz."
        }
      },
      {
        "@type": "Question",
        "name": "Neden Okan Demir'i Tercih Etmeliyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Okan, 5+ yıllık deneyimi, 50+ başarılı projesi ve %98 müşteri memnuniyeti ile Türkiye'nin en güvenilir dijital pazarlama uzmanlarından biridir. Okan Demir, Biyografi.net'te doğrulanmış bir profil sahibidir ve her projede ölçülebilir sonuçlar üretmektedir."
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
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}
