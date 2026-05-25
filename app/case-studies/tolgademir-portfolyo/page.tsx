import type { Metadata } from 'next'
import CaseStudyLayout from '@/components/CaseStudyLayout'
import { bilingualDescription, bilingualKeywords } from '@/lib/seo-bilingual'

export const metadata: Metadata = {
  title: 'Tolga Demir Portfolyo | Portfolio Case Study | Başarı Hikayesi',
  description: bilingualDescription(
    'Metin ve hikâye yazarı Tolga Demir için Next.js portfolyo sitesi (tolgademir.org). Kişisel marka ve mobil uyumlu web tasarım — Okan Demir.',
    'Next.js portfolio website for author Tolga Demir (tolgademir.org). Personal brand, fast performance, mobile-first web design by Okan Demir.'
  ),
  keywords: bilingualKeywords(
    [
      'Tolga Demir web sitesi',
      'portfolyo web tasarım',
      'başarı hikayesi',
      'Next.js portfolyo',
      'Okan Demir projeler',
      'kişisel marka web sitesi',
    ],
    [
      'Tolga Demir website',
      'portfolio web design',
      'case study',
      'Next.js portfolio',
      'Okan Demir projects',
      'personal brand website',
      'writer portfolio Turkey',
    ]
  ),
  openGraph: {
    title: 'Tolga Demir Portfolio | Case Study | Okan Demir',
    description: bilingualDescription(
      'tolgademir.org — profesyonel portfolyo ve kişisel marka sitesi.',
      'tolgademir.org — professional portfolio and personal brand website project.'
    ),
    url: 'https://okandemir.org/case-studies/tolgademir-portfolyo',
    type: 'article',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
  },
  alternates: {
    canonical: 'https://okandemir.org/case-studies/tolgademir-portfolyo',
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
