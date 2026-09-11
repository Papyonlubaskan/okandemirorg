import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import WhatsAppCtaCard from '@/components/WhatsAppCtaCard'
import { FUNNEL, formatTry } from '@/lib/digital-products'
import { leadWhatsAppUrl, productWhatsAppUrl } from '@/lib/bank-transfer'
import { SITE_URL } from '@/lib/brand-seo'

export const metadata: Metadata = {
  title: 'Ücretsiz: KOBİ’lerin 7 SEO Hatası | Okan Demir',
  description:
    'Küçük işletmelerin en sık yaptığı 7 SEO hatası. WhatsApp’tan ücretsiz rehber isteyin.',
  alternates: { canonical: `${SITE_URL}${FUNNEL.leadHref}` },
}

const POINTS = [
  'Title / description hataları',
  'H1 ve içerik düzeni',
  'Google İşletme Profili',
  'Anahtar kelime doldurma',
  'Mobil / hız',
  'CTA eksikliği',
  'Ölçüm yokluğu',
]

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
              Özeti aşağıda. Tam rehber için WhatsApp’tan yazmanız yeterli.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">7 başlık</h2>
              <ul className="space-y-2">
                {POINTS.map((p, i) => (
                  <li key={p}>
                    ✓ {i + 1}. {p}
                  </li>
                ))}
              </ul>
              <p>
                Sonraki adım:{' '}
                <Link href={FUNNEL.kitHref} className="text-blue-600 font-black hover:underline">
                  KOBİ Dijital Başlangıç Kiti ({formatTry(890)})
                </Link>
              </p>
            </div>
            <div className="space-y-4">
              <WhatsAppCtaCard
                href={leadWhatsAppUrl()}
                title="Ücretsiz rehberi iste"
                subtitle="WhatsApp’tan yazın; rehberi size özel ileteyim."
                label="WhatsApp’tan rehber iste"
              />
              <a
                href={productWhatsAppUrl('KOBİ Dijital Başlangıç Kiti', formatTry(890))}
                className="block text-center font-black text-blue-600 hover:underline"
              >
                Direkt kit için yaz →
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
