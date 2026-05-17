import type { Metadata } from 'next'
import CaseStudyLayout from '@/components/CaseStudyLayout'

export const metadata: Metadata = {
  title: 'Tolga Demir Portfolyo Web Sitesi Case Study',
  description:
    'Metin ve hikâye yazarı Tolga Demir için Next.js portfolyo sitesi. Kişisel marka, hızlı performans ve mobil uyumlu web tasarım projesi — Okan Demir.',
  keywords: [
    'Tolga Demir web sitesi',
    'portfolyo web tasarım',
    'Next.js portfolyo',
    'Okan Demir projeler',
    'kişisel marka web sitesi',
  ],
  openGraph: {
    title: 'Tolga Demir Portfolyo Sitesi | Okan Demir Case Study',
    description: 'tolgademir.org — profesyonel portfolyo ve kişisel marka web sitesi projesi.',
    url: 'https://okandemir.org/case-studies/tolgademir-portfolyo',
    type: 'article',
  },
}

export default function TolgaDemirCaseStudyPage() {
  return (
    <CaseStudyLayout
      slug="tolgademir-portfolyo"
      headline="Tolga Demir Portfolyo Web Sitesi"
      subtitle="Metin ve hikâye yazarı için modern, hızlı ve mobil uyumlu kişisel marka sitesi"
      tags={['Next.js', 'Portfolyo', 'Web Tasarım', 'Kişisel Marka']}
      liveUrl="https://tolgademir.org"
      liveLabel="tolgademir.org — Canlı Site"
      datePublished="2025-06-01"
      aboutName="tolgademir.org"
    >
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Proje Özeti</h2>
        <p>
          Tolga Demir, metin ve hikâye yazarlığı alanında kişisel markasını dijitalde güçlendirmek için
          modern bir portfolyo sitesine ihtiyaç duydu. Amaç; eserlerini, hizmetlerini ve iletişim
          kanallarını ziyaretçilere net ve profesyonel biçimde sunmaktı.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Çözüm</h2>
        <p>
          Next.js tabanlı, hızlı yüklenen ve mobil öncelikli bir yapı kurgulandı. Tipografi ve renk
          paleti yazar kimliğini yansıtacak şekilde sade tutuldu; iletişim ve içerik alanları ön plana
          çıkarıldı.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Sonuç</h2>
        <p>
          Site canlıya alındı ve Tolga Demir tarafından aktif olarak kullanılmaktadır. Proje,
          kişisel marka ve portfolyo odaklı web tasarım referanslarımız arasında yer almaktadır.
        </p>
      </section>
    </CaseStudyLayout>
  )
}
