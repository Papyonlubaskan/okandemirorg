import type { Metadata } from 'next'
import CaseStudyLayout from '@/components/CaseStudyLayout'
import { bilingualDescription, bilingualKeywords } from '@/lib/seo-bilingual'

export const metadata: Metadata = {
  title: 'Hacettepe İşitme Samsun | Corporate Website Case Study | Kurumsal Site',
  description: bilingualDescription(
    'Samsun işitme merkezi Hacettepe İşitme kurumsal web sitesi. Yerel SEO, hizmet tanıtımı ve güven odaklı tasarım — Okan Demir.',
    'Corporate website for Hacettepe Hearing Center Samsun, Turkey. Local SEO, healthcare web design and trust-focused UX by Okan Demir.'
  ),
  keywords: bilingualKeywords(
    [
      'Samsun işitme merkezi web sitesi',
      'kurumsal web tasarım Samsun',
      'sağlık sektörü web sitesi',
      'başarı hikayesi',
      'Okan Demir projeler',
      'Hacettepe İşitme',
    ],
    [
      'Samsun hearing center website',
      'corporate web design Samsun',
      'healthcare website Turkey',
      'case study',
      'Okan Demir projects',
      'Hacettepe Hearing Center',
      'local SEO Samsun',
    ]
  ),
  openGraph: {
    title: 'Hacettepe Hearing Center Samsun | Case Study | Okan Demir',
    description: bilingualDescription(
      'Samsun işitme merkezi kurumsal web sitesi — yerel SEO.',
      'Corporate hearing center website in Samsun — local SEO and service-focused design.'
    ),
    url: 'https://okandemir.org/case-studies/hacettepe-isitme-samsun',
    type: 'article',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
  },
  alternates: {
    canonical: 'https://okandemir.org/case-studies/hacettepe-isitme-samsun',
  },
}

export default function HacettepeIsitmeCaseStudyPage() {
  return (
    <CaseStudyLayout
      slug="hacettepe-isitme-samsun"
      headline="Hacettepe İşitme — Samsun Kurumsal Web Sitesi"
      subtitle="Samsun işitme merkezi için güven veren, yerel arama odaklı kurumsal web deneyimi"
      tags={['Kurumsal Site', 'Sağlık', 'Yerel SEO', 'Samsun']}
      liveUrl="https://hacettepeisitme-web-production.up.railway.app/"
      liveLabel="Canlı Siteyi Gör"
      datePublished="2025-08-01"
      aboutName="Hacettepe İşitme Samsun"
    >
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Proje Özeti</h2>
        <p>
          Hacettepe İşitme, Samsun&apos;da hizmet veren bir işitme merkezi olarak dijitalde güvenilir
          ve erişilebilir bir kurumsal kimliğe ihtiyaç duydu. Ziyaretçilerin hizmetleri hızlıca
          anlayıp iletişime geçebileceği sade bir yapı hedeflendi.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Çözüm</h2>
        <p>
          Kurumsal web sitesi; hizmet tanıtımı, merkez bilgileri ve güven unsurlarını öne çıkaran bir
          bilgi mimarisiyle tasarlandı. Yerel arama (Samsun işitme merkezi vb.) için sayfa yapısı ve
          içerik başlıkları SEO uyumlu kurgulandı. Site Railway üzerinde canlı yayına alındı.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Sonuç</h2>
        <p>
          Merkez, dijital vitrinini profesyonel biçimde kullanmaya başladı. Proje, sağlık ve yerel
          işletme odaklı kurumsal web tasarım portföyümüzde referans çalışma olarak yer almaktadır.
        </p>
      </section>
    </CaseStudyLayout>
  )
}
