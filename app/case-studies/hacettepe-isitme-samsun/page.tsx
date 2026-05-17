import type { Metadata } from 'next'
import CaseStudyLayout from '@/components/CaseStudyLayout'

export const metadata: Metadata = {
  title: 'Hacettepe İşitme Samsun Kurumsal Web Sitesi Case Study',
  description:
    'Samsun işitme merkezi Hacettepe İşitme için kurumsal web sitesi. Yerel SEO, hizmet tanıtımı ve güven odaklı tasarım — Okan Demir web tasarım projesi.',
  keywords: [
    'Samsun işitme merkezi web sitesi',
    'kurumsal web tasarım Samsun',
    'sağlık sektörü web sitesi',
    'Okan Demir projeler',
    'Hacettepe İşitme',
  ],
  openGraph: {
    title: 'Hacettepe İşitme Samsun | Okan Demir Case Study',
    description: 'Samsun işitme merkezi kurumsal web sitesi — yerel SEO ve hizmet odaklı tasarım.',
    url: 'https://okandemir.org/case-studies/hacettepe-isitme-samsun',
    type: 'article',
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
