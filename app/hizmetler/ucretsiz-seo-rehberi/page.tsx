import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import LeadMagnetForm from '@/components/LeadMagnetForm'
import { FUNNEL } from '@/lib/digital-products'
import { SITE_URL } from '@/lib/brand-seo'

export const metadata: Metadata = {
  title: 'Ücretsiz: KOBİ’lerin 7 SEO Hatası | Okan Demir',
  description:
    'Küçük işletmelerin en sık yaptığı 7 SEO hatası ve hızlı düzeltmeler. Ücretsiz rehber — e-posta ile teslim.',
  alternates: { canonical: `${SITE_URL}${FUNNEL.leadHref}` },
}

export default function UcretsizSeoRehberiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        id="lead-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: 'Ücretsiz SEO Rehberi', path: FUNNEL.leadHref },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-blue-100 mb-3">
              <Link href="/hizmetler" className="underline">
                Hizmetler
              </Link>
              {' · '}
              Ücretsiz başlangıç
            </p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">KOBİ’lerin Yaptığı 7 SEO Hatası</h1>
            <p className="text-xl text-blue-100">
              Kısa, uygulanabilir rehber. E-posta bırakın; indirme linki gelsin.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">İçinde neler var?</h2>
              <ul className="space-y-2">
                <li>✓ Title / description hataları</li>
                <li>✓ H1 ve içerik düzeni</li>
                <li>✓ Google İşletme Profili</li>
                <li>✓ Mobil / hız</li>
                <li>✓ CTA ve ölçüm</li>
              </ul>
              <p>
                Sonraki adım:{' '}
                <Link href={FUNNEL.kitHref} className="text-blue-600 font-black hover:underline">
                  KOBİ Dijital Başlangıç Kiti
                </Link>
              </p>
            </div>
            <LeadMagnetForm />
          </div>
        </section>
      </div>
    </>
  )
}
