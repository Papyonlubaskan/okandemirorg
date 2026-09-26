import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import WhatsAppCtaCard from '@/components/WhatsAppCtaCard'
import { getProductBySlug, FUNNEL, formatTry } from '@/lib/digital-products'
import { productWhatsAppUrl } from '@/lib/bank-transfer'
import { PERSON_ID, SITE_URL } from '@/lib/brand-seo'

const product = getProductBySlug('ai-seo-denetim')!
const PAGE_PATH = FUNNEL.aiAuditHref

export const metadata: Metadata = {
  title: `${product.name} | Okan Demir`,
  description: product.shortDescription,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: {
    title: `${product.name} | Okan Demir`,
    description: product.shortDescription,
    url: `${SITE_URL}${PAGE_PATH}`,
    type: 'website',
  },
}

export default function AiDenetimPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: { '@type': 'Brand', name: 'Okan Demir' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.priceTry,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}${PAGE_PATH}`,
      seller: { '@id': PERSON_ID },
    },
  }

  const wa = productWhatsAppUrl(product.name, formatTry(product.priceTry))

  return (
    <>
      <BreadcrumbJsonLd
        id="ai-denetim-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: product.name, path: PAGE_PATH },
        ]}
      />
      <Script
        id="ai-denetim-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 lg:py-20 bg-gradient-to-br from-teal-700 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <p className="text-teal-100 font-medium mb-3">
              <Link href="/hizmetler" className="underline hover:text-white">
                Hizmetler
              </Link>
              {' · '}
              Self-serve · WhatsApp
            </p>
            <h1 className="text-4xl lg:text-6xl font-black mb-4">{product.name}</h1>
            <p className="text-xl text-teal-50/90 max-w-3xl mx-auto mb-6">{product.shortDescription}</p>
            <p className="text-3xl font-black">{formatTry(product.priceTry)}</p>
            <p className="mt-3 text-sm text-teal-100/80">
              İnsanlı denetim ayrı: {formatTry(3900)} —{' '}
              <Link href={FUNNEL.auditHref} className="underline">
                Dijital İşletme Denetimi
              </Link>
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Nasıl çalışır?</h2>
              <ol className="space-y-3 text-gray-700 dark:text-gray-200 list-decimal list-inside font-medium">
                <li>WhatsApp’tan sipariş → ödeme onayı</li>
                <li>Panel linki otomatik gelir</li>
                <li>Site URL’nizi yapıştırın</li>
                <li>AI rapor + WhatsApp özeti</li>
              </ol>
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              <ul className="space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-teal-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <WhatsAppCtaCard
              href={wa}
              title="WhatsApp ile sipariş"
              subtitle={`${product.name} · ${formatTry(product.priceTry)}`}
            />
          </div>
        </section>
      </div>
    </>
  )
}
